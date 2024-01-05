exports.getIndex = (req, res, next) => {
  res.render("app/index.ejs", { pageTitle: "Production Tracker" });
};

exports.getLogin = (req, res, next) => {
  res.render("app/login.ejs", { pageTitle: "Login" });
};

exports.postLogin = (req, res, next) => {
  res.redirect("/labeler/home");
};
