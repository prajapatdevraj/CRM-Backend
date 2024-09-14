const Lead = require("../models/leadModel");
const User = require("../models/userModel");

exports.createLead = async (req, res) => {
  try {
    console.log("create lead called");
    const { name, email, phone, company, status, assignedTo, notes } = req.body;
    console.log("req.body :>> ", req.body);
    const salesPerson = await User.findOne({ _id: assignedTo });
    if (!salesPerson.department === "sales") {
      res.status(400).json({
        message: "Error creating lead assined person is not autherized ",
      });
    }
    const newLead = new Lead({
      name,
      email,
      phone,
      company,
      status,
      assignedTo: salesPerson._id,
      notes,
    });
    await newLead.save();
    res.status(201).json(newLead);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating lead", error: error.message });
  }
};

exports.getLeads = async (req, res) => {
  try {
    const leads = await Lead.find().populate("assignedTo", "userName");
    res.status(200).json(leads);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching leads", error: error.message });
  }
};

exports.updateLead = async (req, res) => {
  try {
    console.log("update lead called");
    const { id } = req.params;

    // Find the lead by its ID
    let lead = await Lead.findOne({ _id: id });

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    // Update the lead with the new values from req.body
    Object.assign(lead, req.body);

    // Save the updated lead
    await lead.save();

    console.log("Lead updated successfully");
    res.status(200).json(lead);
  } catch (error) {
    console.log("Error in update lead:>> ", error);
    res
      .status(400)
      .json({ message: "Error updating lead", error: error.message });
  }
};


exports.deleteLead = async (req, res) => {
  try {
    console.log("delete lead called")
    const { id } = req.params;
    const deletedLead = await Lead.findByIdAndDelete(id);
    if (!deletedLead) {
      return res.status(404).json({ message: "Lead not found" });
    }
    res.status(200).json({ message: "Lead deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting lead", error: error.message });
  }
};

exports.getUserLeads = async (req, res) => {
  try {
    console.log("get user leads called");
    let user = res.user; // Change `res.user` to `req.user`
    const leads = await Lead.find({ assignedTo: user._id }).populate(
      "assignedTo",
      "-password"
    ); // Exclude the password field in populate
    console.log("leads :>> ", leads);
    res.status(200).json(leads); // Correct response sending
  } catch (error) {
    console.log("error in get user leads :>> ", error);
    if (!res.headersSent) {
      // Ensure the headers haven't been sent
      res
        .status(500)
        .json({ message: "Error fetching user leads", error: error.message });
    }
  }
};


exports.getLeadById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("get lead by id called", id);
    const lead = await Lead.findOne({ _id: id }).populate(
      "assignedTo",
      "-password"
    );
    console.log("lead inget lead by id:>> ", lead);
    res.status(200).json(lead);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching leads", error: error.message });
  }
};
