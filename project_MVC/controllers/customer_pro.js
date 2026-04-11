var path = require("path");
var CustomerColRef = require("../models/customer_pro");

var cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "dd4gjrvez",
  api_key: "688973355443826",
  api_secret: "Buyjf6_c5x3d2EtOhN8udhHoF_c",
});

// ================= CREATE WITH PIC =================

function doSignupWithPic(req, resp) {

  if (!req.body.email || !req.body.name) {
    return resp.status(400).json({
      status: false,
      msg: "Email and Name are required"
    });
  }

  // If profile pic is sent
  if (req.files && req.files.profilepic) {

    const file = req.files.profilepic;
    const uploadPath = path.join(__dirname, "..", "uploads", file.name);

    file.mv(uploadPath)
      .then(() => cloudinary.uploader.upload(uploadPath))
      .then((result) => {

        req.body.profilePic = result.secure_url;

        const customer = new CustomerColRef(req.body);
        return customer.save();
      })
      .then((doc) => {
        resp.status(200).json({
          status: true,
          msg: "Customer saved successfully",
          doc
        });
      })
      .catch((err) => {
        resp.status(500).json({
          status: false,
          msg: err.message
        });
      });

  } else {

    req.body.profilePic = "nopic.jpg";

    const customer = new CustomerColRef(req.body);

    customer.save()
      .then((doc) => {
        resp.status(200).json({
          status: true,
          msg: "Customer saved successfully (no pic)",
          doc
        });
      })
      .catch((err) => {
        resp.status(500).json({
          status: false,
          msg: err.message
        });
      });
  }
}



// ================= UPDATE WITH PIC =================

function doUpdateWithPic(req, resp) {
  const { email } = req.body;

  if (!email) {
    return resp.status(400).json({
      status: false,
      msg: "Email is required",
    });
  }

  // If new profile pic is sent
  if (req.files && req.files.profilepic) {
    const file = req.files.profilepic;
    const uploadPath = path.join(__dirname, "..", "uploads", file.name);

    file.mv(uploadPath)
      .then(() => cloudinary.uploader.upload(uploadPath))
      .then((result) => {

        req.body.profilePic = result.secure_url;

        return CustomerColRef.updateOne(
          { email },
          { $set: req.body }
        );
      })
      .then((dbResult) => {
        if (dbResult.matchedCount === 0) {
          resp.status(200).json({
            status: false,
            msg: "Customer not found",
          });
        } else {
          resp.status(200).json({
            status: true,
            msg: "Customer updated successfully",
          });
        }
      })
      .catch((err) => {
        resp.status(500).json({
          status: false,
          msg: err.message,
        });
      });
  }
  else {
    // Update without pic
    CustomerColRef.updateOne(
      { email },
      { $set: req.body }
    )
    .then((dbResult) => {
      if (dbResult.matchedCount === 0) {
        resp.status(200).json({
          status: false,
          msg: "Customer not found",
        });
      } else {
        resp.status(200).json({
          status: true,
          msg: "Customer updated successfully",
        });
      }
    })
    .catch((err) => {
      resp.status(500).json({
        status: false,
        msg: err.message,
      });
    });
  }
}



// ================= FIND =================

function doFindWithPic(req, resp) {

  if (!req.body) {
    return resp.status(400).json({
      status: false,
      msg: "Request body missing",
    });
  }

  const { email } = req.body;

  CustomerColRef.findOne({ email })
    .then((doc) => {
      if (!doc) {
        resp.status(200).json({
          status: false,
          msg: "Customer not found",
        });
      } else {
        resp.status(200).json({
          status: true,
          doc,
        });
      }
    })
    .catch((err) => {
      resp.status(500).json({
        status: false,
        msg: err.message,
      });
    });
}



// ================= DELETE WITH PIC =================

function doDeleteWithPic(req, resp) {
  const { email } = req.body;

  CustomerColRef.findOne({ email })
    .then((customer) => {
      if (!customer) {
        return resp.status(200).json({
          status: false,
          msg: "Customer not found",
        });
      }

      // delete image from cloudinary
      if (customer.profilePic && customer.profilePic !== "nopic.jpg") {

        const publicId = customer.profilePic
          .split("/")
          .pop()
          .split(".")[0];

        cloudinary.uploader.destroy(publicId);
      }

      return CustomerColRef.deleteOne({ email });
    })
    .then(() => {
      resp.status(200).json({
        status: true,
        msg: "Customer and profile pic deleted successfully",
      });
    })
    .catch((err) => {
      resp.status(500).json({
        status: false,
        msg: err.message,
      });
    });
}



module.exports = {
  doSignupWithPic,
  doUpdateWithPic,
  doFindWithPic,
  doDeleteWithPic,
};
