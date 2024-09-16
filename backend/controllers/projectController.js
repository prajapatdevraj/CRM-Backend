const Project = require("../models/projectModel");
const Todo = require("../models/todoModel");
const User = require("../models/userModel"); // Assuming you have a User model
const upload = require("../utils/multerConfig");
module.exports.getAllProjects = async (req, res) => {
  try {
    console.log("get all projects called");
    const projects = await Project.find().populate(
      "participants",
      "firstName email"
    );
    res.status(200).json(projects);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching projects", error: error.message });
  }
};

module.exports.getProjectById = async (req, res) => {
  try {
    console.log("get project by id called");
    const project = await Project.findById(req.params.id).populate(
      "participants",
      "name email"
    );
    const projectTodos = await Todo.find({ project: req.params.id }).populate(
      "user"
    );
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json({ project, projectTodos });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching project", error: error.message });
  }
};
module.exports.getUserProjects = async (req, res) => {
  try {
    console.log("get all user  projects called");

    const projects = await Project.find({
      participants: res.user._id,
    }).populate("participants", "name email");
    res.status(200).json(projects);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user projects", error: error.message });
  }
};

module.exports.createProject = async (req, res) => {
  upload.single("posterImage")(req, res, async (err) => {
    if (err) {
      return res
        .status(400)
        .json({ message: "Error uploading file", error: err.message });
    }
    try {
      // Parse participantEmails which is a JSON string from FormData
      const {
        title,
        description,
        participants: participantEmails,
        status,
      } = req.body;

      // Since 'participantEmails' comes as a JSON string, we parse it into an array
      const parsedParticipantEmails = JSON.parse(participantEmails);

      // Find participants from the User collection based on their email
      const participants = await User.find({
        email: { $in: parsedParticipantEmails },
      });

      let posterImage = null;
      if (req.file) {
        posterImage = `data:${
          req.file.mimetype
        };base64,${req.file.buffer.toString("base64")}`;
      }

      // Create the new project
      const project = new Project({
        title,
        description,
        participants: participants.map((user) => user._id), // Map to participant IDs
        posterImage,
        status,
      });

      await project.save();
      res.status(201).json(project);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error creating project", error: error.message });
    }
  });
};

module.exports.updateProject = async (req, res) => {
  console.log("req.body in update function :>> ", req.body);

  upload.single("posterImage")(req, res, async (err) => {
    if (err) {
      return res
        .status(400)
        .json({ message: "Error uploading file", error: err.message });
    }

    try {
      const {
        title,
        description,
        participants: participantEmails,
        status,
      } = req.body;
      const parsedParticipantEmails = JSON.parse(participantEmails);
      // Find users by email
      const participants = await User.find({
        email: { $in: parsedParticipantEmails },
      });
      console.log("req.body in update :>> ", req.body);
      let updateData = {
        title,
        description,
        participants: participants.map((user) => user._id),
        status,
        updatedAt: Date.now(),
      };

      // If a new poster image is uploaded, add it to the update data
      if (req.file) {
        updateData.posterImage = `data:${
          req.file.mimetype
        };base64,${req.file.buffer.toString("base64")}`;
      }

      const project = await Project.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      ).populate("participants", "name email");

      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      res.status(200).json(project);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating project", error: error.message });
    }
  });
};

module.exports.deleteProject = async (req, res) => {
  try {
    console.log("delete project called");

    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    console.log("project deleted successfully ");

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting project", error: error.message });
  }
};
