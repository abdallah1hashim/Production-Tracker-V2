const express = require("express");

const stlControllers = require("../controllers/stl");
const indexControllers = require("../controllers/index");

const router = express.Router();

router.get("/home", stlControllers.getHome);
router.get("/start-task", stlControllers.getStartedTask);
router.get("/create-team-lead", indexControllers.getcreatTL);
router.get("/analytics", stlControllers.getAnalytics);
// router.get("/labelers", tlControllers.getLabelers);

module.exports = router;
