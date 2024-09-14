const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema(
  {
    clientName: { type: String, required: true },
    clientEmail: { type: String, required: true },
    topic: { type: String, required: true },
    clientDateTime: { type: Date, required: true },
    clientTimeZone: { type: String, required: true },
    adminDateTime: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "rescheduled", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Meeting = mongoose.model("Meeting", meetingSchema);
module.exports = Meeting;
