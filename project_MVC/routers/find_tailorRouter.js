// routers/find_tailorRouter.js
var express = require("express");
var router  = express.Router();
var { searchTailors, getAllTailors, getTailorById } = require("../controllers/find_tailorController");

// POST /find-tailor/search   → { city, category, speciality, workType }
router.post("/search",  searchTailors);

// GET  /find-tailor/all
router.get("/all",      getAllTailors);

// GET  /find-tailor/:id
router.get("/:id",      getTailorById);

module.exports = router;