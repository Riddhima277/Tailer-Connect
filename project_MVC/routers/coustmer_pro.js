var express = require("express");
var router = express.Router();
var customerController = require("../controllers/customer_pro");
const { validateToken } = require("../config/validatetoken");

// ================= CREATE =================
router.post("/create", validateToken, customerController.doSignupWithPic);
// ================= FIND =================
router.post("/find", validateToken, customerController.doFindWithPic);
// ================= UPDATE =================
router.post("/update", validateToken, customerController.doUpdateWithPic);
// ================= DELETE =================
router.post("/delete", validateToken, customerController.doDeleteWithPic);

module.exports = router;