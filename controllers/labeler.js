const Labeler = require("../module/Labeler");
const Task = require("../module/Task.js");

exports.getHome = (req, res, next) => {
  res.render("labeler/home.ejs", {
    team: req.user.team,
    labelerDetails: req.user,
    pageTitle: "Home",
    path: "/labler",
    pos: "labeler",
  });
};

exports.getStartTask = (req, res, next) => {
  Task.findById("6597cdbef00a2b6650a7f0eb")
    .then((obj) => {
      res.render("labeler/start.ejs", {
        labelerDetails: req.user,
        queues: obj.queues,
        pageTitle: "Start Task",
        path: "/start-task",
        pos: "labeler",
      });
    })
    .catch((err) => console.log(err));
};

exports.postStartTask = (req, res, next) => {
  const labelerId = req.body.labelerId;
  const TaskId = req.body.TaskId;
  const queueName = req.body.queueName;
  const numObj = req.body.numObj;
  const date = new Date().toLocaleString();
  const teamId = req.body.teamId;

  Task.findOne({ id: TaskId })
    .then((task) => {
      if (!task) {
        const startTask = new Task({
          id: TaskId,
          StartednumObj: numObj,
          startDate: date,
          queueName: queueName,
          labelerId: labelerId,
          teamId: teamId,
          submitted: false,
          skipped: false,
          labelersWorkedOn: [{ labelerId: labelerId }],
        });
        startTask.save();
        Labeler.findById(req.user._id)
          .then((l) => {
            l.tasks.push(startTask);
            l.save();
          })
          .catch((err) => console.log(err));
        res.redirect("/labeler/home");
      } else if (task && labelerId) {
        task.StartednumObj = numObj;
        task.startDate = date;
        task.queueName = queueName;
        task.labelerId = labelerId;
        task.teamId = teamId;
        task.submitted = false;
        task.skipped = false;

        const labelerWorkedOn = { labelerId: labelerId };
        task.labelersWorkedOn.push(labelerWorkedOn);

        task.save();

        res.redirect("/labeler/home");
      }
    })
    .catch((err) => console.log(err));
};

exports.getSubmitTask = (req, res, next) => {
  Task.find({ labelerId: req.user._id, submitted: false, skipped: false })
    .then((tasks) => {
      res.render("labeler/submit.ejs", {
        tasks: tasks,
        pageTitle: "Submit Task",
        path: "/submit-task",
        pos: "labeler",
      });
    })
    .catch((err) => console.log(err));
};
exports.postSubmitTask = (req, res, next) => {
  const submittedObjects = req.body.submitedObj;
  const status = req.body.status;
  const taskId = req.body.taskId;
  const submitDate = new Date().toLocaleString();
  Task.findOne({ id: +taskId })
    .then((task) => {
      if (!task) {
        // Handle case where task with given ID is not found
        return res.status(404).send("Task not found");
      }

      task.SubmittednumObj = +submittedObjects;
      task.submittedDate = submitDate;

      if (status === "submit") {
        task.submitted = true;
        task.skipped = false;
      } else if (status === "skip") {
        task.submitted = false;
        task.skipped = true;
      } else if (status === "abandoned" || status === "taken") {
        task.submitted = false;
        task.skipped = false;
        task.labelerId = null;
      }

      return task.save(); // Save the updated task
    })
    .then(() => {
      res.redirect("/labeler/home");
    })
    .catch((err) => console.log(err));
};
exports.getSpl = (req, res, next) => {
  res.render("labeler/spl.ejs", {
    pageTitle: "SPL",
    path: "/spl",
    pos: "labeler",
  });
};
exports.getHours = (req, res, next) => {
  res.render("labeler/hours.ejs", {
    pageTitle: "Hours",
    path: "/hours",
    pos: "labeler",
  });
};
