const express = require("express");

const indexController = require("../controllers/auth");

const router = express.Router();

router.get("/login", indexController.getLogin);
router.post("/login", indexController.postLogin);

module.exports = router;
