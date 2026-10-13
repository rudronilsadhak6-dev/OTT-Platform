const { MongoClient } = require("mongodb");
const { DB_URL, DB_NAME } = require("./config");

const client = new MongoClient(DB_URL);
let db; // we keep the database here after connecting

async function connectDB() {
  await client.connect();          // database connection
  db = client.db(DB_NAME);         // database ( building / house )
  await db.collection("users").createIndex({ email: 1 }, { unique: true });
  console.log("DB Connected");
}

// Any route file can call getDB() to use the database
function getDB() {
  return db;
}

module.exports = { connectDB, getDB };
