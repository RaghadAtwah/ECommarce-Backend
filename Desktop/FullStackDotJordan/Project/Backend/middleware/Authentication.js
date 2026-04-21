const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const token = header.split(" ")[1];

    const isVerified = jwt.verify(token, process.env.JWT_SECRET);

    console.log("TOKEN:", token);
    console.log("DECODED:", isVerified);

    req.user = isVerified;

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = auth;
