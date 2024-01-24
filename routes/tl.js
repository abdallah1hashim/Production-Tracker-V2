const express = require("express");

const tlControllers = require("../controllers/tl");

const router = express.Router();

router.get("/home", tlControllers.getHome);
router.get("/start-task", tlControllers.getStartedTask);
router.get("/labelers", tlControllers.getLabelers);
router.get("/analytics", tlControllers.getAnalytics);

module.exports = router;
