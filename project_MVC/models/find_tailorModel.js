// models/Tailor.js
const mongoose = require("mongoose");

const socialLinkSchema = new mongoose.Schema(
  {
    platform: { type: String },
    url: { type: String },
  },
  { _id: false }
);

const tailorSchema = new mongoose.Schema(
  {
    name:       { type: String, required: true, trim: true },
    email:      { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:   { type: String, required: true },
    contact:    { type: String, required: true },
    profilePic: { type: String, default: "" },
    city:       { type: String, required: true, trim: true },
    shopCity:   { type: String, default: "" },
    address:    { type: String, required: true },
    category:   { type: String, enum: ["Men", "Women", "Children", "Both"], required: true },
    speciality: { type: String, required: true },
    workType:   { type: String, enum: ["Home", "Shop", "Both"], required: true },
    since:      { type: String },
    dob:        { type: String },
    gender:     { type: String },
    otherInfo:  { type: String, default: "" },
    socialLinks:{ type: [socialLinkSchema], default: [] },
    rating:     { type: Number, default: 0 },
    reviewCount:{ type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tailor", tailorSchema);