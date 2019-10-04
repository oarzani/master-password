const { MongoClient } = require("mongodb");

let db = null;
async function initDatabase() {
  const url = "mongodb://localhost:27017/master-password";

  const databaseName = "master-password";

  const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  // Use connect method to connect to the server
  await client.connect();

  db = client.db(databaseName);
}

async function getCollection(collectionName) {
  if (!db) {
    await initDatabase();
  }
  return db.collecion(collectionName);
}

exports.initDatabase = initDatabase;
exports.getCollection = getCollection;
