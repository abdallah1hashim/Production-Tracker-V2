const Labeler = require("../models/Labeler");
const Task = require("../models/Task");
const Qc = require("../models/Qc");

exports.getHome = (req, res, next) => {
  res.render("team/home.ejs", {
    user: req.user,
    pageTitle: "Home",
    path: "/qc",
    pos: req.user.position,
    success: req.flash("success"),
    error: req.flash("error"),
  });
};

exports.getStartedTask = async (req, res, next) => {
  try {
    // Find all labelers with qcId equal to the current user's ID
    const labelers = await Labeler.find({ qcId: req.user._id });

    // Extract labeler IDs from the found labelers
    const labelerIds = labelers.map(labeler => labeler._id);

    // Find tasks for the current team with submitted false and skipped false
    const tasks = await WorksOn.find({ labelerId: { $in: labelerIds }, submittedNumObj: 0 })
      .populate({
        path: 'taskId',
        populate: {
          path: 'queueId',
        },
      });

    // Sort tasks based on queue name
    const sortedTasks = tasks.sort((a, b) => a.taskId.queueId.name.localeCompare(b.taskId.queueId.name));

    res.render('team/StartedTasks.ejs', {
      tasks: sortedTasks,
      pageTitle: 'Started Tasks',
      path: 'start-Task',
      pos: req.user.position,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};
exports.getLabelers = async (req, res, next) => {
  try {
    // Find labelers with the specified team ID
    const labelers = await Labeler.find({ qcId: req.user._id });

    res.render('team/labelers.ejs', {
      labelers: labelers,
      pageTitle: 'Labelers',
      path: '/labelers',
      pos: req.user.position,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};
// exports.postEditQueue= (req, res, next) {

// }

// need to be updated
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
    teamId: req.user._id,
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
    teamId: req.user._id,
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
    teamId: req.user._id,
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
