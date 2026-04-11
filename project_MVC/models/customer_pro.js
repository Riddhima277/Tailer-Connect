var mongoose = require("mongoose");

let SchemaClass = mongoose.Schema;

let colDesign = {
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  address: {
    type: String,
  },

  city: {
    type: String,
  },

  state: {
    type: String,
  },

  gender: {
    type: String,
  },

  profilePic: {
    type: String,
  },
};

let ver = {
  timestamps: true,
};

let collectionObj = new SchemaClass(colDesign, ver);

let CustomerProColRef = mongoose.model("CustomerProCollection", collectionObj);

module.exports = CustomerProColRef;
