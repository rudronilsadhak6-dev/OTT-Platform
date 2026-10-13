// Run:  node export-data.js
// Saves your users and movies/series from MongoDB into the "data" folder,
// so another computer can load exactly the same data.

const fs = require("fs");
const path = require("path");
const { MongoClient } = require("mongodb");
const { EJSON } = require("bson");
const { DB_URL, DB_NAME } = require("../server/config");

const dataDir = path.join(__dirname, "data");
const collections = ["users", "content"];

async function run() {
  const client = new MongoClient(DB_URL);
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    fs.mkdirSync(dataDir, { recursive: true });

    for (const name of collections) {
      const docs = await db.collection(name).find({}).toArray();
      fs.writeFileSync(path.join(dataDir, `${name}.json`), EJSON.stringify(docs, null, 2));
      console.log(`${name}: saved ${docs.length} documents`);
    }
    console.log("Export done. Files are in the database/data folder.");
  } catch (error) {
    console.log("Export failed. Is MongoDB running?", error.message);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

run();
