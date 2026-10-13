// Run:  node import-data.js
// Loads the users and movies/series saved by export-data.js into MongoDB.
// A collection that already has data is skipped, so your existing data is safe.
// To overwrite on purpose:  node import-data.js --replace

const fs = require("fs");
const path = require("path");
const { MongoClient } = require("mongodb");
const { EJSON } = require("bson");
const { DB_URL, DB_NAME } = require("../server/config");

const replace = process.argv.includes("--replace");
const dataDir = path.join(__dirname, "data");
const collections = ["users", "content"];

async function run() {
  const client = new MongoClient(DB_URL);
  try {
    await client.connect();
    const db = client.db(DB_NAME);

    for (const name of collections) {
      const file = path.join(dataDir, `${name}.json`);
      if (!fs.existsSync(file)) {
        console.log(`${name}: no ${name}.json found, skipped`);
        continue;
      }

      const docs = EJSON.parse(fs.readFileSync(file, "utf8"));
      const collection = db.collection(name);
      const existing = await collection.countDocuments();

      if (existing > 0 && !replace) {
        console.log(`${name}: already has ${existing} documents, skipped (use --replace to overwrite)`);
        continue;
      }
      if (replace) await collection.deleteMany({});
      if (docs.length > 0) await collection.insertMany(docs);
      console.log(`${name}: imported ${docs.length} documents`);
    }

    await db.collection("users").createIndex({ email: 1 }, { unique: true });
  } catch (error) {
    console.log("Import failed. Is MongoDB running?", error.message);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

run();
