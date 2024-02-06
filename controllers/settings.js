const Labeler = require("../models/Labeler");
const QC = require("../models/Labeler");
const TL = require("../models/Labeler");
const STL = require("../models/Labeler");
const bcrypt = require("bcryptjs");

exports.getSettings = async (req, res, send) => {

  const user = await Labeler.findOne({info :req.session.user.info}).populate('info');
  res.render("settings/settings.ejs", {
    user: user,
    pageTitle: "Settings",
    path: "/settings",
    pos: user.info.position,
    success: req.flash("success"),
    error: req.flash("error"),
  });
};
exports.postChangeName = async (req, res, send) => {
  try {
    const password = req.body.password;
    const newName = req.body.name;
    
    const user = await Labeler.findOne({info :req.session.user.info}).populate('info');

    const isPasswordCorrect = await bcrypt.compare(password, user.info.password);

    if (!isPasswordCorrect) {
      req.flash("error", "Incorrect password");
      return res.redirect("/settings");
    }
    user.info.name = newName;
    req.user = user;
    await req.user.save();
    req.flash("success", "Name changed successfully!");
    res.redirect("/settings");
  } catch (error) {
    console.log(error);
    req.flash("error", "something went Wrong :<");
    res.redirect("/");
  }
};
exports.getChangeEmail = async (req, res, send) => {

  const user = await Labeler.findOne({info :req.session.user.info}).populate('info');

  res.render("settings/change-email.ejs", {
    user: user,
    pageTitle: "Settings",
    path: "/change-email",
    pos: user.info.position,
    success: req.flash("success"),
    error: req.flash("error"),
  });
};
exports.postChangeEmail = async (req, res, send) => {
  try {
    const password = req.body.password;
    const newEmail = req.body.email;

    const user = await Labeler.findOne({info :req.session.user.info}).populate('info');
    const isPasswordCorrect = await bcrypt.compare(password, user.info.password);


    if (!isPasswordCorrect) {
      req.flash("error", "Incorrect password");
      return res.redirect("/change-email");
    }

    user.info.email = newEmail;
    req.user = user;
    await req.user.save();
    req.flash("success", "Email Changed successfully!");
    res.redirect("/change-email");
  } catch (error) {
    console.log(error);
    req.flash("error", "Something Went Wrong :<");
    res.redirect("/");
  }
};
exports.getChangePassword = async (req, res, send) => {
  const user = await Labeler.findOne({info :req.session.user.info}).populate('info');

  res.render("settings/change-password.ejs", {
    user: user,
    pageTitle: "Settings",
    path: "/change-password",
    pos: user.info.position,
    success: req.flash("success"),
    error: req.flash("error"),
  });
};
exports.postChangePassword = async (req, res, send) => {
  try {
    const password = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const user = await Labeler.findOne({info :req.session.user.info}).populate('info');

    const isPasswordCorrect = await bcrypt.compare(password, user.info.password);

    if (!isPasswordCorrect) {
      req.flash("error", "Incorrect password");
      return res.redirect("/change-password");
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    user.info.password = hashedNewPassword;

    req.user = user;
    await req.user.save();
    req.flash("success", "Password changed successfully!");
    res.redirect("/change-password");
  } catch (error) {
    console.log(error);
    req.flash("error", "Something Went Wrong :<");
    res.redirect("/");
  }
};
