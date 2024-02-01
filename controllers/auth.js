const Labeler = require("../models/Labeler");
const QC = require("../models/Qc");
const TL = require("../models/Tl");
const STL = require("../models/Stl");
const Info = require("../models/Info");
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

    const info = await Info.findOne({ username: username });

    if (!info) {
      // User not found
      req.flash("error", "User not found");
      return res.redirect("/login");
    }
      // ||
      // await QC.findOne({ info: info }) ||
      // await TL.findOne({ info: info }) ||
      // await STL.findOne({ info: info })
    const user = await Labeler.findOne({ info: info });
    
    if (!user) {
      // User not found
      req.flash("error", "User not found");
      return res.redirect("/login");
    }

    const match = await bcrypt.compare(password, info.password);
    console.log(match);
    if (match) {
      req.session.isLoggedin = true;
      req.session.user = user;

      switch (info.position) {
        case "Labeler":
          return res.redirect("/labeler/home");
        case "Quality Control":
          return res.redirect("/qc/home");
        case "Team Lead":
          return res.redirect("/tl/home");
        case "Senior Team Lead":
          return res.redirect("/stl/home");
        default:
          return res.redirect("/");
      }
    } else {
      // Incorrect password
      req.flash("error", "Incorrect password");
      return res.redirect("/login");
    }
  } catch (err) {
    console.error("Error during login:", err);
    req.flash("error", "An unexpected error occurred");
    return res.redirect("/login");
  }
};


exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};
