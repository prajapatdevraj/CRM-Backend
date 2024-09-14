const express = require("express");
const {
  createReminder,
  updateReminder,
  deleteReminder,
  getAllReminders,
  getRemindersOfDay,
} = require("../controllers/reminderConroller");
const protectRoute = require("../middleware/protectRoute");
const router = express.Router();

router.use(protectRoute);
console.log("reminder router called");

router.post("/create", createReminder);

router.post("/update/:id", updateReminder);

router.get("/:id", deleteReminder);

router.get("/", getAllReminders);

router.get("/day/:date", getRemindersOfDay);

module.exports = router;
