const Task = require("../module/Task");
const Labeler = require("../module/Labeler");
const QC = require("../module/qc");
const TL = require("../module/tl");
const STL = require("../module/stl");
const Q = require("../module/queues");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const range = require("../helpers/range");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        "SG.CmpBkglvSPCk2AZKuNKuWg.PzrP3zZCsW2AICy8WrJs_61zb-fWAV8HOtxAT59GC0kCopied",
    },
  })
);

exports.getIndex = (req, res, next) => {
  const isloggedin = req.session.isLoggedin || null;
  res.render("app/index.ejs", {
    pageTitle: "Production Tracker",
    isLoggedin: isloggedin,
  });
};

exports.getCreateLabelers = async (req, res, next) => {
  try {
    const qc = await QC.find();
    const tl = await TL.find();
    const user = req.user;

    res.render("app/create-labeler", {
      qc: qc,
      tl: tl,
      user: user,
      pageTitle: "Create Labeler",
      path: "/create-labeler",
      pos: req.user.position,
      editing: false,
    });
  } catch (err) {
    console.log(err);
  }
};
exports.getEditLabelers = async (req, res, next) => {
  try {
    const editMode = req.query.edit;
    const qc = await QC.find();
    const tl = await TL.find();
    const user = req.user;
    const labelerId = req.params.labelerId;

    if (editMode !== "true") {
      res.redirect("/");
    }

    const labeler = await Labeler.findById(labelerId);

    res.render("app/create-labeler", {
      qc: qc,
      tl: tl,
      user: user,
      pageTitle: "Edit Labeler",
      path: "/create-labeler",
      pos: req.user.position,
      labeler: labeler,
      editing: editMode,
    });
  } catch (err) {
    console.log(err);
  }
};
exports.postCreateLabelers = async (req, res, next) => {
  try {
    const newName = req.body.name;
    const newDevice = req.body.device;
    const newUsername = req.body.username;
    const newEmail = req.body.email;
    const newPssword = req.body.password;
    const hashedPassword = await bcrypt.hash(newPssword, 12);
    const newTeam = req.body.teamId;
    const newTeamLead = req.body.teamlead;
    const newSenior = req.body.senior;
    const position = req.body.position;

    const labeler = await Labeler.findOne({ username: newUsername });

    if (labeler) {
      labeler.name = newName;
      labeler.device = newDevice;
      labeler.username = newUsername;
      labeler.email = newEmail;
      labeler.password = hashedPassword;
      labeler.team = newTeam;
      labeler.location = newTeamLead;
      labeler.seniorId = newSenior;
      labeler.position = position;
      labeler.save();
    }
    if (!labeler) {
      const newLabeler = new Labeler({
        name: newName,
        device: newDevice,
        username: newUsername,
        email: newEmail,
        password: hashedPassword,
        team: newTeam,
        location: newTeamLead,
        seniorId: newSenior,
        position: position,
      });

      await newLabeler.save();
    }
    res.redirect("/");
    // await transporter.sendMail({
    //   to: newEmail,
    //   from: "app@productiontracker.com",
    //   subject: "Account Created",
    //   html: `
    //  <p>Dear [User],</p>
    //  <p>Your account has been successfully created.</p>
    //  <p>Please click the following link to verify your email address and set up your password:</p>
    //  <p>Your Username: ${newUsername}</p>
    //  <p>Your Password: ${newPssword}</p>
    //  <p>You can login anytime now!</p>
    //  <a href="[Verification Link]">Login</a>
    //  <p>If you did not create an account or have any concerns, please contact our support team.</p>
    //  <p>Thank you for choosing our service!</p>
    //  <p>Best regards</p>
    //  `,
    // });
  } catch (error) {
    console.log(error);
  }
};
exports.postEditLabelers = async (req, res, next) => {
  try {
    const labelerId = req.body.labelerId;
    const newName = req.body.name;
    const newDevice = req.body.device;
    const newUsername = req.body.username;
    const newEmail = req.body.email;
    const newPssword = req.body.password;
    const hashedPassword = await bcrypt.hash(newPssword, 12);
    const newTeam = req.body.teamId;
    const newTeamLead = req.body.teamlead;
    const newSenior = req.body.senior;

    const labeler = await Labeler.findById(labelerId);
    if (!labeler) res.redirect("/");

    labeler.name = newName;
    labeler.device = newDevice;
    labeler.username = newUsername;
    labeler.email = newEmail;
    labeler.password = hashedPassword;
    labeler.team = newTeam;
    labeler.location = newTeamLead;
    labeler.seniorId = newSenior;
    labeler.save();
    if (req.user.position === "Quality Control") res.redirect("/qc/labelers");
    if (req.user.position === "Team Lead") res.redirect("/tl/labelers");
  } catch (error) {
    console.log(error);
  }
};

