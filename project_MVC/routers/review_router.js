var express = require("express");
var router = express.Router();
var reviewController = require("../controllers/review_controller");

// Find tailor by contact (onBlur in RateAndReview)
router.post("/findTailor", reviewController.doFindTailorByContact);

// Create a new review
router.post("/create", reviewController.doCreateReview);

// Get all reviews for a specific tailor
router.post("/getByContact", reviewController.doGetReviewsByContact);

// Get all reviews (admin use)
router.post("/getAll", reviewController.doGetAllReviews);

// Delete a review by _id
router.post("/delete", reviewController.doDeleteReview);

module.exports = router; 