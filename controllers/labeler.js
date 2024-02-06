const Labeler = require("../models/Labeler");
const Task = require("../models/Task");
const Q = require("../models/Queue");
const Info = require("../models/Info");
const WorksOn = require("../models/WorksOn");
const Qc = require("../models/Qc");
const { mongo } = require("mongoose");
const Queue = require("../models/Queue");
let LabelerUser;

exports.getHome = async (req, res, next) => {

  LabelerUser = await Labeler.findOne({info :req.session.user.info}).populate('info').populate('qcId');

  qcUser = await Qc.findOne({_id :LabelerUser.qcId}).populate('info');

  res.render("labeler/home.ejs", {
    labelerDetails: LabelerUser,
    qc:qcUser,
    pageTitle: "Home",
    path: "/labler",
    pos: LabelerUser.info.position,
    error: req.flash("error"),
    success: req.flash("success"),
  });
};

exports.getStartTask = async (req, res, next) => {
  const user = req.session.user;
  const info = await Info.findOne({_id :user.info});
  Q.find({})
    .then((obj) => {
      res.render("labeler/start.ejs", {
        labelerDetails: user,
        queues: obj,
        pageTitle: "Start Task",
        path: "/start-task",
        pos: info.position,
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

    const queue = await Queue.findOne({name :queueName});


    let task = await Task.findOne({ id: TaskId });

    if (!task) {
      const startTask = new Task({
        id: TaskId,
        queueId: queue._id,
        status: "Started",
      });

      await startTask.save();

      const worksOn = new WorksOn({
        labelerId: labelerId,
        taskId: startTask._id,
        StartednumObj: numObj,
        startDate: date,
      });

      
      await worksOn.save();
    } 
    else{
      res.status(404).send("this task is already in progress");
    }
    return res.redirect("/labeler/home");
  } catch (err) {
    console.error(err);
    // Handle the error appropriately, e.g., by sending an error response to the client
    res.status(500).send("Internal Server Error");
  }
};

exports.getSubmitTask = async (req, res, next) => {
  try {
    const info = await Info.findOne({ _id: req.session.user.info });

    const worksOn = await WorksOn.find({ labelerId: req.session.user._id });

    // Extract task IDs from worksOn
    const taskIds = worksOn.map(work => work.taskId);

    // Query tasks based on task IDs and status "Started"
    const tasks = await Task.find({ _id: { $in: taskIds }, status: "Started" });

    
    res.render("labeler/submit.ejs", {
      tasks: tasks,
      pageTitle: "Submit Task",
      path: "/submit-task",
      pos: info.position,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};

exports.postSubmitTask = async (req, res, next) => {
  try {
    const submittedObjects = req.body.submittedObj;
    const taskId = req.body.taskId;
    const submitDate = new Date().toLocaleString();
    const status = req.body.status;

    // Find the Task document based on taskId
    const task = await Task.findOne({ id: +taskId });

    // Find the WorksOn document based on taskId
    const worksOn = await WorksOn.findOne({ taskId: task._id });

    if (!worksOn) {
      // Handle case where WorksOn document with given taskId is not found
      return res.status(404).send("WorksOn document not found");
    }

    // Update the WorksOn document
    worksOn.submittedObj = submittedObjects;
    worksOn.submitDate = submitDate;

    // Save the updated WorksOn document
    await worksOn.save();

    

    if (!task) {
      // Handle case where task with given ID is not found
      return res.status(404).send("Task not found");
    }

    // Update the Task document
    task.status = status;

    // Save the updated Task document
    await task.save();

    res.redirect("/labeler/home");
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};

/// need to be updated
exports.getAnalytics = async (req, res, next) => {
  const date = new Date();
  date.setTime(date.getTime() + 2 * 60 * 60 * 1000);

  const dayOfWeek = date.getDay();
  const today = date.toDateString();
  const todayTime = date.toLocaleTimeString();
  

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

  const worksOndaily = await WorksOn.find({ labelerId: req.session.user._id,
    updatedAt: {
      $gte: beginningOfDayISOString,
      $lte: endingOfDayISOString,
    }}).populate('taskId');


  // Extract task IDs from worksOn
  const taskIds = worksOndaily.map(work => work.taskId);
 
  const dailyTasks = await Task.find({_id: { $in: taskIds }}).populate('queueId');

  const dailyTasksByQueue = dailyTasks.reduce(function (obj, v) {
    // increment or set the property
    // `(obj[v.status] || 0)` returns the property value if defined
    // or 0 ( since `undefined` is a falsy value
    obj[v.queueId.name] = (obj[v.queueId.name] || 0) + 1;
    // return the updated object
    return obj;
    // set the initial value as an object
  }, {});

  const worksOnWeek = await WorksOn.find({ labelerId: req.session.user._id,
    updatedAt: {
      $gte: beginningOfWeekISOString,
      $lte: endingOfWeekISOString,
    }}).populate('taskId')
  
  const weeklyTasks = await Task.find({_id: worksOnWeek.taskId}).populate('queueId');

  
  const weeklyTasksByQueue = weeklyTasks.reduce(function (obj, v) {
    // increment or set the property
    // `(obj[v.status] || 0)` returns the property value if defined
    // or 0 ( since `undefined` is a falsy value
    obj[v.queueId.name] = (obj[v.queueId.name] || 0) + 1;
    // return the updated object
    return obj;
    // set the initial value as an object
  }, {});

  const worksOnMonthly = await WorksOn.find({ labelerId: req.session.user._id,
    updatedAt: {
      $gte: beginningOfMonthISOString,
      $lte: endingOfMonthISOString,
    }}).populate('taskId')
  
  const MonthlyTasks = await Task.find({_id: worksOnMonthly.taskId}).populate('queueId');
  
  const MonthlyTasksByQueue = MonthlyTasks.reduce(function (obj, v) {
    // increment or set the property
    // `(obj[v.status] || 0)` returns the property value if defined
    // or 0 ( since `undefined` is a falsy value
    obj[v.queueId.name] = (obj[v.queueId.name] || 0) + 1;
    // return the updated object
    return obj;
    // set the initial value as an object
  }, {});


  const info = await Info.findOne({_id :req.session.user.info});
  const user = await Labeler.findOne({info :req.session.user.info}).populate('info')


  res.render("app/analytics.ejs", {
    pageTitle: "ِAnalytics",
    path: "/analytics",
    user: user,
    pos: info.position,
    today: today,
    todayTime: todayTime,
    dailyTasks: dailyTasks,
    worksOndaily: worksOndaily,
    dailyTasksbyQueue: dailyTasksByQueue,
    weeklyTasks: weeklyTasks,
    weeklyTasksbyQueue: weeklyTasksByQueue,
    MonthlyTasks: MonthlyTasks,
    MonthlyTasksByQueue: MonthlyTasksByQueue,
  });
};
exports.getSpl = async (req, res, next) => {
  const date = new Date();
  const today = date.toDateString();
  const todayTime = date.toLocaleTimeString();

  const user = await Labeler.findOne({info :req.session.user.info}).populate('info');

  res.render("labeler/spl.ejs", {
    pageTitle: "SPL",
    path: "/spl",
    pos: user.info.position,
    today: today,
    todayTime: todayTime,
    username: user.info.username,
  });
};
exports.getHours = async (req, res, next) => {
  const date = new Date();
  const today = date.toDateString();
  const todayTime = date.toLocaleTimeString();

  const user = await Labeler.findOne({info :req.session.user.info}).populate('info');

  res.render("labeler/hours.ejs", {
    pageTitle: "Hours",
    path: "/hours",
    pos: user.info.position,
    today: today,
    todayTime: todayTime,
    username: user.info.username,
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
