const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tailorProfileSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female", "Other"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^\S+@\S+\.\S+$/,
    },
    contact: {
      type: String,
      required: true,
      match: /^[0-9]{10}$/,
    },
    aadhaarNo: {
      type: String,
      required: true,
      unique: true,
      match: /^[0-9]{12}$/,
    },
    profilePic: {
      type: String,
      default: "",
    },
    aadhaarFile: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
    },
    speciality: {
      type: String,
      default: "",
    },
    since: {
      type: Date,
      required: true,
    },
    workType: {
      type: String,
      required: true,
      enum: ["Home", "Shop", "Both"],
    },
    shopAddress: {
      type: String,
      default: "",
    },
    shopCity: {
      type: String,
      default: "",
    },
    otherInfo: {
      type: String,
      default: "",
    },
    socialLinks: [
      {
        platform: {
          type: String,
          trim: true,
        },
        url: {
          type: String,
          trim: true,
        },
      },
    ],

    // ── Added for reviews & ratings ──
    rating: {
      type: Number,
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const TailorProfileColRef = mongoose.model(
  "TailorProfileCollection",
  tailorProfileSchema
);

module.exports = TailorProfileColRef;