var mongoose = require("mongoose");
let SchemaClass = mongoose.Schema;

let colDesign = {
  email: {
    type: String,
    required: true,
    unique: true,
  },
  otp: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  userData: {
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    userType: {
      type: String,
    },
    contact: {
      type: String,
    },
  },
};

let ver = {
  timestamps: true,
};

let collectionObj = new SchemaClass(colDesign, ver);

// Auto-delete expired OTP documents from MongoDB
collectionObj.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

let OtpColRef = mongoose.model("OtpCollection", collectionObj);

module.exports = OtpColRef;