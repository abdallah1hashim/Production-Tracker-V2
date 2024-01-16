const express = require("express");

const labelerController = require("../controllers/labeler");

const router = express.Router();

router.get("/home", labelerController.getHome);
router.get("/start-task", labelerController.getStartTask);
router.post("/add-task", labelerController.postStartTask);
router.get("/submit-task", labelerController.getSubmitTask);
router.post("/post-submit-task", labelerController.postSubmitTask);
router.get("/analytics", labelerController.getAnalytics);
router.get("/spl", labelerController.getSpl);
router.get("/hours", labelerController.getHours);

module.exports = router;