exports.postDeleteLabelers = async (req, res, next) => {
  try {
    const labelerId = req.body.labelerId;

    const labeler = await Labeler.deleteOne({ _id: labelerId });

    if (req.user.position === "Quality Control") res.redirect("/qc/labelers");
  } catch (error) {
    console.log(error);
  }
};

exports.getCreateQc = (req, res, next) => {
  res.render("app/create-QC.ejs", {
    userDetails: req.user,
    queues: obj.queues,
    pageTitle: "Create QC",
    path: "/create-qc",
  });
};
exports.getcreatTL = (req, res, next) => {
  res.render("app/create-TL.ejs", {
    userDetails: req.user,
    queues: obj.queues,
    pageTitle: "Create Team Lead",
    path: "/create-tl",
  });
};
exports.getQueue = async (req, res, next) => {
  const q = await Q.find();
  res.render("app/queue.ejs", {
    q: q,
    pageTitle: "Queues",
    path: "/add-queue",
    pos: req.user.position,
  });
};
exports.postAddQueue = async (req, res, next) => {
  const name = req.body.name;
  const task = await Task.findOne({ _id: "6597cdbef00a2b6650a7f0eb" });

  if (task.queues.includes(name.toLowerCase())) res.redirect("add-queue");
  task.queues.push(name.toLowerCase());
  task.save();

  if (req.user.position === "Quality Control") res.redirect("/qc/home");
};
exports.postِAddQueue = async (req, res, next) => {
  try {
    const name = req.body.name;
    const existingQueue = await Q.findOne({ name: name });

    if (existingQueue) throw new Error("Queue Already Exists");

    const newQueue = new Q({ name: name });
    newQueue.save();
    res.redirect("queue");
  } catch (error) {
    console.log(error);
  }
};
exports.postِEditQueue = async (req, res, next) => {
  try {
    const name = req.body.name;
    const queueId = req.body.queueId;
    const updatedQueue = await Q.findById(queueId);
    updatedQueue.name = name;

    updatedQueue.save();
    res.redirect("queue");
  } catch (error) {
    console.log(error);
  }
};
exports.postDeleteQueue = (req, res, next) => {
  const queueId = req.body.queueId;
  Q.findByIdAndDelete(queueId)
    .then(() => {
      res.redirect("queue");
    })
    .catch((err) => console.log(err));
};
// exports.getCreateSTl = (req, res, next) => {
//       res.render("app/create-TL.ejs", {
//         userDetails: req.user,
//         queues: obj.queues,
//         pageTitle: "Create QC",
//         path: "/create-qc",
//       });
// };
exports.getLabelerDetails = async (req, res, next) => {
  try {
    const date = new Date();
    date.setTime(date.getTime() + range.MILLISECONDS_IN_HOUR);

    const dayOfWeek = date.getDay();

    const { beginningOfDayISOString, endingOfDayISOString } =
      range.calculateDayRange(date);
    const { beginningOfWeekISOString, endingOfWeekISOString } =
      range.calculateWeekRange(date, dayOfWeek);
    const { beginningOfMonthISOString, endingOfMonthISOString } =
      range.calculateMonthRange(date);

    const labelerId = req.params.labelerId;
    const submittedTasksToday = await Task.find({
      labelerId: labelerId,
      submitted: true,
      updatedAt: {
        $gte: beginningOfWeekISOString,
        $lte: endingOfWeekISOString,
      },
    }).populate("queueName");
    const submittedTasksThisWeek = await Task.find({
      labelerId: labelerId,
      submitted: true,
      updatedAt: {
        $gte: beginningOfDayISOString,
        $lte: endingOfDayISOString,
      },
    }).populate("queueName");
    const submittedTasksThisMonth = await Task.find({
      labelerId: labelerId,
      submitted: true,
      updatedAt: {
        $gte: beginningOfMonthISOString,
        $lte: endingOfMonthISOString,
      },
    }).populate("queueName");

    res.render("team/lableler-details.ejs", {
      pageTitle: "Labelers",
      path: "/labelers",
      pos: req.user.position,
      labelerDetails: {
        submittedTasksToday,
        submittedTasksThisWeek,
        submittedTasksThisMonth,
      },
    });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
};
exports.getEditTask = async (req, res, next) => {
  const queues = await Q.find();
  try {
    const taskId = req.params.taskId;
    res.render("team/edit-task.ejs", {
      pageTitle: "Edit-Task",
      path: "/labelers",
      pos: req.user.position,
      queues: queues,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
};
exports.postDeleteTask = async (req, res, next) => {
  try {
    const taskId = req.body.taskId;
    const task = await Task.deleteOne({ _id: taskId });
    res.redirect(req.get("referer"));
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
};
