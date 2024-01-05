const Labeler = require("../module/Labeler");
const Task = require("../module/Task");

exports.getHome = (req, res, next) => {
  res.render("qc/home.ejs", {
    qc: req.user,
    pageTitle: "Home",
    path: "/qc",
    pos: "qc",
  });
};

// exports.getHome = (req, res, next) => {
//   Labeler.find({ team: user._id })
//     .then((labelers) => {
//       res.render("qc/tasks.ejs", {
//         qc: req.user,
//         pageTitle: "Tasks",
//         path: "/tasks",
//         pos: "qc",
//       });
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

exports.getStartedTask = (req, res, next) => {
  Task.find({ labelerId: { team: req.user._id } })
    .then((tasks) => {
      console.log(tasks);
    })
    .catch((err) => {
      err;
    });
};