const express = require("express");

const indexController = require("../controllers/auth");

const router = express.Router();

router.get("/login", indexController.getLogin);
router.post("/login", indexController.postLogin);
router.post("/logout", indexController.postLogout);

module.exports = router;
