const express = require("express");

const indexController = require("../controllers/index");

const router = express.Router();

router.get("/", indexController.getIndex);
router.get("/login", indexController.getLogin);
router.post("/login", indexController.postLogin);
router.get("/create-labeler", indexController.getCreateLabelers);
router.post("/create-labeler", indexController.postCreateLabelers);
router.get("/queue", indexController.getQueue);
router.post("/queue", indexController.postAddQueue);
router.post("/add-queue", indexController.postِAddQueue);
router.post("/edit-queue", indexController.postِEditQueue);
router.post("/delete-queue", indexController.postDeleteQueue);
// router.get("/create-task", indexController.getCreateTask);

module.exports = router;
