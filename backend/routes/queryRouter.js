const express = require("express");
const router = express.Router();
const queryController = require("../controllers/queryController");


router.post("/create", queryController.submitQuery);
router.get("/", queryController.fetchQueries);
router.post(
  "/send-confirmation",
  queryController.sendConfirmationEmail
);
router.post("/:id", queryController.respondToQuery);

module.exports = router;
