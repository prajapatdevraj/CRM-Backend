const Reminder = require("../models/reminderModel");

exports.createReminder = async (req, res) => {
  try {
    const { title, date, time } = req.body; 
    const user = res.user._id; 
    console.log("createReminder called req.body :>> ", req.body,user);

    const dateTime = new Date(`${date}T${time}`);
  console.log("dateTime :>> ", dateTime);
    const newReminder = new Reminder({
      title,
      dateTime,
      userId: user,
    });

    const savedReminder = await newReminder.save();
    return res.status(201).json({
      success: true,
      message: "Reminder created successfully",
      reminder: savedReminder,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateReminder = async (req, res) => {
  try {
    console.log("update reminder called");
    const { id } = req.params;
    const updatedData = req.body;
    const updatedReminder = await Reminder.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updatedReminder) {
      return res
        .status(404)
        .json({ success: false, message: "Reminder not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Reminder updated successfully",
      reminder: updatedReminder,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteReminder = async (req, res) => {
  try {
    console.log("delete route called")
    const { id } = req.params;

    const deletedReminder = await Reminder.findByIdAndDelete(id);
    if (!deletedReminder) {
      return res
        .status(404)
        .json({ success: false, message: "Reminder not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Reminder deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAllReminders = async (req, res) => {
  try {
    console.log("get all reminder called user ",res.user)
    const reminders = await Reminder.find({ userId: res.user?._id });
    return res.status(200).json({ success: true, reminders });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
exports.getRemindersOfDay = async (req, res) => {
  try {
    const { date } = req.params;
    console.log('date in get reminders of the day:>> ', date);
    const userId = res.user._id;

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const reminders = await Reminder.find({
      userId,
      dateTime: {
        $gte: startOfDay,
        $lt: new Date(endOfDay.getTime() + 1000),
      },
    }).sort({ dateTime: -1 });

    if (reminders.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No reminders found for this day" });
    }

    return res.status(200).json({ success: true, reminders });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

