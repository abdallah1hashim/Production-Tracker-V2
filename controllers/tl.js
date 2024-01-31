const Task = require("../models/Task");
const Labeler = require("../models/Labeler");
const helper = require("../helpers/range");

exports.getHome = (req, res, send) => {
  res.render("team/home.ejs", {
    user: req.user,
    pageTitle: "Home",
    path: "/tl",
    pos: req.user.position,
    success: req.flash("success"),
    error: req.flash("error"),
  });
};
exports.getStartedTask = async (req, res, next) => {
  try {
    // Find all QCs associated with the Team Lead
    const qcs = await Qc.find({ tlId: req.user._id });

    // Extract QC IDs from the found QCs
    const qcIds = qcs.map(qc => qc._id);

    // Find all labelers associated with the QCs
    const labelers = await Labeler.find({ qcId: { $in: qcIds } });

    // Extract labeler IDs from the found labelers
    const labelerIds = labelers.map(labeler => labeler._id);

    // Find tasks for the current team lead with submittedNumObj 0
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
      path: '/started-tasks',
      pos: req.user.position,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

exports.getLabelers = async (req, res, next) => {
  try{
  // Find all QCs associated with the Team Lead
  const qcs = await Qc.find({ tlId: req.user._id });

  // Extract QC IDs from the found QCs
  const qcIds = qcs.map(qc => qc._id);

  // Find all labelers associated with the QCs
  const labelers = await Labeler.find({ qcId: { $in: qcIds } });

  // Extract labeler IDs from the found labelers
  const labelerIds = labelers.map(labeler => labeler._id);

  res.render('team/labelers.ejs', {
    labelers: labelerIds,
    pageTitle: 'Labelers',
    path: '/labelers',
    pos: req.user.position,
  });

  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
  
};

// need to be updated
exports.getAnalytics = async (req, res, next) => {
  const date = new Date();
  date.setTime(date.getTime() + helper.MILLISECONDS_IN_HOUR);

  const dayOfWeek = date.getDay();
  const today = date.toDateString();
  const todayTime = date.toLocaleTimeString();

  const { beginningOfDayISOString, endingOfDayISOString } =
    helper.calculateDayRange(date);
  const { beginningOfWeekISOString, endingOfWeekISOString } =
    helper.calculateWeekRange(date, dayOfWeek);
  const { beginningOfMonthISOString, endingOfMonthISOString } =
    helper.calculateMonthRange(date);

  const dailyTasks = await Task.find({
    teamLeadId: req.user._id,
    submitted: true,
    updatedAt: {
      $gte: beginningOfDayISOString,
      $lte: endingOfDayISOString,
    },
  }).populate("queueName");

  const dailyTasksByQueue = dailyTasks.reduce(function (obj, v) {
    obj[v.queueName.name] = (obj[v.queueName.name] || 0) + 1;
    return obj;
  }, {});

  const weeklyTasks = await Task.find({
    teamLeadId: req.user._id,
    submitted: true,
    updatedAt: {
      $gte: beginningOfWeekISOString,
      $lte: endingOfWeekISOString,
    },
  }).populate("queueName");
  const weeklyTasksByQueue = weeklyTasks.reduce(function (obj, v) {
    obj[v.queueName.name] = (obj[v.queueName.name] || 0) + 1;
    return obj;
  }, {});

  const MonthlyTasks = await Task.find({
    teamLeadId: req.user._id,
    submitted: true,
    updatedAt: {
      $gte: beginningOfMonthISOString,
      $lte: endingOfMonthISOString,
    },
  }).populate("queueName");
  const MonthlyTasksByQueue = MonthlyTasks.reduce(function (obj, v) {
    obj[v.queueName.name] = (obj[v.queueName.name] || 0) + 1;
    return obj;
  }, {});
  console.log(dailyTasks);
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
