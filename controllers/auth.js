exports.getLogin = (req, res, next) => {
  res.render("auth/login.ejs", { pageTitle: "Login" });
};

exports.postLogin = async (req, res, next) => {
  try {
    if (req.user) {
      switch (req.user.position) {
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
      res.redirect("/");
    }
  } catch (err) {
    console.error(err);
    res.redirect("/");
  }
};
