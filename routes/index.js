const express = require("express");

const indexController = require("../controllers/index");

const router = express.Router();

router.get("/", indexController.getIndex);
router.get("/login", indexController.getLogin);
router.post("/login", indexController.postLogin);

module.exports = router;
