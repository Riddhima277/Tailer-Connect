var nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
  user: process.env.MAIL_USER,
  pass: process.env.MAIL_PASS,
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