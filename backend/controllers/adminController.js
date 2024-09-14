const Lead = require("../models/leadModel");
const Project = require("../models/projectModel");
const Query = require("../models/queryModel");
const Reminder = require("../models/reminderModel");

const Todo = require("../models/todoModel");
const User = require("../models/userModel");

exports.getAllUserTodos = async (req, res) => {
  try {
    console.log("getAllUserTodos called")
    const {id}=req.params;
    console.log('id :>> ', id);
   const todos = await Todo.find({ user: id });
  console.log('todos :>> ', todos);
    // Check if todos array is empty
    if (todos.length === 0) {
      console.log("check")
      return res.status(204).json({});
    }

    // If todos exist, then populate the user field
    const populatedTodos = await Todo.populate(todos, { path: "user" });

    console.log('todos :>> ', populatedTodos);
    res.status(200).json(populatedTodos);
  } catch (error) {
    console.log('error.message :>> ', error.message);
    res
      .status(500)
      .json({ message: "Error fetching todos", error: error.message });
  }
};
exports.getAllUsers = async (req, res) => {
  try {
    console.log("getAllUser called")
    const users = await User.find();
    console.log('users :>> ', users);
    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
};

exports.editUserTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { title, description },
      { new: true }
    );

    if (!updatedTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.status(200).json(updatedTodo);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating todo", error: error.message });
  }
};

exports.deleteUserTodo = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('id  in delete todo:>> ', id);
    const deletedTodo = await Todo.findByIdAndDelete(id);

    if (!deletedTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }
   console.log('todo deleted  :>> ');
    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting todo", error: error.message });
  }
};
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Delete all todos associated with the user
    await Todo.deleteMany({ user: id });

    // Delete the user
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "User and associated todos deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting User", error: error.message });
  }
};

exports.editUserName = async (req, res) => {
  try {
    console.log("edit user name called")
    const { id } = req.params;
    const { firstName, lastName } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { firstName, lastName },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating User name", error: error.message });
  }
};

async function getProjectStats() {
  try {
    console.log("Fetching project stats...");
    const totalProjects = await Project.countDocuments();
    const pendingProjects = await Project.countDocuments({ status: 'pending' });
    const completedProjects = await Project.countDocuments({ status: 'completed' });
    console.log("Project stats fetched successfully.");
    return { totalProjects, pendingProjects, completedProjects };
  } catch (error) {
    console.error("Error fetching project stats:", error);
    throw error;
  }
}

async function getQueryStats() {
  try {
    console.log("Fetching query stats...");
    const totalQueries = await Query.countDocuments();
    const respondedQueries = await Query.countDocuments({ isResponded: true });
    const pendingQueries = await Query.countDocuments({ isResponded: false });
    const todayQueries = await Query.countDocuments({
      createdAt: { $gte: new Date().setHours(0, 0, 0, 0) }
    });
    console.log("Query stats fetched successfully.");
    return { totalQueries, respondedQueries, pendingQueries, todayQueries };
  } catch (error) {
    console.error("Error fetching query stats:", error);
    throw error;
  }
}

async function getLeadStats() {
  try {
    console.log("Fetching lead stats...");
    const todayLeads = await Lead.countDocuments({
      createdAt: { $gte: new Date().setHours(0, 0, 0, 0) }
    });
    const uniqueCompanies = (await Lead.distinct('company')).length;
    const thisWeekLeads = await Lead.countDocuments({
      createdAt: { $gte: new Date(new Date() - 7 * 24 * 60 * 60 * 1000) }
    });
    const convertedLeads = await Lead.countDocuments({ status: 'Converted' });
    const lostLeads = await Lead.countDocuments({ status: 'Lost' });
    const newLeads = await Lead.countDocuments({ status: 'New' });
    console.log("Lead stats fetched successfully.");
    return { todayLeads, uniqueCompanies, thisWeekLeads, convertedLeads, lostLeads, newLeads };
  } catch (error) {
    console.error("Error fetching lead stats:", error);
    throw error;
  }
}

// Users
async function getUserStats() {
  try {
    console.log("Fetching user stats...");
    const totalDevelopers = await User.countDocuments({
      department: "development",
    });
    const totalSalesUsers = await User.countDocuments({
      department: "sales",
    });
    const developersOnProjects = (await Project.distinct('assignedTo')).length;
    console.log("User stats fetched successfully.");
    return { totalDevelopers, totalSalesUsers, developersOnProjects };
  } catch (error) {
    console.error("Error fetching user stats:", error);
    throw error;
  }
}

// Tasks
async function getTaskStats() {
  try {
    console.log("Fetching task stats...");
    const totalTasks = await Todo.countDocuments();
    const totalTasksThisWeek = await Todo.countDocuments({
      createdAt: { $gte: new Date(new Date() - 7 * 24 * 60 * 60 * 1000) }
    });
    const todaysTasks = await Todo.countDocuments({
      createdAt: { $gte: new Date().setHours(0, 0, 0, 0) }
    });
    const totalDevelopers = await User.countDocuments({ role: 'developer' });
    const averageTasksPerDev = totalDevelopers > 0 ? totalTasks / totalDevelopers : 0;
    console.log("Task stats fetched successfully.");
    return { totalTasks, totalTasksThisWeek, todaysTasks, averageTasksPerDev };
  } catch (error) {
    console.error("Error fetching task stats:", error);
    throw error;
  }
}

// Reminders
async function getReminderStats() {
  try {
    console.log("Fetching reminder stats...");
    const totalReminders = await Reminder.countDocuments();
    const totalRemindersThisWeek = await Reminder.countDocuments({
      dateTime: { $gte: new Date(new Date() - 7 * 24 * 60 * 60 * 1000) }
    });
    const todaysReminders = await Reminder.countDocuments({
      dateTime: { $gte: new Date().setHours(0, 0, 0, 0) }
    });
    console.log("Reminder stats fetched successfully.");
    return { totalReminders, totalRemindersThisWeek, todaysReminders };
  } catch (error) {
    console.error("Error fetching reminder stats:", error);
    throw error;
  }
}

// Combine all stats
async function getDashboardStats(req,res) {
  try {
    console.log("Fetching all dashboard stats...");
    const [projects, queries, leads, users, tasks, reminders] = await Promise.all([
      getProjectStats(),
      getQueryStats(),
      getLeadStats(),
      getUserStats(),
      getTaskStats(),
      getReminderStats()
    ]);
    console.log("All dashboard stats fetched successfully.");
    res.status(200).json({ projects, queries, leads, users, tasks, reminders });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw error;
  }
}

// Export the main function
exports.getDashboardStats = getDashboardStats;
