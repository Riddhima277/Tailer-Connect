const mongoose = require("mongoose");

function connectToMongoDB() {
  mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Atlas Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err.message));
}

module.exports = { connectToMongoDB };