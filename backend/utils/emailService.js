const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to,
      subject,
      html,
    });
    console.log("Email sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

const formatDate = (date) => {
  return new Date(date).toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, 
    timeZoneName: "short",
  });
};

exports.sendMeetingConfirmationEmail = async (meeting) => {
  const subject = "Meeting Confirmed";
  const html = `
    <h1>Your meeting has been confirmed</h1>
    <p>Dear ${meeting.clientName},</p>
    <p>Your meeting request has been confirmed with the following details:</p>
    <ul>
      <li><strong>Topic:</strong> ${meeting.topic}</li>
      <li><strong>Date and Time:</strong> ${formatDate(
        meeting.clientDateTime
      )}</li>
    </ul>
    <p>We look forward to meeting with you.</p>
    <p>Best regards,<br>Your Admin Team</p>
  `;

  await sendEmail(meeting.clientEmail, subject, html);
};

exports.sendMeetingRescheduleEmail = async (meeting) => {
  const subject = "Meeting Rescheduled";
  const html = `
    <h1>Your meeting has been rescheduled</h1>
    <p>Dear ${meeting.clientName},</p>
    <p>Your meeting has been rescheduled to the following date and time:</p>
    <ul>
      <li><strong>Topic:</strong> ${meeting.topic}</li>
      <li><strong>New Date and Time:</strong> ${formatDate(
        meeting.clientDateTime
      )}</li>
    </ul>
    <p>If this new time doesn't work for you, please contact us to arrange a different time.</p>
    <p>We apologize for any inconvenience and look forward to meeting with you.</p>
    <p>Best regards,<br>Your Admin Team</p>
  `;

  await sendEmail(meeting.clientEmail, subject, html);
};

exports.sendMeetingCancellationEmail = async (meeting) => {
  const subject = "Meeting Cancelled";
  const html = `
    <h1>Your meeting has been cancelled</h1>
    <p>Dear ${meeting.clientName},</p>
    <p>We regret to inform you that your meeting scheduled for ${formatDate(
      meeting.clientDateTime
    )} has been cancelled.</p>
    <p>Details of the cancelled meeting:</p>
    <ul>
      <li><strong>Topic:</strong> ${meeting.topic}</li>
      <li><strong>Original Date and Time:</strong> ${formatDate(
        meeting.clientDateTime
      )}</li>
    </ul>
    <p>If you would like to reschedule, please submit a new meeting request.</p>
    <p>We apologize for any inconvenience this may cause.</p>
    <p>Best regards,<br>Your Admin Team</p>
  `;

  await sendEmail(meeting.clientEmail, subject, html);
};
