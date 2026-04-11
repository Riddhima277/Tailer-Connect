
var TailorProfile = require("../models/tailor_pro");

// ─── Speciality alias map ─────────────────────────────────────────────────────

var SPECIALITY_ALIASES = {
  // Kurta variations
  "kurta":        "kurta",
  "kurtas":       "kurta",
  "kurtis":       "kurta",
  "kurti":        "kurta",
  // Alteration variations
  "alter":        "alter",
  "alters":       "alter",
  "alteration":   "alter",
  "alterations":  "alter",
  // Suit variations
  "suit":         "suit",
  "suits":        "suit",
  // Saree variations
  "saree":        "saree",
  "sarees":       "saree",
  "sari":         "saree",
  "saris":        "saree",
  // Lehenga variations
  "lehenga":      "lehenga",
  "lehnga":       "lehenga",
  "lehanga":      "lehenga",
  // Salwar variations
  "salwar":       "salwar",
  "shalwar":      "salwar",
  "salwar kameez":"salwar",
  // Sherwani variations
  "sherwani":     "sherwani",
  "sherwanis":    "sherwani",
  "shervani":     "sherwani",
  // Blouse variations
  "blouse":       "blouse",
  "blouses":      "blouse",
  // Gown variations
  "gown":         "gown",
  "gowns":        "gown",
  // Pathani variations
  "pathani":      "pathani",
  "pathan":       "pathani",
  // Blazer variations
  "blazer":       "blazer",
  "blazers":      "blazer",
  // Bridal variations
  "bridal":       "bridal",
  "bride":        "bridal",
  // Kids/uniform variations
  "kids":         "kids",
  "children":     "kids",
  "uniform":      "uniform",
  "uniforms":     "uniform",
};

// ─── Helper: normalize a single word using alias map ─────────────────────────
function normalizeWord(word) {
  var lower = word.toLowerCase().trim();
  return SPECIALITY_ALIASES[lower] || lower;
}

// ─── Helper: split input into words and normalize each ───────────────────────
// "Kurtas, Alters" → ["kurta", "alter"]
// "kurtis"         → ["kurta"]
// "suits blazers"  → ["suit", "blazer"]
function getSpecialityTerms(input) {
  return input
    .trim()
    .split(/[\s,،]+/)        // split on space, comma, or Urdu comma
    .filter(Boolean)
    .map(normalizeWord);
}

// ─── POST /find-tailor/search ─────────────────────────────────────────────────
var searchTailors = async function (req, res) {
  try {
    var { city, category, speciality, workType } = req.body;
    var query = {};

    // ── City filter (matches homeCity OR shopCity) ──
    if (city && city.trim()) {
      query.$or = [
        { city:     { $regex: city.trim(), $options: "i" } },
        { shopCity: { $regex: city.trim(), $options: "i" } },
      ];
    }

    // ── Category filter ──
    if (category && category !== "") {
      query.category = { $in: [category, "Both"] };
    }

    // ── Speciality filter (multi-word + alias aware) ──
    // Example: user types "kurtas" → normalizes to "kurta" → regex matches
    // "Kurta Pyjama", "Kurtas", "Kurtis" etc. in the tailor's speciality field.
    // If multiple words: "kurtas suits" → tailor must match BOTH terms (AND logic).
    if (speciality && speciality.trim()) {
      var terms = getSpecialityTerms(speciality);

      if (terms.length === 1) {
        // Single term — simple regex
        query.speciality = { $regex: terms[0], $options: "i" };
      } else {
        // Multiple terms — tailor's speciality must contain ALL of them (AND)
        query.$and = query.$and || [];
        terms.forEach(function (term) {
          query.$and.push({
            speciality: { $regex: term, $options: "i" },
          });
        });
      }
    }

    // ── Work type filter ──
    if (workType && workType !== "") {
      query.workType = { $in: [workType, "Both"] };
    }

    var docs = await TailorProfile.find(query)
      .select("-aadhaarNo -aadhaarFile")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      status: true,
      message: docs.length + " tailor(s) found",
      docs,
    });
  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
};

// ─── GET /find-tailor/all ─────────────────────────────────────────────────────
var getAllTailors = async function (req, res) {
  try {
    var docs = await TailorProfile.find()
      .select("-aadhaarNo -aadhaarFile")
      .sort({ createdAt: -1 })
      .lean();
    return res.status(200).json({ status: true, message: "All tailors fetched", docs });
  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
};

// ─── GET /find-tailor/:id ─────────────────────────────────────────────────────
var getTailorById = async function (req, res) {
  try {
    var doc = await TailorProfile.findById(req.params.id)
      .select("-aadhaarNo -aadhaarFile")
      .lean();
    if (!doc) return res.status(404).json({ status: false, message: "Tailor not found" });
    return res.status(200).json({ status: true, message: "Tailor fetched", doc });
  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
};

module.exports = { searchTailors, getAllTailors, getTailorById };