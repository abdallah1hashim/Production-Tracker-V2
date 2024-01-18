const express = require("express");

const labelerController = require("../controllers/labeler");
const isNotLoggedIn = require("../middlewares/isNotLoggedIn");

const router = express.Router();

router.get("/home", isNotLoggedIn, labelerController.getHome);
router.get("/start-task", isNotLoggedIn, labelerController.getStartTask);
router.post("/add-task", isNotLoggedIn, labelerController.postStartTask);
router.get("/submit-task", labelerController.getSubmitTask);
router.post(
  "/post-submit-task",
  isNotLoggedIn,
  labelerController.postSubmitTask
);
router.get("/analytics", isNotLoggedIn, labelerController.getAnalytics);
router.get("/spl", isNotLoggedIn, labelerController.getSpl);
router.get("/hours", isNotLoggedIn, labelerController.getHours);

module.exports = router;
