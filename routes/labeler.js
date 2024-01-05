const express = require("express");

const labelerController = require("../controllers/labeler");

const router = express.Router();

router.get("/home", labelerController.getHome);
router.get("/start-task", labelerController.getStartTask);
router.post("/start-task", labelerController.postStartTask);
router.get("/submit-task", labelerController.getSubmitTask);
router.get("/spl", labelerController.getSpl);
router.get("/hours", labelerController.getHours);

module.exports = router;
