const express = require("express");
const { ObjectId } = require("mongodb");
const { getDB } = require("../db");
const { verifyToken, isAdmin } = require("../middleware/auth");

const router = express.Router();

// every route in this file needs: logged in + admin
router.use(verifyToken, isAdmin);

// GET /api/admin/stats  -> numbers for the dashboard
router.get("/stats", async (req, res) => {
  try {
    const db = getDB();
    const users = db.collection("users");
    const content = db.collection("content");
    const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const totalUsers = await users.countDocuments({ role: "user" });
    const activeUsers = await users.countDocuments({ role: "user", lastLogin: { $gte: last24h } });
    const totalMovies = await content.countDocuments({ type: "movie" });
    const totalSeries = await content.countDocuments({ type: "series" });

    const viewsResult = await content
      .aggregate([{ $group: { _id: null, total: { $sum: "$views" } } }])
      .toArray();
    const totalViews = viewsResult.length ? viewsResult[0].total : 0;

    const topContent = await content
      .find({}, { projection: { title: 1, type: 1, views: 1 } })
      .sort({ views: -1 })
      .limit(5)
      .toArray();

    const openMessages = await db.collection("messages").countDocuments({ status: "open" });

    res.json({ totalUsers, activeUsers, totalMovies, totalSeries, totalViews, topContent, openMessages });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET /api/admin/users  -> list of all users (without passwords)
router.get("/users", async (req, res) => {
  try {
    const users = await getDB()
      .collection("users")
      .find({ role: "user" }, { projection: { password: 0 } })
      .sort({ createdAt: -1 })
      .toArray();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// DELETE /api/admin/users/:id  -> remove a user
router.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(404).json({ message: "User not found" });
    await getDB().collection("users").deleteOne({ _id: new ObjectId(id), role: "user" });
    res.json({ message: "User removed" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Saves links without "http://localhost:8000" so they work on every computer
const cleanLink = (link) =>
  String(link || "")
    .trim()
    .replace(/^https?:\/\/(localhost|127\.0\.0\.1):8000/i, "");

// Checks the form data and turns it into a clean object for MongoDB
function buildContent(body) {
  const { title, description, type, genre, releaseYear, poster, videoUrl, episodes } = body;

  if (!title || !type) return { error: "Title and type are required" };
  if (type !== "movie" && type !== "series") return { error: "Type must be movie or series" };
  if (type === "movie" && !videoUrl) return { error: "A movie needs a video link" };

  let cleanEpisodes = [];
  if (type === "series") {
    cleanEpisodes = (Array.isArray(episodes) ? episodes : [])
      .filter((ep) => ep && ep.title && ep.videoUrl)
      .map((ep, index) => ({
        number: index + 1,
        title: String(ep.title).trim(),
        videoUrl: cleanLink(ep.videoUrl),
      }));
    if (cleanEpisodes.length === 0) {
      return { error: "A series needs at least one episode with a title and a video link" };
    }
  }

  return {
    data: {
      title: String(title).trim(),
      description: String(description || "").trim(),
      type,
      genre: String(genre || "").trim(),
      releaseYear: releaseYear ? Number(releaseYear) : null,
      poster: cleanLink(poster),
      videoUrl: type === "movie" ? cleanLink(videoUrl) : "",
      episodes: cleanEpisodes,
    },
  };
}

// GET /api/admin/content/:id  -> one title for the edit form (does not count a view)
router.get("/content/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(404).json({ message: "Title not found" });
    const item = await getDB().collection("content").findOne({ _id: new ObjectId(id) });
    if (!item) return res.status(404).json({ message: "Title not found" });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// POST /api/admin/content  -> add a movie or series
router.post("/content", async (req, res) => {
  try {
    const { data, error } = buildContent(req.body);
    if (error) return res.status(400).json({ message: error });

    const result = await getDB()
      .collection("content")
      .insertOne({ ...data, views: 0, createdAt: new Date() });
    res.status(201).json({ message: "Title added", id: result.insertedId });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// PUT /api/admin/content/:id  -> edit a movie or series
router.put("/content/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(404).json({ message: "Title not found" });

    const { data, error } = buildContent(req.body);
    if (error) return res.status(400).json({ message: error });

    await getDB().collection("content").updateOne({ _id: new ObjectId(id) }, { $set: data });
    res.json({ message: "Changes saved" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// DELETE /api/admin/content/:id  -> remove a movie or series
router.delete("/content/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(404).json({ message: "Title not found" });
    const db = getDB();
    const contentId = new ObjectId(id);

    await db.collection("content").deleteOne({ _id: contentId });
    // also remove it from every user's watch later list
    await db.collection("users").updateMany({}, { $pull: { watchlist: contentId } });

    res.json({ message: "Title removed" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET /api/admin/messages?kind=contact&status=open  -> contact messages and problem reports
router.get("/messages", async (req, res) => {
  try {
    const { kind, status } = req.query;
    const filter = {};
    if (kind === "contact" || kind === "report") filter.kind = kind;
    if (status === "open" || status === "resolved") filter.status = status;

    const items = await getDB()
      .collection("messages")
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(200)
      .toArray();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// PATCH /api/admin/messages/:id  -> mark a message open or resolved
router.patch("/messages/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!ObjectId.isValid(id)) return res.status(404).json({ message: "Message not found" });
    if (status !== "open" && status !== "resolved") {
      return res.status(400).json({ message: "Status must be open or resolved" });
    }
    await getDB().collection("messages").updateOne({ _id: new ObjectId(id) }, { $set: { status } });
    res.json({ message: "Updated" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// DELETE /api/admin/messages/:id  -> delete a message
router.delete("/messages/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(404).json({ message: "Message not found" });
    await getDB().collection("messages").deleteOne({ _id: new ObjectId(id) });
    res.json({ message: "Message deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
