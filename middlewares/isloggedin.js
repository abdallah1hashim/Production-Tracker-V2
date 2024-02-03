module.exports = (req, res, next) => {
  if (req.session.isLoggedin) {
    const position_ = req.session.user.info.position;
    if (position_ === "Labeler") {
      return res.redirect("/labeler/home");
    } else if (position_ === "Quality Control") {
      return res.redirect("/qc/home");
    } else if (position_ === "Team Lead") {
      return res.redirect("/tl/home");
    } else if (position_ === "Senior Team Lead") {
      return res.redirect("/stl/home");
    }
  }

  next();
};
