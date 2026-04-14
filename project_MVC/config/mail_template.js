 // config/mail_template.js

function wrap(content) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <style>
    body{margin:0;padding:0;background:#fef3c7;font-family:'Segoe UI',Arial,sans-serif}
    .container{max-width:560px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.10)}
    .header{background:linear-gradient(135deg,#92400e 0%,#c49a2c 100%);padding:32px 40px;text-align:center}
    .header h1{margin:0;color:#fff;font-size:26px;font-weight:700}
    .header p{margin:6px 0 0;color:rgba(255,255,255,0.75);font-size:13px}
    .body{padding:36px 40px}
    .body p{color:#374151;font-size:15px;line-height:1.7;margin:0 0 14px}
    .box{background:#fef3c7;border-left:4px solid #c49a2c;padding:12px 18px;border-radius:0 8px 8px 0;margin:16px 0}
    .box p{margin:4px 0;color:#92400e;font-weight:600;font-size:14px}
    .otp-block{text-align:center;margin:28px 0}
    .otp-code{display:inline-block;font-size:40px;font-weight:700;letter-spacing:14px;color:#c49a2c;background:#fef3c7;padding:18px 32px;border-radius:12px;border:2px dashed #c49a2c}
    .otp-note{color:#92400e;font-size:13px;margin:12px 0 0;font-weight:500}
    .divider{height:1px;background:#f3e4c3;margin:20px 0}
    .footer{background:#fef3c7;padding:20px 40px;text-align:center}
    .footer p{color:#92400e;font-size:12px;margin:4px 0}
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✂️ TailorConnect</h1>
      <p>Precision Tailoring, Delivered.</p>
    </div>
    <div class="body">${content}</div>
    <div class="footer">
      <p>✂️ &nbsp;✂️ &nbsp;✂️</p>
      <p>© ${new Date().getFullYear()} TailorConnect. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;
}

// ── Welcome email sent after OTP verified + account created ──────────────────
function welcomeTemplate(name, userType, email) {
  return {
    subject: "Welcome to TailorConnect! ✂️",
    html: wrap(`
      <p>Hi <strong>${name}</strong>,</p>
      <p>Your TailorConnect account has been created successfully.</p>
      <div class="divider"></div>
      <div class="box">
        <p>📧 Email: ${email}</p>
        <p>👤 Role: ${userType === "tailor" ? "✂️ Tailor" : "🛍️ Customer"}</p>
      </div>
      <div class="divider"></div>
      <p>${userType === "tailor"
        ? "Complete your tailor profile to start receiving orders."
        : "Browse expert tailors in your area and get perfectly fitted clothes."
      }</p>
      <p>Happy tailoring! 🧵</p>
    `),
  };
}

// ── Login notification sent after Login ──────────────────────────────────────
function loginTemplate(name, email) {
  return {
    subject: "New sign-in to your TailorConnect account",
    html: wrap(`
      <p>Hi <strong>${name}</strong>,</p>
      <p>We noticed a new sign-in to your TailorConnect account.</p>
      <div class="divider"></div>
      <div class="box">
        <p>📧 Email: ${email}</p>
        <p>🕐 Time: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</p>
      </div>
      <div class="divider"></div>
      <p>If this was <strong>not you</strong>, please change your password immediately.</p>
    `),
  };
}

// ── OTP email sent on signup ─────────────────────────────────────────────────
function otpTemplate(name, otp) {
  return {
    subject: "Your TailorConnect verification code",
    html: wrap(`
      <p>Hi <strong>${name}</strong>,</p>
      <p>Thanks for signing up! Use the code below to verify your email and complete your registration.</p>
      <div class="divider"></div>
      <div class="otp-block">
        <div class="otp-code">${otp}</div>
        <p class="otp-note">⏱️ Expires in <strong>10 minutes</strong>. Do not share this code.</p>
      </div>
      <div class="divider"></div>
      <div class="box">
        <p>🕐 Requested at: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</p>
      </div>
      <p>If you did not sign up for TailorConnect, you can safely ignore this email.</p>
    `),
  };
}

// ── Resend OTP email ─────────────────────────────────────────────────────────
function resendOtpTemplate(name, otp) {
  return {
    subject: "Your new TailorConnect verification code",
    html: wrap(`
      <p>Hi <strong>${name}</strong>,</p>
      <p>You requested a new verification code. Here it is:</p>
      <div class="divider"></div>
      <div class="otp-block">
        <div class="otp-code">${otp}</div>
        <p class="otp-note">⏱️ Expires in <strong>10 minutes</strong>. Do not share this code.</p>
      </div>
      <div class="divider"></div>
      <div class="box">
        <p>🕐 Resent at: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</p>
      </div>
      <p>If you did not request this, please ignore this email.</p>
    `),
  };
}

module.exports = { welcomeTemplate, loginTemplate, otpTemplate, resendOtpTemplate };