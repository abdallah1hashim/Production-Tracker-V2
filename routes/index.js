const express = require("express");

const indexController = require("../controllers/index");
const isLoggedin = require("../middlewares/isloggedin");

const router = express.Router();

router.get("/", isLoggedin, indexController.getIndex);
router.get("/create-labeler", indexController.getCreateLabelers);
router.get("/edit-labeler/:labelerId", indexController.getEditLabelers);
router.post("/create-labeler", indexController.postCreateLabelers);
router.post("/edit-labeler", indexController.postEditLabelers);
router.post("/delete-labeler", indexController.postDeleteLabelers);
router.get("/queue", indexController.getQueue);
router.post("/queue", indexController.postAddQueue);
router.post("/add-queue", indexController.postِAddQueue);
router.post("/edit-queue", indexController.postِEditQueue);
router.post("/delete-queue", indexController.postDeleteQueue);
// router.get("/create-task", indexController.getCreateTask);

module.exports = router;
