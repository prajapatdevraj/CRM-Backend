const express = require("express");
const app = express();
const authRouter = require("./routes/authRouter");
const queryRouter = require("./routes/queryRouter");
const todoRouter = require("./routes/todoRouter");
const adminRouter = require("./routes/adminRoute");
const projectRouter = require("./routes/projectRoute");
const leadRouter = require("./routes/leadRouter");
const meetingRouter = require("./routes/meetingRouter");
const reminderRouter = require("./routes/reminderRouter");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { connectMongoDB } = require("./db/connectToMongoDB");
app.use(express.json());
app.use(cookieParser());
dotenv.config();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use("/api/auth", authRouter);
app.use("/api/query", queryRouter);
app.use("/api/meetings", meetingRouter);
app.use("/api/todo", todoRouter);
app.use("/api/admin", adminRouter);
app.use("/api/projects", projectRouter);
app.use("/api/leads", leadRouter);
app.use("/api/reminders", reminderRouter);

app.listen(3001, () => {
  connectMongoDB();
  console.log("server is running on the port 3000 ");
});
