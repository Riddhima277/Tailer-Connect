// models/ProfileModel.js
var mongoose = require("mongoose");
let SchemaClass = mongoose.Schema;

let colDesign = {
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    enum: ["customer", "tailor"],
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  isVerified: {           // ← NEW: false until OTP is confirmed
    type: Boolean,
    default: false,
  },
};

let ver = { timestamps: true };

let collectionObj = new SchemaClass(colDesign, ver);
let ProfileColRef = mongoose.model("ProfileCollection", collectionObj);

module.exports = ProfileColRef;