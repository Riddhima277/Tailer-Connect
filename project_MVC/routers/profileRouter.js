// routes/profileRouter.js
var express = require("express");
var router  = express.Router();
var profileController = require("../controllers/profileController");
const { validateToken } = require("../config/validatetoken");

// ── OTP-based signup flow ──
router.post("/send-otp",   profileController.sendOtp);    // Step 1: validate + send OTP
router.post("/verify-otp", profileController.verifyOtp);  // Step 2: confirm OTP + create user
router.post("/resend-otp", profileController.resendOtp);  // Optional: get a fresh OTP


router.post("/signup", profileController.signup);  
router.post("/login",  profileController.login);
router.post("/logout", validateToken, profileController.logout);

module.exports = router;