const express = require("express");
const router = express.Router();
const {
  createLead,
  getLeads,
  updateLead,
  deleteLead,
  getUserLeads,
  getLeadById,
} = require("../controllers/leadController");
const { adminOrSales } = require("../middleware/protectAdminOrSales");
const protectRoute = require("../middleware/protectRoute");

router.use(protectRoute);
router.use(adminOrSales);

router.post("/", createLead);
router.get("/", getLeads);
router.get("/user-leads", getUserLeads); // Specific route
router.get("/lead-details/:id", getLeadById); // Specific route
router.post("/update-lead/:id", updateLead); // General route
router.get("/:id", deleteLead); // General route


module.exports = router;
