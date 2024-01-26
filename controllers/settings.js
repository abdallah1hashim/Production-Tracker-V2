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
    pos: req.user.position,
    success: req.flash("success"),
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
    req.flash("success", "Name changed successfully!");
    res.redirect("/settings");
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
    success: req.flash("success"),
    error: req.flash("error"),
  });
};
exports.postChangeEmail = async (req, res, send) => {
  try {
    const password = req.body.password;
    const newEmail = req.body.email;
    const isPasswordCorrect = await bcrypt.compare(password, req.user.password);

    if (!isPasswordCorrect) {
      req.flash("error", "Incorrect password");
      return res.redirect("/change-email");
    }
    req.user.email = newEmail;
    await req.user.save();
    req.flash("success", "Email Changed successfully!");
    res.redirect("/change-email");
  } catch (error) {
    console.log(error);
    req.flash("error", "Something Went Wrong :<");
    res.redirect("/");
  }
};
exports.getChangePassword = (req, res, send) => {
  res.render("settings/change-password.ejs", {
    user: req.user,
    pageTitle: "Settings",
    path: "/change-password",
    pos: req.user.positions,
    success: req.flash("success"),
    error: req.flash("error"),
  });
};
exports.postChangePassword = async (req, res, send) => {
  try {
    const password = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const isPasswordCorrect = await bcrypt.compare(password, req.user.password);

    if (!isPasswordCorrect) {
      req.flash("error", "Incorrect password");
      return res.redirect("/change-password");
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    req.user.password = hashedNewPassword;
    await req.user.save();
    req.flash("success", "Password changed successfully!");
    res.redirect("/change-password");
  } catch (error) {
    console.log(error);
    req.flash("error", "Something Went Wrong :<");
    res.redirect("/");
  }
};
