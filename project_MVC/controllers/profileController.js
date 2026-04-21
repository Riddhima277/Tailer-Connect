// controllers/profileController.js
const jwt = require("jsonwebtoken");
var ProfileColRef = require("../models/ProfileModel");
var OtpColRef = require("../models/OtpModel");
var transporter = require("../config/node_mailer");
var {
  welcomeTemplate,
  loginTemplate,
  otpTemplate,
  resendOtpTemplate,
} = require("../config/mail_template");

// Helper: 6-digit OTP
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ================= SEND OTP =================
async function sendOtp(req, res) {
  try {
    let { email, password, userType, contact } = req.body;

    if (!email || !password || !userType || !contact) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // Check if a verified account already exists
    const existingUser = await ProfileColRef.findOne({ email });

    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({ msg: "User already exists. Please log in." });
    }

    // If an unverified doc exists, delete it
    if (existingUser && !existingUser.isVerified) {
      await ProfileColRef.deleteOne({ email });
    }

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Upsert OTP record — avoids duplicate key errors
    await OtpColRef.findOneAndUpdate(
      { email },
      { otp, expiresAt, userData: { email, password, userType, contact } },
      { upsert: true, new: true }
    );

    // Send OTP email
    const name = email.split("@")[0];
    const tmpl = otpTemplate(name, otp);

    let jtoken = jwt.sign({ email }, process.env.SEC_KEY, { expiresIn: "10m" });

    transporter.sendMail({
      from: `"TailorConnect ✂️" <${process.env.MAIL_USER}>`,
      to: email,
      subject: tmpl.subject,
      html: tmpl.html,
    }).catch((err) => console.error("OTP mail error:", err.message));

    return res.status(200).json({ msg: "OTP sent to your email", token: jtoken });

  } catch (err) {
    console.error("sendOtp error:", err.message);
    res.status(500).json({ msg: "Server Error", detail: err.message });
  }
}

// ================= VERIFY OTP =================
async function verifyOtp(req, res) {
  try {
    let { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ msg: "Email and OTP are required" });
    }

    // Fetch OTP record from MongoDB
    const record = await OtpColRef.findOne({ email });
    console.log("Stored OTP:", record?.otp, "| Entered:", otp);

    if (!record) {
      return res.status(400).json({ msg: "No OTP request found. Please sign up again." });
    }

    if (Date.now() > record.expiresAt.getTime()) {
      await OtpColRef.deleteOne({ email });
      return res.status(400).json({ msg: "OTP has expired. Please request a new one." });
    }

    if (record.otp !== String(otp).trim()) {
      return res.status(400).json({ msg: "Incorrect OTP. Please try again." });
    }

    // OTP is valid → create verified user in DB
    const { userData } = record;
    const newUser = new ProfileColRef({
      email: userData.email,
      password: userData.password,
      userType: userData.userType,
      contact: userData.contact,
      isVerified: true,
    });

    const result = await newUser.save();

    // Clean up OTP record
    await OtpColRef.deleteOne({ email });

    // Send welcome email (non-blocking)
    const name = email.split("@")[0];
    const tmpl = welcomeTemplate(name, userData.userType, email);
    transporter.sendMail({
      from: `"TailorConnect ✂️" <${process.env.MAIL_USER}>`,
      to: email,
      subject: tmpl.subject,
      html: tmpl.html,
    }).catch((err) => console.error("Welcome mail error:", err.message));

    return res.status(201).json({ msg: "Account verified and created successfully!", data: result });

  } catch (err) {
    console.error("verifyOtp error:", err.message);
    res.status(500).json({ msg: "Server Error", detail: err.message });
  }
}

// ================= RESEND OTP =================
async function resendOtp(req, res) {
  try {
    let { email } = req.body;

    if (!email) {
      return res.status(400).json({ msg: "Email is required" });
    }

    const record = await OtpColRef.findOne({ email });

    if (!record) {
      return res.status(400).json({ msg: "No pending signup found. Please start again." });
    }

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Update OTP record in MongoDB
    await OtpColRef.updateOne({ email }, { otp, expiresAt });

    const name = email.split("@")[0];
    const tmpl = resendOtpTemplate(name, otp);

    await transporter.sendMail({
      from: `"TailorConnect ✂️" <${process.env.MAIL_USER}>`,
      to: email,
      subject: tmpl.subject,
      html: tmpl.html,
    });

    return res.status(200).json({ msg: "New OTP sent to your email" });

  } catch (err) {
    console.error("Resend OTP mail error:", err.message);
    res.status(500).json({ msg: "Failed to resend OTP" });
  }
}

// ================= SIGNUP (direct API only) =================
function signup(req, res) {
  let { email, password, userType, contact } = req.body;

  if (!email || !password || !userType || !contact) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  ProfileColRef.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        return res.status(400).json({ msg: "User already exists" });
      }

      let newUser = new ProfileColRef({ email, password, userType, contact, isVerified: true });
      return newUser.save().then((result) => {
        var name = email.split("@")[0];
        var tmpl = welcomeTemplate(name, userType, email);
        transporter.sendMail({
          from: `"TailorConnect ✂️" <${process.env.MAIL_USER}>`,
          to: email,
          subject: tmpl.subject,
          html: tmpl.html,
        }).catch((err) => console.error("Signup mail error:", err.message));

        return res.status(201).json({ msg: "Signup Successful", data: result });
      });
    })
    .catch((err) => {
      console.error("Signup error:", err.message);
      res.status(500).json({ msg: "Server Error", detail: err.message });
    });
}

// ================= LOGIN =================
function login(req, res) {
  let { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "Email and password are required" });
  }

  ProfileColRef.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(400).json({ msg: "Invalid Email" });
      }

      if (!user.isVerified) {
        return res.status(403).json({ msg: "Email not verified. Please complete signup first." });
      }

      if (user.password !== password) {
        return res.status(400).json({ msg: "Invalid Password" });
      }

      var name = email.split("@")[0];
      var tmpl = loginTemplate(name, email);
      transporter.sendMail({
        from: `"TailorConnect ✂️" <${process.env.MAIL_USER}>`,
        to: email,
        subject: tmpl.subject,
        html: tmpl.html,
      }).catch((err) => console.error("Login mail error:", err.message));

      let token = jwt.sign(
        { email: user.email, userType: user.userType },
        process.env.SEC_KEY,
        { expiresIn: "7d" }
      );

      return res.status(200).json({
        msg: "Login Successful",
        data: user,
        userType: user.userType,
        token,
      });
    })
    .catch((err) => {
      console.error("Login error:", err.message);
      res.status(500).json({ msg: "Server Error", detail: err.message });
    });
}

// ================= LOGOUT =================
function logout(req, res) {
  return res.status(200).json({ msg: "Logged out successfully" });
}

module.exports = { sendOtp, verifyOtp, resendOtp, signup, login, logout };