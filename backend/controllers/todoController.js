const Project = require("../models/projectModel");
const todoModel = require("../models/todoModel");
module.exports.allTodos = async (req, res) => {
  try {
    const user = res.user;
    console.log(user);
    const todos = await todoModel
      .find({ user: user._id })
      .sort({ createdAt: -1 })
      .exec();

    if (todos.length >= 0) {
      res.status(200).json(todos);
    } else {
      res.status(400).send("Error fetching todos. Please try again.");
    }
  } catch (error) {
    console.log("error.message :>> ", error.message);
    res.status(400).send("Error fetching todos. Please try again.");
  }
};

module.exports.createTodo = async (req, res) => {
  try {
    console.log("created todo called");
    const { title, description, projectName } = req.body;
    console.log("req.body :>> ", req.body);
    let user = res.user;
    let allprojects = await Project.find();
    console.log("allprojects :>> ", allprojects);
    let project = await Project.findOne({
      title: projectName,
    });
    console.log("project :>> ", project);
    // if(!project){

    // }
    let newTodo = await todoModel.create({
      title,
      description,
      user: user._id,
      project: project?._id,
    });
    if (newTodo) {
      console.log("newTodo :>> ", newTodo);
      await newTodo.save();
      res.status(201).send(newTodo);
    } else {
      res.status(400).send("error in creating TODO.try again.");
    }
  } catch (error) {
    console.log("error.message :>> ", error);
    res.status(400).send("error in creating TODO.try again.");
  }
};
module.exports.editTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const user = res.user;

    const updatedTodo = await todoModel.findOneAndUpdate(
      { _id: id, user: user._id },
      { title, description },
      { new: true }
    );

    if (updatedTodo) {
      res.status(200).send(updatedTodo);
    } else {
      res.status(404).send("Error in editing TODO. Try again.");
    }
  } catch (error) {
    console.log("error.message :>> ", error.message);
    res.status(400).send("Error in editing TODO. Try again.");
  }
};

module.exports.deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const user = res.user;

    const deletedTodo = await todoModel.findOneAndDelete({
      _id: id,
    });

    if (deletedTodo) {
      res
        .status(200)
        .send({ message: "Todo deleted successfully", deletedTodo });
    } else {
      res.status(404).send("Error in deleting TODO. Try again. ");
    }
  } catch (error) {
    console.log("error.message :>> ", error.message);
    res.status(400).send("Error in deleting TODO. Try again.");
  }
};
