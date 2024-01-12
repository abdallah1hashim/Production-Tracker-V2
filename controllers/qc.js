const Labeler = require("../module/Labeler");
const Task = require("../module/Task");
const Qc = require("../module/qc");

exports.getHome = (req, res, next) => {
  res.render("team/home.ejs", {
    user: req.user,
    pageTitle: "Home",
    path: "/qc",
    pos: "qc",
  });
};

exports.getStartedTask = (req, res, next) => {
  console.log(req.user);
  Task.find({ teamId: req.user._id, submitted: false, skipped: false })
    .populate("queueName")
    .populate("labelerId")
    .then((tasks) => {
      res.render("team/StartedTasks.ejs", {
        tasks: tasks,
        pageTitle: "Started Tasks",
        path: "start-Task",
        pos: "qc",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.getLabelers = (req, res, next) => {
  Labeler.find({ team: req.user._id })
    .then((labelers) => {
      res.render("team/labelers.ejs", {
        labelers: labelers,
        pageTitle: "Labelers",
        path: "/labelers",
        pos: "qc",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
// exports.postEditQueue= (req, res, next) {

// }
