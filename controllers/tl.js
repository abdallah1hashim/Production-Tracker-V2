const Task = require("../module/Task");
const Labeler = require("../module/Labeler");
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
exports.getStartedTask = (req, res, next) => {
  Task.find({ teamLeadId: req.user._id, submitted: false, skipped: false })
    .populate("labelerId")
    .then((tasks) => {
      const sortedTasks = tasks.sort(
        (a, b) => a.labelerId.device - b.labelerId.device
      );
      res.render("team/StartedTasks.ejs", {
        tasks: sortedTasks,
        pageTitle: "Started Tasks",
        path: "/started-tasks",
        pos: req.user.position,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getLabelers = (req, res, next) => {
  Labeler.find({ location: req.user._id })
    .then((labelers) => {
      res.render("team/labelers.ejs", {
        labelers: labelers,
        pageTitle: "Labelers",
        path: "/labelers",
        pos: req.user.position,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
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
