const Labeler = require("../module/Labeler");
const QC = require("../module/qc");
const TL = require("../module/tl");
const STL = require("../module/stl");
const bcrypt = require("bcryptjs");

exports.getLogin = (req, res, next) => {
  res.render("auth/login.ejs", { pageTitle: "Login" });
};

exports.postLogin = async (req, res, next) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    const user =
      (await Labeler.findOne({ username: username })) ||
      (await QC.findOne({ username: username })) ||
      (await TL.findOne({ username: username })) ||
      (await STL.findOne({ username: username }));

    if (user) {
      const match = await bcrypt.compare(password, user.password);

      if (match) {
        req.session.isLoggedin = true;
        req.session.user = user;

        switch (user.position) {
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
        res.redirect("/login");
      }
    } else {
      // User not found
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
