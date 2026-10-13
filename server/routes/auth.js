const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getDB } = require("../db");
const { JWT_SECRET } = require("../config");

const router = express.Router();

// POST /api/auth/register  -> create a new user account
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const users = getDB().collection("users");
    const cleanEmail = email.trim().toLowerCase();

    const exists = await users.findOne({ email: cleanEmail });
    if (exists) {
      return res.status(400).json({ message: "An account with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // never save plain passwords

    const result = await users.insertOne({
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      role: "user",
      watchlist: [],
      createdAt: new Date(),
      lastLogin: null,
    });

    res.status(201).json({ message: "Account created. You can log in now.", id: result.insertedId });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// POST /api/auth/login  -> check email + password, give back a token
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Enter your email and password" });
    }

    const users = getDB().collection("users");
    const user = await users.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: "Wrong email or password" });
    }

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      return res.status(400).json({ message: "Wrong email or password" });
    }

    // remember when the user last logged in (admin dashboard uses this)
    await users.updateOne({ _id: user._id }, { $set: { lastLogin: new Date() } });

    const token = jwt.sign(
      { id: user._id.toString(), name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
