const express = require("express");

const indexController = require("../controllers/index");

const router = express.Router();

router.get("/", indexController.getIndex);
router.get("/login", indexController.getLogin);
router.post("/login", indexController.postLogin);
router.get("/create-labeler", indexController.getCreateLabelers);
router.post("/create-labeler", indexController.postCreateLabelers);
// router.get("/create-task", indexController.getCreateTask);

module.exports = router;
