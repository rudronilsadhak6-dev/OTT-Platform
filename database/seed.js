// Run:  node seed.js
// Makes sure the admin account exists. Safe to run many times.

const { MongoClient } = require("mongodb");
const bcrypt = require("bcryptjs");
const { DB_URL, DB_NAME } = require("../server/config");

const ADMIN = {
  name: "Admin",
  email: "admin@ott.com",
  password: "admin123", // you can change this before running
};

async function seed() {
  const client = new MongoClient(DB_URL);
  try {
    await client.connect();
    console.log("DB Connected");

    const users = client.db(DB_NAME).collection("users");
    await users.createIndex({ email: 1 }, { unique: true });

    const existingAdmin = await users.findOne({ email: ADMIN.email });
    if (existingAdmin) {
      console.log("Admin already exists:", ADMIN.email);
    } else {
      await users.insertOne({
        name: ADMIN.name,
        email: ADMIN.email,
        password: await bcrypt.hash(ADMIN.password, 10),
        role: "admin",
        watchlist: [],
        createdAt: new Date(),
        lastLogin: null,
      });
      console.log(`Admin created -> email: ${ADMIN.email}  password: ${ADMIN.password}`);
    }
  } catch (error) {
    console.log("Seeding failed. Is MongoDB running?", error.message);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

seed();
