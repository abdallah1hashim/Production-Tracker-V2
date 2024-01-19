const Labeler = require("../module/Labeler");
const QC = require("../module/Labeler");
const TL = require("../module/Labeler");
const STL = require("../module/Labeler");
const bcrypt = require("bcryptjs");

exports.getSettings = (req, res, send) => {
  res.render("settings/settings.ejs", {
    user: req.user,
    pageTitle: "Settings",
    path: "/settings",
    pos: req.user.positions,
    error: req.flash("error"),
  });
};
exports.postChangeName = async (req, res, send) => {
  try {
    const password = req.body.password;
    const newName = req.body.name;
    const isPasswordCorrect = await bcrypt.compare(password, req.user.password);
    
    if (!isPasswordCorrect) {
      req.flash("error", "Incorrect password");
      return res.redirect("/settings");
    }
    req.user.name = newName;
    await req.user.save();
    res.redirect("/");
  } catch (error) {
    console.log(error);
    req.flash("error", "something went Wrong :<");
    res.redirect("/");
  }
};
exports.getChangeEmail = (req, res, send) => {
  res.render("settings/change-email.ejs", {
    user: req.user,
    pageTitle: "Settings",
    path: "/change-email",
    pos: req.user.positions,
  });
};
exports.getChangePassword = (req, res, send) => {
  res.render("settings/change-password.ejs", {
    user: req.user,
    pageTitle: "Settings",
    path: "/change-password",
    pos: req.user.positions,
  });
};
// // if (req.user.position === "Labeler") {
//   const user = await Labeler.findById(req.user._id);
//   if (!bcrypt.compare(password, req.password)) {
//     req.flash("error", "Incorrect password");
//     return res.redirect("/settings");
//   }
//   user.name = newName;
//   await user.save();
//   req.
// }
// if (req.user.position === "Quality Control") {
//   const user = await Labeler.findById(req.user._id);
//   if (!bcrypt.compare(password, req.password)) {
//     req.flash("error", "Incorrect password");
//     return res.redirect("/settings");
//   }
//   user.name = newName;
//   await user.save();
// }
// if (req.user.position === "Team Lead") {
//   const user = await Labeler.findById(req.user._id);
//   if (!bcrypt.compare(password, req.password)) {
//     req.flash("error", "Incorrect password");
//     return res.redirect("/settings");
//   }
//   user.name = newName;
//   await user.save();
// }
// if (req.user.position === "Senior Team Lead") {
//   const user = await Labeler.findById(req.user._id);
//   if (!bcrypt.compare(password, req.password)) {
//     req.flash("error", "Incorrect password");
//     return res.redirect("/settings");
//   }
//   user.name = newName;
//   await user.save();
// }
