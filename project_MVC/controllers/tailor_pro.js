const path = require("path");
const TailorColRef = require("../models/tailor_pro");
const cloudinary = require("cloudinary").v2;
const Tesseract = require("tesseract.js");

cloudinary.config({
  cloud_name: "dd4gjrvez",
  api_key: "688973355443826",
  api_secret: "Buyjf6_c5x3d2EtOhN8udhHoF_c",
});

// ================= OCR HELPER =================

async function extractAadhaarData(filePath) {
  try {
    const { data: { text } } = await Tesseract.recognize(filePath, "eng", {
      logger: (m) => console.log(m),
    });

    console.log("OCR TEXT:", text);

    const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

    let gender = "";
    let addressLines = [];
    let aadhaarNumber = "";
    let city = "";

    // Extract Aadhaar Number (12 digits)
    const aadhaarMatch = text.match(/\b\d{4}\s?\d{4}\s?\d{4}\b/);
    aadhaarNumber = aadhaarMatch ? aadhaarMatch[0].replace(/\s/g, "") : "";

    // Gender detection
    const lowerText = text.toLowerCase();
    if (/\bfemale\b/.test(lowerText)) gender = "Female";
    else if (/\bmale\b/.test(lowerText)) gender = "Male";

    // Extract Address & City
    const addrStartIndex = lines.findIndex((l) => /Address/i.test(l));
    if (addrStartIndex !== -1) {
      for (let i = addrStartIndex + 1; i < lines.length; i++) {
        const line = lines[i];
        if (/^\s*(S\/O|D\/O|C\/O)\b/i.test(line)) continue;
        const pinMatch = line.match(/\b\d{6}\b/);
        if (pinMatch) {
          city = line.replace(/\b\d{6}\b/, "").replace(/[-,]$/, "").trim();
          break;
        }
        addressLines.push(line);
      }
    }

    return {
      aadhaarNo: aadhaarNumber,
      gender,
      address: addressLines.join(", "),
      city,
    };
  } catch (err) {
    console.error("OCR failed:", err.message);
    return { aadhaarNo: "", gender: "", address: "", city: "" };
  }
}

// ================= CREATE =================

async function doSignupWithPic(req, resp) {
  try {
    const {
      name, email, dob, gender, contact, aadhaarNo,
      address, city, category, since, workType,
    } = req.body;

    if (!name || !email || !dob || !gender || !contact || !aadhaarNo ||
        !address || !city || !category || !since || !workType) {
      return resp.status(400).json({ status: false, msg: "All required fields must be filled" });
    }

    const existing = await TailorColRef.findOne({ $or: [{ email }, { aadhaarNo }] });
    if (existing) {
      return resp.status(400).json({ status: false, msg: "Email or Aadhaar already exists" });
    }

    let profileUrl = "nopic.jpg";
    let aadhaarUrl = "";

    if (req.files?.profilePic) {
      const file = req.files.profilePic;
      const uploadPath = path.join(__dirname, "..", "uploads", file.name);
      await file.mv(uploadPath);
      const result = await cloudinary.uploader.upload(uploadPath);
      profileUrl = result.secure_url;
    }

    if (req.files?.aadhaarFile) {
      const file = req.files.aadhaarFile;
      const uploadPath = path.join(__dirname, "..", "uploads", file.name);
      await file.mv(uploadPath);
      const result = await cloudinary.uploader.upload(uploadPath);
      aadhaarUrl = result.secure_url;
    }

    req.body.profilePic = profileUrl;
    req.body.aadhaarFile = aadhaarUrl;

    if (req.body.socialLinks) {
      if (typeof req.body.socialLinks === "string") {
        req.body.socialLinks = JSON.parse(req.body.socialLinks);
      }
    } else {
      req.body.socialLinks = [];
    }

    const tailor = new TailorColRef(req.body);
    const doc = await tailor.save();

    resp.status(200).json({ status: true, msg: "Tailor saved successfully", doc });
  } catch (err) {
    resp.status(500).json({ status: false, msg: err.message });
  }
}

// ================= OCR EXTRACT (new route) =================

async function doExtractAadhaar(req, resp) {
  try {
    if (!req.files?.aadhaarFile) {
      return resp.status(400).json({ status: false, msg: "No aadhaar file uploaded" });
    }

    const file = req.files.aadhaarFile;
    const uploadPath = path.join(__dirname, "..", "uploads", file.name);
    await file.mv(uploadPath);

    // Run OCR
    const extracted = await extractAadhaarData(uploadPath);

    // Upload to cloudinary for preview URL
    const cloudResult = await cloudinary.uploader.upload(uploadPath);

    resp.status(200).json({
      status: true,
      previewUrl: cloudResult.secure_url,
      extracted, // { aadhaarNo, gender, address, city }
    });
  } catch (err) {
    resp.status(500).json({ status: false, msg: err.message });
  }
}

// ================= UPDATE =================

async function doUpdateWithPic(req, resp) {
  try {
    const { email } = req.body;

    if (!email) {
      return resp.status(400).json({ status: false, msg: "Email is required" });
    }

    let updateData = { ...req.body };

    if (req.files?.profilePic) {
      const file = req.files.profilePic;
      const uploadPath = path.join(__dirname, "..", "uploads", file.name);
      await file.mv(uploadPath);
      const result = await cloudinary.uploader.upload(uploadPath);
      updateData.profilePic = result.secure_url;
    }

    if (req.files?.aadhaarFile) {
      const file = req.files.aadhaarFile;
      const uploadPath = path.join(__dirname, "..", "uploads", file.name);
      await file.mv(uploadPath);
      const result = await cloudinary.uploader.upload(uploadPath);
      updateData.aadhaarFile = result.secure_url;
    }

    if (updateData.socialLinks) {
      if (typeof updateData.socialLinks === "string") {
        updateData.socialLinks = JSON.parse(updateData.socialLinks);
      }
    }

    const dbResult = await TailorColRef.updateOne(
      { email },
      { $set: updateData },
      { runValidators: true }
    );

    if (dbResult.matchedCount === 0) {
      return resp.status(404).json({ status: false, msg: "Tailor not found" });
    }

    resp.status(200).json({ status: true, msg: "Tailor updated successfully" });
  } catch (err) {
    resp.status(500).json({ status: false, msg: err.message });
  }
}

// ================= FIND =================

async function doFindWithPic(req, resp) {
  try {
    const { email } = req.body;
    const doc = await TailorColRef.findOne({ email });

    if (!doc) {
      return resp.status(404).json({ status: false, msg: "Tailor not found" });
    }

    resp.status(200).json({ status: true, doc });
  } catch (err) {
    resp.status(500).json({ status: false, msg: err.message });
  }
}

// ================= DELETE =================

async function doDeleteWithPic(req, resp) {
  try {
    const { email } = req.body;
    const tailor = await TailorColRef.findOne({ email });

    if (!tailor) {
      return resp.status(404).json({ status: false, msg: "Tailor not found" });
    }

    if (tailor.profilePic && tailor.profilePic !== "nopic.jpg") {
      const publicId = tailor.profilePic.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }

    if (tailor.aadhaarFile) {
      const publicId = tailor.aadhaarFile.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }

    await TailorColRef.deleteOne({ email });

    resp.status(200).json({ status: true, msg: "Tailor deleted successfully" });
  } catch (err) {
    resp.status(500).json({ status: false, msg: err.message });
  }
}

module.exports = {
  doSignupWithPic,
  doUpdateWithPic,
  doFindWithPic,
  doDeleteWithPic,
  doExtractAadhaar, 
};