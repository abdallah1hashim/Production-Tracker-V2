const express = require("express");

const indexController = require("../controllers/auth");
const isLoggedin = require("../middlewares/isloggedin");

const router = express.Router();

router.get("/login", isLoggedin, indexController.getLogin);
router.post("/login", indexController.postLogin);
router.post("/logout", indexController.postLogout);

module.exports = router;
