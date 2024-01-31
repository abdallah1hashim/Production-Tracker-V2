const Task = require("../models/Task");
const Labeler = require("../models/Labeler");
const WorksOn = require("../models/WorksOn");
const QC = require("../models/Qc");
const TL = require("../models/Tl");

exports.getHome = (req, res, send) => {
  res.render("team/home.ejs", {
    user: req.user,
    pageTitle: "Home",
    path: "/stl",
    pos: req.user.position,
    success: req.flash("success"),
    error: req.flash("error"),
  });
};

exports.getStartedTask = async (req, res, next) => {
  try {
    // Find all Team Leaders associated with the Senior Team Leader
    const teamLeaders = await TL.find({ stlID: req.user._id });

    // Extract Team Leader IDs from the found Team Leaders
    const teamLeaderIds = teamLeaders.map(teamLeader => teamLeader._id);

    // Find all QCs associated with the Team Leaders
    const qcs = await QC.find({ tlId: { $in: teamLeaderIds } });

    // Extract QC IDs from the found QCs
    const qcIds = qcs.map(qc => qc._id);

    // Find all labelers associated with the QCs
    const labelers = await Labeler.find({ qcId: { $in: qcIds } });

    // Extract labeler IDs from the found labelers
    const labelerIds = labelers.map(labeler => labeler._id);

    // Find tasks for the current Senior Team Leader with submittedNumObj 0
    const tasks = await WorksOn.find({ labelerId: { $in: labelerIds }, submittedNumObj: 0 })
      .populate({
        path: 'taskId',
        populate: {
          path: 'queueId',
        },
      });

    res.render('team/StartedTasks.ejs', {
      tasks: tasks,
      pageTitle: 'Started Tasks',
      path: '/started-Task',
      pos: req.user.position,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};
exports.getLabelers = async (req, res, next) => {
  try {
    // Find all Team Leaders associated with the Senior Team Leader
    const teamLeaders = await TL.find({ stlID: req.user._id });

    // Extract Team Leader IDs from the found Team Leaders
    const teamLeaderIds = teamLeaders.map(teamLeader => teamLeader._id);

    // Find all QCs associated with the Team Leaders
    const qcs = await QC.find({ tlId: { $in: teamLeaderIds } });

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


// need to be modified
exports.getAnalytics = async (req, res, next) => {
  console.log(req.user.position);

  const MILLISECONDS_IN_HOUR = 2 * 60 * 60 * 1000;
  // function to cala The Date Range I want
  function calculateDateRange(date, daysAgo = 0) {
    const start = new Date(date);
    start.setDate(date.getDate() - daysAgo);
    start.setUTCHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setDate(date.getDate() - daysAgo);
    end.setUTCHours(23, 59, 59, 999);

    return { start, end };
  }

  async function getTasksInRange(startDate, endDate) {
    return await Task.find({
      seniorId: req.user._id,
      submitted: true,
      updatedAt: {
        $gte: startDate.toISOString(),
        $lte: endDate.toISOString(),
      },
    }).populate("queueName");
  }
  const date = new Date();
  date.setTime(date.getTime() + MILLISECONDS_IN_HOUR);

  const dayOfWeek = date.getDay();
  const today = date.toDateString();
  const todayTime = date.toLocaleTimeString();
  console.log(date);

  const { start: beginningOfDay, end: endingOfDay } = calculateDateRange(date);
  const { start: beginningOfPreviousDay, end: endingOfPreviousDay } =
    calculateDateRange(date, 1);
  const { start: beginningOfPreviousTwoDays, end: endingOfPreviousTwoDays } =
    calculateDateRange(date, 2);
  const {
    start: beginningOfPreviousThreeDays,
    end: endingOfPreviousThreeDays,
  } = calculateDateRange(date, 3);

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
  const beginningOfPreviousDayISOString = beginningOfPreviousDay.toISOString();
  const endingOfPreviousDayISOString = endingOfPreviousDay.toISOString();
  const beginningOfPreviousTwoDaysISOString =
    beginningOfPreviousTwoDays.toISOString();
  const endingOfPreviousTwoDaysISOString =
    endingOfPreviousTwoDays.toISOString();
  const beginningOfPreviousThreeDaysISOString =
    beginningOfPreviousThreeDays.toISOString();
  const endingOfPreviousThreeDaysISOString =
    endingOfPreviousThreeDays.toISOString();
  const beginningOfWeekISOString = beginningOfWeek.toISOString();
  const endingOfWeekISOString = endingOfWeek.toISOString();
  const beginningOfMonthISOString = beginningOfMonth.toISOString();
  const endingOfMonthISOString = endingOfMonth.toISOString();

  const todayTasks = await getTasksInRange(beginningOfDay, endingOfDay);
  const PreviousDayTasks = await getTasksInRange(
    beginningOfPreviousDay,
    endingOfPreviousDay
  );
  const PreviousTwoDaysTasks = await getTasksInRange(
    beginningOfPreviousTwoDays,
    endingOfPreviousTwoDays
  );
  const PreviousThreeDaysTasks = await getTasksInRange(
    beginningOfPreviousThreeDays,
    endingOfPreviousThreeDays
  );
  const todayTasksByQueue = todayTasks.reduce(function (obj, v) {
    obj[v.queueName.name] = (obj[v.queueName.name] || 0) + 1;
    return obj;
  }, {});

  const weeklyTasks = await Task.find({
    seniorId: req.user._id,
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
    seniorId: req.user._id,
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

  
  res.render("app/analytics.ejs", {
    pageTitle: "ِAnalytics",
    path: "/analytics",
    pos: req.user.position,
    today: today,
    todayTime: todayTime,
    dailyTasks: {
      todayTasks,
      PreviousDayTasks,
      PreviousTwoDaysTasks,
      PreviousThreeDaysTasks,
    },
    dailyTasksbyQueue: { todayTasksByQueue },
    weeklyTasks: weeklyTasks,
    weeklyTasksbyQueue: weeklyTasksByQueue,
    MonthlyTasks: MonthlyTasks,
    MonthlyTasksByQueue: MonthlyTasksByQueue,
  });
};
