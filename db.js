const { MongoClient } = require("mongodb");

// Connect to MongoDB
const uri =process.env.MONGO_URI;
const client = new MongoClient(uri);

async function connect() {
  // Connect the client to the server
  await client.connect();
  // Send a ping to confirm a successful connection
  await client.db("admin").command({ ping: 1 });
  console.log(
    "Pinged your deployment. You successfully connected to MongoDB!"
  );
}

async function getCollection(collectionName) {
  // Get a reference to the database
  const db = client.db("myDatabase");
  // Get a reference to the collection
  return db.collection(collectionName);
}

module.exports = { connect, getCollection };
