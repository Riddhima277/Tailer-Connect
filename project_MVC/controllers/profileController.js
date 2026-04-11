// controllers/profileController.js
const jwt = require('jsonwebtoken');
require('dotenv').config();
var ProfileColRef = require("../models/ProfileModel");
var transporter = require("../config/node_mailer");
var {
  welcomeTemplate,
  loginTemplate,
  otpTemplate,
  resendOtpTemplate,
} = require("../config/mail_template");


// ─── In-memory OTP store ───────────────────────────────────────────────────────
// Shape: { [email]: { otp, expiresAt, userData: { email, password, userType, contact } } }
// NOTE: This resets on server restart. For production, use Redis or store OTPs in MongoDB.
const otpStore = {};

// Helper: 6-digit OTP
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ================= SEND OTP (called by signup form) =================
function sendOtp(req, res) {
  let { email, password, userType, contact } = req.body;

  if (!email || !password || !userType || !contact) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  // Check if a verified account already exists
  ProfileColRef.findOne({ email })
    .then((existingUser) => {
      if (existingUser && existingUser.isVerified) {
        return res.status(400).json({ msg: "User already exists. Please log in." });
      }

      // If an unverified doc exists from a previous attempt, delete it so we can recreate cleanly
      const cleanup = existingUser && !existingUser.isVerified
        ? ProfileColRef.deleteOne({ email })
        : Promise.resolve();

      return cleanup.then(() => {

        const existing = otpStore[email];

        if (existing && Date.now() < existing.expiresAt) {
          return res.status(400).json({
            msg: "OTP already sent. Please wait or use resend OTP."
          });
        }
        const otp = generateOtp();
        const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

        // Store pending user data + OTP
        // ✅ clear old OTP first
delete otpStore[email];

// ✅ store new OTP
otpStore[email] = {
  otp,
  expiresAt,
  userData: { email, password, userType, contact }
};

        // Send OTP email
        const name = email.split("@")[0];
        const tmpl = otpTemplate(name, otp);

        let jtoken = jwt.sign({ email: email }, process.env.sec_key, { expiresIn: "10m" });
        console.log(jtoken);

        transporter.sendMail({
          from: '"TailorConnect ✂️" <your_gmail@gmail.com>',
          to: email,
          subject: tmpl.subject,
          html: tmpl.html,
        }).catch((err) => console.error("OTP mail error:", err.message));

        return res.status(200).json({ msg: "OTP sent to your email", token: jtoken });
      });
    })
    .catch((err) => {
      console.error("sendOtp error:", err.message);
      res.status(500).json({ msg: "Server Error", detail: err.message });
    });
}

// ================= VERIFY OTP =================
function verifyOtp(req, res) {

  let { email, otp } = req.body;
if (!email || !otp) {
  return res.status(400).json({ msg: "Email and OTP are required" });
}
const record = otpStore[email];
console.log("Stored OTP:", record?.otp, "| Entered:", otp);

  if (!record) {
    return res.status(400).json({ msg: "No OTP request found. Please sign up again." });
  }

  if (Date.now() > record.expiresAt) {
    delete otpStore[email];
    return res.status(400).json({ msg: "OTP has expired. Please request a new one." });
  }

  if (record.otp !== String(otp).trim()) {
    return res.status(400).json({ msg: "Incorrect OTP. Please try again." });
  }

  // OTP is valid → create the verified user in DB
  const { userData } = record;
  const newUser = new ProfileColRef({
    email: userData.email,
    password: userData.password,
    userType: userData.userType,
    contact: userData.contact,
    isVerified: true,
  });

  newUser.save()
    .then((result) => {
      delete otpStore[email]; // clean up store

      // Send welcome email (non-blocking)
      const name = email.split("@")[0];
      const tmpl = welcomeTemplate(name, userData.userType, email);
      transporter.sendMail({
        from: '"TailorConnect ✂️" <your_gmail@gmail.com>',
        to: email,
        subject: tmpl.subject,
        html: tmpl.html,
      }).catch((err) => console.error("Welcome mail error:", err.message));

      return res.status(201).json({ msg: "Account verified and created successfully!", data: result });
    })
    .catch((err) => {
      console.error("verifyOtp save error:", err.message);
      res.status(500).json({ msg: "Server Error", detail: err.message });
    });
}

// ================= RESEND OTP =================
function resendOtp(req, res) {
  let { email } = req.body;

  if (!email) {
    return res.status(400).json({ msg: "Email is required" });
  }

  const record = otpStore[email];

  if (!record) {
    return res.status(400).json({ msg: "No pending signup found. Please start again." });
  }

  const otp = generateOtp();
  const expiresAt = Date.now() + 10 * 60 * 1000;

  // Update existing record with fresh OTP
  otpStore[email].otp = otp;
  otpStore[email].expiresAt = expiresAt;

  const name = email.split("@")[0];
  const tmpl = resendOtpTemplate(name, otp);

  transporter.sendMail({
    from: '"TailorConnect ✂️" <your_gmail@gmail.com>',
    to: email,
    subject: tmpl.subject,
    html: tmpl.html,
  })
    .then(() => res.status(200).json({ msg: "New OTP sent to your email" }))
    .catch((err) => {
      console.error("Resend OTP mail error:", err.message);
      res.status(500).json({ msg: "Failed to resend OTP" });
    });
}

// ================= SIGNUP (now only used for direct API, not from frontend form) =================
// You can keep this or remove it — the frontend now uses sendOtp → verifyOtp instead.
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
          from: '"TailorConnect ✂️" <your_gmail@gmail.com>',
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

      // Block unverified accounts from logging in
      if (!user.isVerified) {
        return res.status(403).json({ msg: "Email not verified. Please complete signup first." });
      }

      if (user.password !== password) {
        return res.status(400).json({ msg: "Invalid Password" });
      }

      var name = email.split("@")[0];
      var tmpl = loginTemplate(name, email);
      transporter.sendMail({
        from: '"TailorConnect ✂️" <your_gmail@gmail.com>',
        to: email,
        subject: tmpl.subject,
        html: tmpl.html,
      }).catch((err) => console.error("Login mail error:", err.message));

      let token = jwt.sign(
  { email: user.email, userType: user.userType },
  process.env.sec_key,
  { expiresIn: "10m" }
);
return res.status(200).json({
  msg: "Login Successful",
  data: user,
  userType: user.userType,
  token
});
    })
    .catch((err) => {
      console.error("Login error:", err.message);
      res.status(500).json({ msg: "Server Error", detail: err.message });
    });
}

function logout(req, res) {
  return res.status(200).json({ msg: "Logged out successfully" });
}

module.exports = { sendOtp, verifyOtp, resendOtp, signup, login, logout };