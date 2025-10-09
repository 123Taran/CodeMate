const jwt = require("jsonwebtoken");
const userModel = require("../Models/userModel");
require("dotenv").config();

const checkForLogin = async function (req, res, next) {
  const token = req.headers.authorization?.split(" ")[1] || req.cookies.token;

  if (!token && req.headers.authorization) {
    const authHeader = req.headers.authorization;
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
  }

  if (!token) {
    return res.status(401).send("No token provided — please log in first");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await userModel.findOne({ email: decoded.email });

    if (!user) {
      return res.status(401).send("User not found");
    }

    req.user = user;
    req.isTA = user.role === "Teaching Assistant";
    next();
  } catch (err) {
    console.error("JWT verification error:", err.message);
    res.status(401).send("Invalid or expired token");
  }
};

module.exports = checkForLogin;
