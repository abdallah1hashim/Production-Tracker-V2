const Labeler = require("../module/Labeler");
const Qc = require("../module/qc");

exports.getIndex = (req, res, next) => {
  res.render("app/index.ejs", { pageTitle: "Production Tracker" });
};

exports.getLogin = (req, res, next) => {
  res.render("app/login.ejs", { pageTitle: "Login" });
};

exports.postLogin = (req, res, next) => {
  res.redirect("/labeler/home");
};
exports.getCreateLabelers = (req, res, next) => {
  Qc.find()
    .then((qc) => {
      res.render("app/create-labeler", {
        qc: qc,
        pageTitle: "Create Labeler",
        path: "/create-labeler",
        pos: "qc",
      });
    })
    .catch((err) => {
      err;
    });
};
exports.postCreateLabelers = (req, res, next) => {
  const newName = req.body.name;
  const newDevice = req.body.device;
  const newUsername = req.body.username;
  const newEmail = req.body.email;
  const newPssword = req.body.password;
  const newTeam = req.body.teamId;
  const newTeamLead = req.body.teamlead;
  const newSenior = req.body.senior;
  Labeler.findOne({ username: newUsername })
    .then((labeler) => {
      if (labeler) return;
      const newLabeler = new Labeler({
        name: newName,
        device: newDevice,
        username: newUsername,
        email: newEmail,
        password: newPssword,
        team: newTeam,
        location: newTeamLead,
        shift: newSenior,
      });
      newLabeler.save();
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};
