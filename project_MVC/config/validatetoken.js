const jwt = require("jsonwebtoken");

function validateToken(req, res, next) {
    console.log("********");

    const authHeader = req.headers['authorization'];

    //  Check header
    if (!authHeader) {
        return res.status(401).json({
            status: false,
            msg: "Authorization header missing"
        });
    }

    console.log("Header:", authHeader);

    // Check format "Bearer token"
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
        return res.status(401).json({
            status: false,
            msg: "Invalid token format"
        });
    }

    const token = parts[1];

    console.log("SECRET:", process.env.SEC_KEY);

    try {
        //  Verify token
        const decoded = jwt.verify(token, process.env.SEC_KEY);

        console.log("Decoded:", decoded);

        //  Attach user data to request (VERY IMPORTANT)
        req.user = decoded;

        next();

    } catch (err) {
        return res.status(401).json({
            status: false,
            msg: err.message
        });
    }
}

module.exports = { validateToken };