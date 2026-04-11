const mongoose = require("mongoose");

function connectToMongoDB() {
  mongoose.connect(
    "mongodb+srv://guptariddhima75_db_user:7GeWYOzMcRuZUQrl@newproject.bdcvd5p.mongodb.net/?appName=newProject"
  )
  .then(() => console.log("✅ MongoDB Atlas Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err.message));
}

module.exports = { connectToMongoDB };