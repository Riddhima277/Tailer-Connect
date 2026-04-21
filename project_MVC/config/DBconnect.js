const mongoose = require("mongoose");

async function connectToMongoDB() {
  if (mongoose.connection.readyState >= 1) {
    console.log("✅ Already connected");
    return;
  }

  await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 30000,
    bufferCommands: true,
  });

  console.log("✅ MongoDB Atlas Connected");
}

module.exports = { connectToMongoDB };