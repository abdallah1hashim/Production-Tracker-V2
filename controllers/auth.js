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
      
    const user = await Labeler.findOne({ info: info }).populate('info')||
                 await QC.findOne({ info: info }).populate('info') ||
                 await TL.findOne({ info: info }).populate('info') ||
                 await STL.findOne({ info: info }).populate('info');
    
    if (!user) {
      // User not found
      req.flash("error", "User not found");
      return res.redirect("/login");
    }

    const match = info.password.toString() === password.toString();
    
    if (match) {
      req.session.isLoggedin = true;
      req.session.user = user;

      
      switch (info.position) {
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
          break;
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
