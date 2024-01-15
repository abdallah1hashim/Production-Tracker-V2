const Task = require("../module/Task");
const Labeler = require("../module/Labeler");
const QC = require("../module/qc");
const TL = require("../module/tl");
const STL = require("../module/stl");
const Q = require("../module/queues");

exports.getIndex = (req, res, next) => {
  res.render("app/index.ejs", { pageTitle: "Production Tracker" });
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
      pos: "qc",
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
      pos: "qc",
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
      labeler.password = newPssword;
      labeler.team = newTeam;
      labeler.location = newTeamLead;
      labeler.seniorId = newSenior;
      labeler.position = position;
      labeler.save();
    }
    const newLabeler = new Labeler({
      name: newName,
      device: newDevice,
      username: newUsername,
      email: newEmail,
      password: newPssword,
      team: newTeam,
      location: newTeamLead,
      seniorId: newSenior,
      position: position,
    });

    newLabeler.save();
    if (req.user.position === "Quality Control") res.redirect("/qc/home");
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
    const newTeam = req.body.teamId;
    const newTeamLead = req.body.teamlead;
    const newSenior = req.body.senior;

    const labeler = await Labeler.findById(labelerId);
    if (!labeler) res.redirect("/");

    labeler.name = newName;
    labeler.device = newDevice;
    labeler.username = newUsername;
    labeler.email = newEmail;
    labeler.password = newPssword;
    labeler.team = newTeam;
    labeler.location = newTeamLead;
    labeler.seniorId = newSenior;
    labeler.save();
    if (req.user.position === "Quality Control") res.redirect("/qc/labelers");
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
    pos: "qc",
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
