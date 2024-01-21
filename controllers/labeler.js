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
    pos: req.user.position,
  });
};

exports.getStartTask = (req, res, next) => {
  Q.find()
    .then((obj) => {
      res.render("labeler/start.ejs", {
        labelerDetails: req.user,
        queues: obj,
        pageTitle: "Start Task",
        path: "/start-task",
        pos: req.user.position,
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
        pos: req.user.position,
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
exports.getAnalytics = async (req, res, next) => {
  const date = new Date();
  date.setTime(date.getTime() + 2 * 60 * 60 * 1000);

  const dayOfWeek = date.getDay();
  const today = date.toDateString();
  const todayTime = date.toLocaleTimeString();
  console.log(date);

  // Calculate the beginning and ending of the day
  const beginningOfDay = new Date(date);
  beginningOfDay.setUTCHours(0, 0, 0, 0);
  const endingOfDay = new Date(date);
  endingOfDay.setUTCHours(23, 59, 59, 999);

  // Calculate the beginning and ending of the week
  const beginningOfWeek = new Date(date);
  beginningOfWeek.setUTCHours(0, 0, 0, 0);
  beginningOfWeek.setDate(date.getDate() - dayOfWeek); // Set to the first day of the week
  const endingOfWeek = new Date(date);
  endingOfWeek.setUTCHours(23, 59, 59, 999);
  endingOfWeek.setDate(date.getDate() + (6 - dayOfWeek)); // Set to the last day of the week

  // Calculate the beginning and ending of the month
  const beginningOfMonth = new Date(date);
  beginningOfMonth.setUTCHours(0, 0, 0, 0);
  beginningOfMonth.setDate(1); // Set to the first day of the month
  const endingOfMonth = new Date(date);
  endingOfMonth.setUTCHours(23, 59, 59, 999);
  endingOfMonth.setMonth(date.getMonth() + 1, 0); // Set to the last day of the month

  const beginningOfDayISOString = beginningOfDay.toISOString();
  const endingOfDayISOString = endingOfDay.toISOString();
  const beginningOfWeekISOString = beginningOfWeek.toISOString();
  const endingOfWeekISOString = endingOfWeek.toISOString();
  const beginningOfMonthISOString = beginningOfMonth.toISOString();
  const endingOfMonthISOString = endingOfMonth.toISOString();

  const dailyTasks = await Task.find({
    labelerId: req.user._id,
    submitted: true,
    updatedAt: {
      $gte: beginningOfDayISOString,
      $lte: endingOfDayISOString,
    },
  }).populate("queueName");
  const dailyTasksByQueue = dailyTasks.reduce(function (obj, v) {
    // increment or set the property
    // `(obj[v.status] || 0)` returns the property value if defined
    // or 0 ( since `undefined` is a falsy value
    obj[v.queueName.name] = (obj[v.queueName.name] || 0) + 1;
    // return the updated object
    return obj;
    // set the initial value as an object
  }, {});

  const weeklyTasks = await Task.find({
    labelerId: req.user._id,
    submitted: true,
    updatedAt: {
      $gte: beginningOfWeekISOString,
      $lte: endingOfWeekISOString,
    },
  }).populate("queueName");
  const weeklyTasksByQueue = weeklyTasks.reduce(function (obj, v) {
    // increment or set the property
    // `(obj[v.status] || 0)` returns the property value if defined
    // or 0 ( since `undefined` is a falsy value
    obj[v.queueName.name] = (obj[v.queueName.name] || 0) + 1;
    // return the updated object
    return obj;
    // set the initial value as an object
  }, {});
  const MonthlyTasks = await Task.find({
    labelerId: req.user._id,
    submitted: true,
    updatedAt: {
      $gte: beginningOfMonthISOString,
      $lte: endingOfMonthISOString,
    },
  }).populate("queueName");
  const MonthlyTasksByQueue = MonthlyTasks.reduce(function (obj, v) {
    // increment or set the property
    // `(obj[v.status] || 0)` returns the property value if defined
    // or 0 ( since `undefined` is a falsy value
    obj[v.queueName.name] = (obj[v.queueName.name] || 0) + 1;
    // return the updated object
    return obj;
    // set the initial value as an object
  }, {});

  res.render("app/analytics.ejs", {
    pageTitle: "ِAnalytics",
    path: "/analytics",
    user: req.user,
    pos: req.user.position,
    today: today,
    todayTime: todayTime,
    dailyTasks: dailyTasks,
    dailyTasksbyQueue: dailyTasksByQueue,
    weeklyTasks: weeklyTasks,
    weeklyTasksbyQueue: weeklyTasksByQueue,
    MonthlyTasks: MonthlyTasks,
    MonthlyTasksByQueue: MonthlyTasksByQueue,
  });
};
exports.getSpl = (req, res, next) => {
  const date = new Date();
  const today = date.toDateString();
  const todayTime = date.toLocaleTimeString();
  res.render("labeler/spl.ejs", {
    pageTitle: "SPL",
    path: "/spl",
    pos: req.user.position,
    today: today,
    todayTime: todayTime,
    username: req.user.username,
  });
};
exports.getHours = (req, res, next) => {
  const date = new Date();
  const today = date.toDateString();
  const todayTime = date.toLocaleTimeString();
  res.render("labeler/hours.ejs", {
    pageTitle: "Hours",
    path: "/hours",
    pos: req.user.position,
    today: today,
    todayTime: todayTime,
    username: req.user.username,
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
