const express = require("express");
const {
  signupUser,
  loginUser,
  logoutUser,
  getUser,
  getSalesUsers,
} = require("../controllers/authController");
const protectRoute = require("../middleware/protectRoute");

const router = express.Router();
router.post("/signup", signupUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/getuser", protectRoute, getUser);
router.get("/getsales", protectRoute, getSalesUsers);
module.exports = router;
