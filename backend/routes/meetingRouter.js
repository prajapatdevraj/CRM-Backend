const express = require("express");
const router = express.Router();
const meetingController = require("../controllers/meetingController");
const protectRoute = require("../middleware/protectRoute");
const { adminOnly } = require("../middleware/protectAdminRotute");

// Public route for clients to request a meeting
router.post("/request", meetingController.requestMeeting);

router.use(protectRoute);
router.use(adminOnly);

router.get("/all", meetingController.getAllMeetings);
router.get("/:id", meetingController.getMeetingById);
router.post("/:id/confirmed", meetingController.confirmMeeting);
router.post("/:id/rescheduled", meetingController.rescheduleMeeting);
router.post("/:id/cancelled", meetingController.cancelMeeting);

module.exports = router;
