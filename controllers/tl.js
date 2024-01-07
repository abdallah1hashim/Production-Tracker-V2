const Task = require("../module/Task");

exports.getHome = (req, res, send) => {
  res.render("team/home.ejs", {
    user: req.user,
    pageTitle: "Home",
    path: "/tl",
    pos: "tl",
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
        path: "/started-Task",
        pos: "tl",
      });
    })
    .catch((err) => {
      err;
    });
};

//   exports.getLabelers = (req, res, next) => {
//     Labeler.find({ location: req.user._id })
//       .then((labelers) => {
//         console.log(labelers);
//         console.log(req.user._id);
//         res.render("tl/labelers.ejs", {
//           labelers: labelers,
//           pageTitle: "Labelers",
//           path: "/labelers",
//           pos: "tl",
//         });
//       })
//       .catch((err) => {
//         err;
//       });
//   };
