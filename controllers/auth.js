const Labeler = require("../models/Labeler");
const QC = require("../models/Qc");
const TL = require("../models/Tl");
const STL = require("../models/Stl");
const bcrypt = require("bcryptjs");
const flash = require("connect-flash");

exports.getLogin = (req, res, next) => {
  res.render("auth/login.ejs", {
    pageTitle: "Login",
    error: req.flash("error"),
  });
};

exports.postLogin = async (req, res, next) => {
  try {
    const username = req.body.username;
    const password = req.body.password;

    const user =
      (await Labeler.findOne({ username: username }).populate('info')) ||
      (await QC.findOne({ 'info.username': username }).populate('info')) ||
      (await TL.findOne({ 'info.username': username }).populate('info')) ||
      (await STL.findOne({ 'info.username': username }).populate('info'));

    if (user) {
      const match = await bcrypt.compare(password, user.info.password);

      if (match) {
        req.session.isLoggedin = true;
        req.session.user = user;

        switch (user.info.position) {
          case "Labeler":
            res.redirect("/labeler/home");
            break;
          case "Quality Control":
            res.redirect("/qc/home");
            break;
          case "Team Lead":
            res.redirect("/tl/home");
            break;
          case "Senior Team Lead":
            res.redirect("/stl/home");
            break;
          default:
            res.redirect("/");
        }
      } else {
        // Incorrect password
        req.flash("error", "Incorrect password");
        res.redirect("/login");
      }
    } else {
      // User not found
      req.flash("error", "User not found");
      res.redirect("/login");
    }
  } catch (err) {
    console.error(err);
    res.redirect("/login");
  }
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};
