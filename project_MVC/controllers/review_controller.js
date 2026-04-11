const ReviewColRef = require("../models/review_model");
const TailorColRef = require("../models/tailor_pro"); // ← must be same file as find_tailorController uses

// ================= CREATE REVIEW =================
async function doCreateReview(req, resp) {
  try {
    const { tailorContact, star, review } = req.body;
    if (!tailorContact || !star) {
      return resp.status(400).json({
        status: false,
        msg: "Tailor contact and star rating are required",
      });
    }

    const tailor = await TailorColRef.findOne({ contact: tailorContact });
    if (!tailor) {
      return resp.status(404).json({
        status: false,
        msg: "Tailor not found with this contact number",
      });
    }

    const newReview = new ReviewColRef({
      tailorContact,
      tailorName: tailor.name,
      star,
      review: review || "",
    });
    const doc = await newReview.save();

    // ── Recalculate rating & reviewCount on the tailor document ──
    const allReviews = await ReviewColRef.find({ tailorContact });
    const reviewCount = allReviews.length;
    const avgRating   = allReviews.reduce((sum, r) => sum + r.star, 0) / reviewCount;
    await TailorColRef.findOneAndUpdate(
      { contact: tailorContact },
      { rating: Math.round(avgRating * 10) / 10, reviewCount }
    );

    resp.status(200).json({ status: true, msg: "Review published successfully", doc });
  } catch (err) {
    resp.status(500).json({ status: false, msg: err.message });
  }
}

// ================= GET REVIEWS BY CONTACT =================
async function doGetReviewsByContact(req, resp) {
  try {
    const { tailorContact } = req.body;
    if (!tailorContact) {
      return resp.status(400).json({ status: false, msg: "Tailor contact is required" });
    }
    const docs = await ReviewColRef.find({ tailorContact }).sort({ createdAt: -1 });
    resp.status(200).json({ status: true, count: docs.length, docs });
  } catch (err) {
    resp.status(500).json({ status: false, msg: err.message });
  }
}

// ================= GET ALL REVIEWS =================
async function doGetAllReviews(req, resp) {
  try {
    const docs = await ReviewColRef.find().sort({ createdAt: -1 });
    resp.status(200).json({ status: true, count: docs.length, docs });
  } catch (err) {
    resp.status(500).json({ status: false, msg: err.message });
  }
}

// ================= DELETE REVIEW =================
async function doDeleteReview(req, resp) {
  try {
    const { id } = req.body;
    if (!id) {
      return resp.status(400).json({ status: false, msg: "Review ID is required" });
    }
    const result = await ReviewColRef.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      return resp.status(404).json({ status: false, msg: "Review not found" });
    }
    resp.status(200).json({ status: true, msg: "Review deleted successfully" });
  } catch (err) {
    resp.status(500).json({ status: false, msg: err.message });
  }
}

// ================= FIND TAILOR BY CONTACT (for onBlur lookup) =================
async function doFindTailorByContact(req, resp) {
  try {
    const { contact } = req.body;
    if (!contact) {
      return resp.status(400).json({ status: false, msg: "Contact number is required" });
    }
    const doc = await TailorColRef.findOne(
      { contact },
      { name: 1, profilePic: 1, city: 1, category: 1, speciality: 1 }
    );
    if (!doc) {
      return resp.status(404).json({ status: false, msg: "Tailor not found" });
    }
    resp.status(200).json({ status: true, doc });
  } catch (err) {
    resp.status(500).json({ status: false, msg: err.message });
  }
}

module.exports = {
  doCreateReview,
  doGetReviewsByContact,
  doGetAllReviews,
  doDeleteReview,
  doFindTailorByContact,
};