const express = require("express");
const { ObjectId } = require("mongodb");
const { getDB } = require("../db");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

const REPORT_TYPES = [
  "Video is not playing",
  "Wrong movie or series information",
  "Inappropriate or illegal content",
  "Problem with the website",
  "Other",
];

// cut text to a safe length
const clip = (text, max) => String(text || "").trim().slice(0, max);
const emailOk = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Simple spam guard: one computer can send at most 5 messages in 10 minutes
const hits = new Map();
function limit(req, res, next) {
  const now = Date.now();
  const recent = (hits.get(req.ip) || []).filter((time) => now - time < 10 * 60 * 1000);
  if (recent.length >= 5) {
    return res.status(429).json({ message: "Too many messages. Please try again in a few minutes." });
  }
  recent.push(now);
  hits.set(req.ip, recent);
  next();
}

// POST /api/support/contact  -> anyone can send a message to the team
router.post("/contact", limit, async (req, res) => {
  try {
    const name = clip(req.body.name, 80);
    const email = clip(req.body.email, 120).toLowerCase();
    const subject = clip(req.body.subject, 120);
    const message = clip(req.body.message, 2000);

    if (!name || !email || !message) {
      return res.status(400).json({ message: "Name, email and message are required" });
    }
    if (!emailOk(email)) {
      return res.status(400).json({ message: "Enter a valid email address" });
    }
    if (message.length < 10) {
      return res.status(400).json({ message: "Please write a little more, at least 10 characters" });
    }

    await getDB().collection("messages").insertOne({
      kind: "contact",
      name,
      email,
      subject,
      message,
      status: "open",
      createdAt: new Date(),
    });
    res.status(201).json({ message: "Thank you. Your message has been sent to the MovieNest team." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// POST /api/support/report  -> a logged-in user reports a problem
router.post("/report", verifyToken, limit, async (req, res) => {
  try {
    const reportType = clip(req.body.reportType, 80);
    const message = clip(req.body.message, 2000);
    const contentId = clip(req.body.contentId, 40);

    if (!REPORT_TYPES.includes(reportType)) {
      return res.status(400).json({ message: "Choose what kind of problem it is" });
    }
    if (message.length < 10) {
      return res.status(400).json({ message: "Please describe the problem, at least 10 characters" });
    }

    const db = getDB();
    const user = await db.collection("users").findOne({ _id: new ObjectId(req.user.id) });
    if (!user) return res.status(401).json({ message: "Please log in again" });

    // optional: which movie or series the report is about
    let contentRef = null;
    let contentTitle = "";
    if (contentId) {
      if (!ObjectId.isValid(contentId)) {
        return res.status(400).json({ message: "That title does not exist" });
      }
      const item = await db.collection("content").findOne({ _id: new ObjectId(contentId) });
      if (!item) return res.status(400).json({ message: "That title does not exist" });
      contentRef = item._id;
      contentTitle = item.title;
    }

    await db.collection("messages").insertOne({
      kind: "report",
      reportType,
      userId: user._id,
      name: user.name,
      email: user.email,
      contentId: contentRef,
      contentTitle,
      message,
      status: "open",
      createdAt: new Date(),
    });
    res.status(201).json({ message: "Thank you. Your report was sent and the team will look at it." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
