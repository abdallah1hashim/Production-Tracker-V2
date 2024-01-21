module.exports = (req, res, next) => {
  if (req.session.isLoggedin) {
    if (req.user.position === "Labeler") {
      return res.redirect("/labeler/home");
    } else if (req.user.position === "Quality Control") {
      return res.redirect("/qc/home");
    } else if (req.user.position === "Team Lead") {
      return res.redirect("/tl/home");
    } else if (req.user.position === "Senior Team Lead") {
      return res.redirect("/stl/home");
    }
  }

  next();
};
