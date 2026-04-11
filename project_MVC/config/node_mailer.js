var nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "guptariddhima291@gmail.com",   // 🔁 your Gmail here
    pass: "mrpz wzun bhbg tqnd",    // 🔁 Gmail App Password (NOT real password)
  },
});

transporter.verify(function (error) {
  if (error) {
    console.error("Mailer Error:", error.message);
  } else {
    console.log("Mailer Ready");
  }
});

module.exports = transporter;