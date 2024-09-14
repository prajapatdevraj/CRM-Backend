const Meeting = require("../models/meetingModel");
const { convertToAdminTimeZone, convertAdminToClientTimeZone } = require("../utils/timeZoneConverter");
const {
  sendMeetingConfirmationEmail,
  sendMeetingRescheduleEmail,
  sendMeetingCancellationEmail,
} = require("../utils/emailService");

exports.requestMeeting = async (req, res) => {
  try {
    const { clientName, clientEmail, topic, clientDateTime, clientTimeZone } =
      req.body;
    console.log("req.body :>> ", req.body);
    let dateTime = clientDateTime;
    // Convert client's datetime to admin's timezone (assuming admin is in India/IST)
    const adminDateTime = await convertToAdminTimeZone(
      dateTime,
      clientTimeZone,
      "Asia/Kolkata"
    );
    console.log("clientDateTime in request meeting:>> ", clientDateTime);
    const newMeeting = new Meeting({
      clientName,
      clientEmail,
      topic,
      clientDateTime,
      clientTimeZone,
      adminDateTime,
    });

    await newMeeting.save();

    console.log(`New meeting request created: ${newMeeting._id}`);
    console.log("newMeeting :>> ", newMeeting);
    res.status(201).json({
      message: "Meeting request submitted successfully",
      meeting: newMeeting,
    });
  } catch (error) {
    console.error("Error in requestMeeting:", error);
    res.status(500).json({
      message: "Error submitting meeting request",
      error: error.message,
    });
  }
};

exports.getAllMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find().sort({ adminDateTime: 1 });
    console.log(`Retrieved ${meetings.length} meetings`);
    res.status(200).json(meetings);
  } catch (error) {
    console.error("Error in getAllMeetings:", error);
    res
      .status(500)
      .json({ message: "Error retrieving meetings", error: error.message });
  }
};

exports.getMeetingById = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) {
      console.log(`Meeting not found: ${req.params.id}`);
      return res.status(404).json({ message: "Meeting not found" });
    }
    console.log(`Retrieved meeting: ${meeting._id}`);
    res.status(200).json(meeting);
  } catch (error) {
    console.error("Error in getMeetingById:", error);
    res
      .status(500)
      .json({ message: "Error retrieving meeting", error: error.message });
  }
};

exports.confirmMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findByIdAndUpdate(
      req.params.id,
      { status: "confirmed" },
      { new: true }
    );

    if (!meeting) {
      console.log(`Meeting not found for confirmation: ${req.params.id}`);
      return res.status(404).json({ message: "Meeting not found" });
    }

    await sendMeetingConfirmationEmail(meeting);

    console.log(`Meeting confirmed: ${meeting._id}`);
    res
      .status(200)
      .json({ message: "Meeting confirmed successfully", meeting });
  } catch (error) {
    console.error("Error in confirmMeeting:", error);
    res
      .status(500)
      .json({ message: "Error confirming meeting", error: error.message });
  }
};

exports.rescheduleMeeting = async (req, res) => {
  try {
    console.log("req.body.data :>> ", req.body);
    const { newDateTime, AdminTimeZone, clientTimeZone } = req.body;

    // Convert newDateTime from AdminTimeZone to ClientTimeZone
    const newClientDateTime = convertAdminToClientTimeZone(
      newDateTime,
      AdminTimeZone,
      clientTimeZone
    );

    console.log("newClientDateTime in client timezone:>> ", newClientDateTime);

    const meeting = await Meeting.findByIdAndUpdate(
      req.params.id,
      {
        status: "rescheduled",
        clientDateTime: newClientDateTime, // Store in client's timezone
        clientTimeZone: clientTimeZone, // Save client timezone info
        adminDateTime: newDateTime, // Admin's original time
      },
      { new: true }
    );

    if (!meeting) {
      console.log(`Meeting not found for rescheduling: ${req.params.id}`);
      return res.status(404).json({ message: "Meeting not found" });
    }

    await sendMeetingRescheduleEmail(meeting);

    console.log(`Meeting rescheduled: ${meeting._id}`);
    res
      .status(200)
      .json({ message: "Meeting rescheduled successfully", meeting });
  } catch (error) {
    console.error("Error in rescheduleMeeting:", error);
    res
      .status(500)
      .json({ message: "Error rescheduling meeting", error: error.message });
  }
};


exports.cancelMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findByIdAndUpdate(
      req.params.id,
      { status: "cancelled" },
      { new: true }
    );

    if (!meeting) {
      console.log(`Meeting not found for cancellation: ${req.params.id}`);
      return res.status(404).json({ message: "Meeting not found" });
    }

    await sendMeetingCancellationEmail(meeting);

    console.log(`Meeting cancelled: ${meeting._id}`);
    res
      .status(200)
      .json({ message: "Meeting cancelled successfully", meeting });
  } catch (error) {
    console.error("Error in cancelMeeting:", error);
    res
      .status(500)
      .json({ message: "Error cancelling meeting", error: error.message });
  }
};
