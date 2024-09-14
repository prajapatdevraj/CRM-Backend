const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    posterImage: {
      type: String, // Will store Base64 encoded image
    },
  status:{
    type:String,
    default:"pending",
  }
  },
  { timestamps: true }
);


const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
