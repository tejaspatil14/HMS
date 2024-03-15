const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoose = require("mongoose");

// MongoDB connection URI
const uri = "mongodb+srv://pranavkamble164:aZUFdLiRKkcLhARK@cluster01.v0uqueg.mongodb.net/myDatabase?retryWrites=true&w=majority&appName=Cluster01";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Function to establish the MongoDB connection
async function connectDB() {
  try {
    // Connect to the MongoDB server
    await client.connect();
    console.log("Connected to MongoDB Atlas");

    // Return the connected client
    return client;
  } catch (error) {
    console.error("Error connecting to MongoDB Atlas:", error);
    throw error; // Throw error for handling in the calling code
  }
}

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // Remove buffermaxentries option
  });

module.exports = connectDB;
