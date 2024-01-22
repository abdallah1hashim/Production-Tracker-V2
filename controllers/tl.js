const Task = require("../module/Task");
const Labeler = require("../module/Labeler");

exports.getHome = (req, res, send) => {
  res.render("team/home.ejs", {
    user: req.user,
    pageTitle: "Home",
    path: "/tl",
    pos: req.user.position,
  });
};
exports.getStartedTask = (req, res, next) => {
  Task.find({ teamLeadId: req.user._id, submitted: false, skipped: false })
    .populate("labelerId")
    .then((tasks) => {
      console.log(tasks);
      res.render("team/StartedTasks.ejs", {
        tasks: tasks,
        pageTitle: "Started Tasks",
        path: "/started-tasks",
        pos: req.user.position,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getLabelers = (req, res, next) => {
  Labeler.find({ location: req.user._id })
    .then((labelers) => {
      res.render("team/labelers.ejs", {
        labelers: labelers,
        pageTitle: "Labelers",
        path: "/labelers",
        pos: req.user.position,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
