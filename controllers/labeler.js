const Labeler = require("../module/Labeler");
const Task = require("../module/Task.js");
const Q = require("../module/queues");
let LabelerUser;

exports.getHome = async (req, res, next) => {
  LabelerUser = await Labeler.findOne(req.user._id)
    .populate({ path: "team", select: "name" })
    .populate({ path: "seniorId" })
    .populate({ path: "location", select: "locationName _id" })
    .exec();

  res.render("labeler/home.ejs", {
    labelerDetails: LabelerUser,
    pageTitle: "Home",
    path: "/labler",
    pos: "labeler",
  });
};

exports.getStartTask = (req, res, next) => {
  console.log("Inside getStartTask controller");

  Q.find()
    .then((obj) => {
      console.log(obj); // Log the object you retrieved
      res.render("labeler/start.ejs", {
        labelerDetails: req.user,
        queues: obj,
        pageTitle: "Start Task",
        path: "/start-task",
        pos: "labeler",
      });
    })
    .catch((err) => {
      console.log(err); // Log any errors that occur
      res.status(500).send("Internal Server Error");
    });
};

exports.postStartTask = async (req, res, next) => {
  try {
    const labelerId = req.body.labelerId;
    const TaskId = req.body.TaskId;
    const queueName = req.body.queueName;
    const numObj = req.body.numObj;
    const date = new Date().toLocaleString();
    const teamId = req.user.team._id;
    const seniotId = req.user.seniorId._id;
    const teamLeadId = req.user._id;

    let task = await Task.findOne({ id: TaskId });

    if (!task) {
      const startTask = new Task({
        id: TaskId,
        StartednumObj: numObj,
        startDate: date,
        queueName: queueName,
        labelerId: labelerId,
        teamId: teamId,
        seniorId: seniotId,
        teamLeadId: teamLeadId,
        submitted: false,
        skipped: false,
        labelersWorkedOn: [{ labelerId: labelerId }],
      });

      await startTask.save();
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

      await task.save();
    }

    return res.redirect("/labeler/home");
  } catch (err) {
    console.error(err);
    // Handle the error appropriately, e.g., by sending an error response to the client
    res.status(500).send("Internal Server Error");
  }
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

// exports.postStartTask = (req, res, next) => {
//   console.log(req.user);
//   const labelerId = req.body.labelerId;
//   const TaskId = req.body.TaskId;
//   const queueName = req.body.queueName;
//   const numObj = req.body.numObj;
//   const date = new Date().toLocaleString();
//   const teamId = req.user.team._id;
//   const seniotId = req.user.seniorId._id;
//   const teamLeadId = req.user._id;

//   Task.findOne({ id: TaskId })
//     .then((task) => {
//       if (!task) {
//         const startTask = new Task({
//           id: TaskId,
//           StartednumObj: numObj,
//           startDate: date,
//           queueName: queueName,
//           labelerId: labelerId,
//           teamId: teamId,
//           seniorId: seniotId,
//           teamLeadId: teamLeadId,
//           submitted: false,
//           skipped: false,
//           labelersWorkedOn: [{ labelerId: labelerId }],
//         });
//         startTask.save();
//         Labeler.findById(req.user._id)
//           .then((l) => {
//             l.tasks.push(startTask);
//             l.save();
//           })
//           .catch((err) => console.log(err));
//         res.redirect("/labeler/home");
//       } else if (task && labelerId) {
//         task.StartednumObj = numObj;
//         task.startDate = date;
//         task.queueName = queueName;
//         task.labelerId = labelerId;
//         task.teamId = teamId;
//         task.submitted = false;
//         task.skipped = false;

//         const labelerWorkedOn = { labelerId: labelerId };
//         task.labelersWorkedOn.push(labelerWorkedOn);

//         task.save();

//         res.redirect("/labeler/home");
//       }
//     })
//     .catch((err) => console.log(err));
// };
