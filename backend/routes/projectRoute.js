const express = require("express");
const router = express.Router();
const {
  createProject,
  deleteProject,
  getAllProjects,
  getProjectById,
  getUserProjects,
  updateProject,
} = require("../controllers/projectController");
const protectRoute = require("../middleware/protectRoute");
const { adminOnly } = require("../middleware/protectAdminRotute");
router.use(protectRoute);

router.get("/", adminOnly, getAllProjects);

router.get("/user", getUserProjects);

router.get("/:id", getProjectById);

router.post("/create-project", adminOnly, createProject);

router.post("/update-project/:id", adminOnly, updateProject);

router.get("/delete-project/:id", adminOnly, deleteProject);

module.exports = router;
