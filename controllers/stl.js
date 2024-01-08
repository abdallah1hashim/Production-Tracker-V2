const Task = require("../module/Task");

exports.getHome = (req, res, send) => {
  res.render("team/home.ejs", {
    user: req.user,
    pageTitle: "Home",
    path: "/stl",
    pos: "stl",
  });
};

exports.getStartedTask = (req, res, next) => {
  Task.find({ seniroId: req.user._id, submitted: false, skipped: false })
    .populate("labelerId")
    .then((tasks) => {
      res.render("team/StartedTasks.ejs", {
        tasks: tasks,
        pageTitle: "Started Tasks",
        path: "/started-Task",
        pos: "stl",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
