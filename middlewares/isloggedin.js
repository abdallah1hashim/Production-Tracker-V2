module.exports = (req, res, next) => {
  if (req.session.isLoggedin) {
    req.user.position === "Labeler" && res.redirect("/labeler/home");
    req.user.position === "Quality Control" && res.redirect("/qc/home");
    req.user.position === "Team Lead" && res.redirect("/tl/home");
    req.user.position === "Senior Team Lead" && res.redirect("/stl/home");
  }

  next();
};
