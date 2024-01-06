const Labeler = require("../module/Labeler");
const Task = require("../module/Task");
const Qc = require("../module/qc");

exports.getHome = (req, res, next) => {
  res.render("qc/home.ejs", {
    qc: req.user,
    pageTitle: "Home",
    path: "/qc",
    pos: "qc",
  });
};

exports.getStartedTask = (req, res, next) => {
  Task.find({ teamId: req.user._id, submitted: false, skipped: false })
    .populate("labelerId")
    .then((tasks) => {
      res.render("qc/StartedTasks.ejs", {
        tasks: tasks,
        pageTitle: "Started Tasks",
        path: "/started-Task",
        pos: "qc",
      });
    })
    .catch((err) => {
      err;
    });
};
exports.getLabelers = (req, res, next) => {
  Labeler.find({ team: req.user._id })
    .then((labelers) => {
      console.log(labelers);
      console.log(req.user._id);
      res.render("qc/labelers.ejs", {
        labelers: labelers,
        pageTitle: "Labelers",
        path: "/labelers",
        pos: "qc",
      });
    })
    .catch((err) => {
      err;
    });
};
