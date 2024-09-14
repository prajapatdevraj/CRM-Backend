const express=require("express");
const  protectRoute  = require("../middleware/protectRoute");
const { createTodo, editTodo, deleteTodo, allTodos } = require("../controllers/todoController");
const router=express.Router();
router.get("/",protectRoute,allTodos);
router.post("/create",protectRoute,createTodo);
router.post("/edit/:id",protectRoute,editTodo);
router.get("/delete/:id",protectRoute,deleteTodo);
module.exports=router