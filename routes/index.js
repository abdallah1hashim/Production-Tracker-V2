const express = require("express");

const router = express.Router();

router.get("/", (req, res, next) => {
  res.render("app/index.ejs");
});
router.get("/login", (req, res, next) => {
  res.render("app/login.ejs");
});
router.post("/login", (req, res, next) => {
  res.redirect("/labeler/");
});

module.exports = router;
