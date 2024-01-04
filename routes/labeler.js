const express = require("express");

const router = express.Router();

router.get("/", (req, res, next) => {
  res.render("labeler.ejs");
});

module.exports = router;
