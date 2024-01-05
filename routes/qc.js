const express = require("express");

const qcControllers = require("../controllers/qc");

const router = express.Router();

router.get("/home", qcControllers.getHome);
router.get("/start-task", qcControllers.getStartedTask);

module.exports = router;
