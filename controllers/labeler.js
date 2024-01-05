const Labeler = require("../module/Labeler");
const StartTask = require("../module/startedTasks");

exports.getHome = (req, res, next) => {
  res.render("labeler/labeler.ejs", {
    labelerDetails: req.user,
    pageTitle: "Home",
    path: "/labler",
  });
};

exports.getStartTask = (req, res, next) => {
  res.render("labeler/start.ejs", {
    labelerDetails: req.user,
    pageTitle: "Start Task",
    path: "/start-task",
  });
};
exports.postStartTask = (req, res, next) => {
  console.log;
  const labelerId = req.body.labelerId;
  const TaskId = req.body.TaskId;
  const queueName = req.body.queueName;
  const numObj = req.body.numObj;
  const date = Date.now().toLocaleString();

  const startTask = new StartTask({
    id: TaskId,
    numObj: numObj,
    date: date,
    queueName: queueName,
    labelerId: labelerId,
  });
  startTask.save();

  res.redirect("/home");
};
exports.getSubmitTask = (req, res, next) => {
  res.render("labeler/submit.ejs", {
    pageTitle: "Submit Task",
    path: "/submit-task",
  });
};
exports.getSpl = (req, res, next) => {
  res.render("labeler/spl.ejs", {
    pageTitle: "SPL",
    path: "/spl",
  });
};
exports.getHours = (req, res, next) => {
  res.render("labeler/hours.ejs", {
    pageTitle: "Hours",
    path: "/hours",
  });
};
