const express = require("express");
const router = express.Router();
const {
  getAllUserTodos,
  editUserTodo,
  deleteUserTodo,
  getAllUsers,
  deleteUser,
  editUserName,
  getDashboardStats,
} = require("../controllers/adminController");
const  protectRoute  = require("../middleware/protectRoute");
const { adminOnly } = require("../middleware/protectAdminRotute");

router.use(protectRoute);
router.use(adminOnly);

router.get("/", (req,res)=>{
  console.log("admin route called")
  res.send("admin called")
});
router.get("/users", getAllUsers);
router.get("/user/:id", getAllUserTodos);
router.post("/user-todo/edit/:id", editUserTodo);
router.get("/user-todo/delete/:id", deleteUserTodo);
router.get("/user/delete/:id", deleteUser);
router.post("/user/edit/:id", editUserName);
router.get("/dashboard-stats",getDashboardStats);
module.exports = router;
