const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema(
  {
    tailorContact: {
      type: String,
      required: true,
      match: /^[0-9]{10}$/,
    },
    tailorName: {
      type: String,
      required: true,
      trim: true,
    },
    star: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    review: {
      type: String,
      default: "",
      trim: true,
      maxlength: 300,
    },
  },
  {
    timestamps: true,
  }
);

const ReviewColRef = mongoose.model("ReviewCollection", reviewSchema);
module.exports = ReviewColRef;