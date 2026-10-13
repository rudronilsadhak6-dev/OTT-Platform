const express = require("express");
const { ObjectId } = require("mongodb");
const { getDB } = require("../db");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

// GET /api/watchlist  -> all titles the logged-in user saved
router.get("/", verifyToken, async (req, res) => {
  try {
    const db = getDB();
    const user = await db.collection("users").findOne({ _id: new ObjectId(req.user.id) });
    if (!user) return res.status(404).json({ message: "User not found" });

    const ids = user.watchlist || [];
    const items = await db.collection("content").find({ _id: { $in: ids } }).toArray();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// POST /api/watchlist/:contentId  -> add to watch later
router.post("/:contentId", verifyToken, async (req, res) => {
  try {
    const { contentId } = req.params;
    if (!ObjectId.isValid(contentId)) return res.status(404).json({ message: "Title not found" });

    const db = getDB();
    const item = await db.collection("content").findOne({ _id: new ObjectId(contentId) });
    if (!item) return res.status(404).json({ message: "Title not found" });

    // $addToSet adds only if it is not already in the list
    await db.collection("users").updateOne(
      { _id: new ObjectId(req.user.id) },
      { $addToSet: { watchlist: item._id } }
    );
    res.json({ message: "Added to Watch Later" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// DELETE /api/watchlist/:contentId  -> remove from watch later
router.delete("/:contentId", verifyToken, async (req, res) => {
  try {
    const { contentId } = req.params;
    if (!ObjectId.isValid(contentId)) return res.status(404).json({ message: "Title not found" });

    await getDB().collection("users").updateOne(
      { _id: new ObjectId(req.user.id) },
      { $pull: { watchlist: new ObjectId(contentId) } }
    );
    res.json({ message: "Removed from Watch Later" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
