const Query = require("../models/queryModel");
const nodemailer = require("nodemailer");

exports.submitQuery = async (req, res) => {
  console.log("submit query called req.body :>> ", req.body);
  const { name, email, query } = req.body;

  if (!name || !email || !query) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const newQuery = new Query({ name, email, query });
  await newQuery.save();
  res.status(201).json({ message: "Query submitted successfully" });
};

// Send a confirmation email after query submission
exports.sendConfirmationEmail = async (req, res) => {
  console.log("send confirmation  query called req.body :>> ", req.body);
  const { email, name } = req.body;

  if (!email || !name) {
    return res.status(400).json({ message: "Email and name are required" });
  }

  // Setup transporter with Gmail (or other free service)
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });
  console.log(" process.env.GMAIL_PASS :>> ", process.env.GMAIL_PASS);

  // Mail options
  let mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: "Query Submission Confirmation",
    text: `Hello ${name},\n\nThank you for submitting your query. We will get back to you shortly.\n\nBest regards,\nYour Support Team`,
  };
  console.log("mailOptions :>> ", mailOptions);
  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("error in sendMail:>> ", error);
      return res
        .status(500)
        .json({ message: "Failed to send confirmation email" });
    }
    res.status(200).json({ message: "Confirmation email sent successfully" });
  });
};

// Fetch all queries for admin
exports.fetchQueries = async (req, res) => {
  const queries = await Query.find();
  res.status(200).json(queries);
};

// Respond to a query
exports.respondToQuery = async (req, res) => {
  const { id } = req.params;
  const { response } = req.body;

  if (!response) {
    return res.status(400).json({ message: "Response is required" });
  }

  const query = await Query.findById(id);
  console.log("query in respond to query  :>> ", query);
  if (!query) {
    return res.status(404).json({ message: "Query not found" });
  }

  query.response = response;
  query.isResponded = true;
  await query.save();

  // Send response email
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  let mailOptions = {
    from: process.env.GMAIL_USER,
    to: query.email,
    subject: "Response to Your Query",
    text: `Hello ${query.name},\n\nWe have responded to your query:\n\n"${query.query}"\n\nResponse:\n"${response}"\n\nBest regards,\nYour Support Team`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ message: "Failed to send response email" });
    }
    res.status(200).json({ message: "Query responded successfully" });
  });
};
