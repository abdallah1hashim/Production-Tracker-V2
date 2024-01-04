const express = require("express");

const router = express.Router();

router.get("/", (req, res, next) => {
  res.render("labeler/labeler.ejs", { path: "/labler" });
});
router.get("/start-task", (req, res, next) => {
  res.render("labeler/start.ejs", { path: "/start-task" });
});

module.exports = router;
