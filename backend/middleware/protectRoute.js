const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel.js");

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
  console.log("protect route called")
    if (!token) {
      return res
        .status(401)
        .json({ message: "No token provided, authorization denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    // console.log('user :>> ', user);
    res.user = user;
    next();
  } catch (error) {
    console.log("Error in protect route:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = protectRoute;
