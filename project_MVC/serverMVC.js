var express = require("express");
var fileuploader = require("express-fileupload");
var profileRouter     = require("./routers/profileRouter");
var customer_pro      = require("./routers/coustmer_pro");
var tailor_pro        = require("./routers/tailor_pro");
var review_router     = require("./routers/review_router");
var find_tailorRouter = require("./routers/find_tailorRouter");
var { connectToMongoDB } = require("./config/DBconnect");
const cors = require("cors");

var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileuploader());
app.use(cors());
connectToMongoDB();

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/profile",     profileRouter);     // profile routes
app.use("/customer",    customer_pro);      // customer routes
app.use("/tailor",      tailor_pro);        // create / update / delete / find / extract-aadhaar
app.use("/review",      review_router);     // review routes
app.use("/find-tailor", find_tailorRouter); // search / all / :id  ← FIXED: own prefix, no conflict

// ─── 404 Handler (must be LAST) ───────────────────────────────────────────────
app.use((req, res) => {
  console.log(req.method, req.url);
  res.status(404).send("Invalid URL");
});

app.listen(2009, () => {
  console.log("Server Started on : 2009");
});