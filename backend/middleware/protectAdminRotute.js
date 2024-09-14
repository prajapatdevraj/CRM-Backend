const User = require("../models/userModel");

exports.adminOnly = async (req, res, next) => {
  try {
    const user = await User.findById(res.user.id);
    console.log("admin only called :>> ");
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    next();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error checking admin status", error: error.message });
  }
};
