var express = require("express");
var router = express.Router();
var tailorController = require("../controllers/tailor_pro");
const { validateToken } = require("../config/validatetoken");

// ================= CREATE =================
router.post("/create", validateToken, tailorController.doSignupWithPic);
// ================= FIND =================
router.post("/find", validateToken, tailorController.doFindWithPic);
// ================= UPDATE =================
router.post("/update", validateToken, tailorController.doUpdateWithPic);
// ================= DELETE =================
router.post("/delete", validateToken, tailorController.doDeleteWithPic);
// ================= OCR EXTRACT =================
router.post("/extract-aadhaar", validateToken, tailorController.doExtractAadhaar);

module.exports = router;