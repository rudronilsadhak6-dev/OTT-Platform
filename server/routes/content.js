const express = require("express");
const { ObjectId } = require("mongodb");
const { getDB } = require("../db");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

// makes search text safe to use inside a regex
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// GET /api/content?type=movie&search=bunny&genre=Animation
router.get("/", verifyToken, async (req, res) => {
  try {
    const { type, search, genre } = req.query;
    const filter = {};
    if (type === "movie" || type === "series") filter.type = type;
    if (genre) filter.genre = genre;
    if (search) filter.title = { $regex: escapeRegex(search), $options: "i" };

    const items = await getDB()
      .collection("content")
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET /api/content/:id  -> one movie or series (also counts one view)
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(404).json({ message: "This title does not exist" });
    }
    const content = getDB().collection("content");
    await content.updateOne({ _id: new ObjectId(id) }, { $inc: { views: 1 } });
    const item = await content.findOne({ _id: new ObjectId(id) });
    if (!item) {
      return res.status(404).json({ message: "This title does not exist" });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
