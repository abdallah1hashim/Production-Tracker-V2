const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");


const app = express();
const port = 3000;

// Add middleware for parsing JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const Labeler = require("./module/Labeler");
const QC = require("./module/qc");
const TL = require("./module/tl");
const STL = require("./module/stl");

app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));
// app.use("/labeler", express.static(path.join(__dirname, "public")));
// app.use("/qc", express.static(path.join(__dirname, "public")));
// app.use("/tl", express.static(path.join(__dirname, "public")));
// app.use("/stl", express.static(path.join(__dirname, "public")));
// app.use(
//   "/css",
//   express.static(path.join(__dirname, "node_modules/bootstrap/dist/css"))
// );
// app.use(
//   "/js",
//   express.static(path.join(__dirname, "node_modules/bootstrap/dist/js"))
// );
// app.use(
//   "/js",
//   express.static(path.join(__dirname, "node_modules/jquery/dist"))
// );

app.use(async (req, res, next) => {
  try {
    const findUserByUsernamePosition = async (username) => {
      return await Labeler.findOne({ username: username });
    };
    const findQCByUsernamePosition = async (username) => {
      return await QC.findOne({ username: username })
        .populate({ path: "seniorId", select: "name shiftName" })
        .populate({ path: "teamLeadId", select: "name locationName" })
        .exec();
    };
    const findTeamLeadByUsernamePosition = async (username) => {
      return await TL.findOne({ username: username });
    };
    const findSTLByUsernamePosition = async (username) => {
      return await STL.findOne({ username: username });
    };

    // let user = await findUserByUsernamePosition("me555555");
    let user = await findQCByUsernamePosition("me555555");
    // (await findTeamLeadByUsernamePosition("me555555")) ||
    // (await findSTLByUsernamePosition("me555555"));

    if (user) {
      req.user = user;
      return;
    }
  } catch (err) {
    console.error(err);
  } finally {
    next();
  }
});

const indexRoutes = require("./routes/index");
const authRoutes = require("./routes/auth");
const labelerRoutes = require("./routes/labeler");
const qcRoutes = require("./routes/qc");
const tlRoutes = require("./routes/tl");
const stlRoutes = require("./routes/stl");
const errorController = require("./controllers/error");

app.use("/", indexRoutes);
app.use("/", authRoutes);
app.use("/labeler", labelerRoutes);
app.use("/qc", qcRoutes);
app.use("/tl", tlRoutes);
app.use("/stl", stlRoutes);
app.use(errorController.get404);

// app.use("/labeler", labelerRoutes);
mongoose
  .connect(
    `mongodb+srv://Inulla:%24M%40%40g%23ME410@nullla.fupqou2.mongodb.net/productionTracker`
  )
  .then(() => {
    // Labeler.findOne().then((user) => {
    //   if (!user) {
    //     const labeler = new Labeler({
    //       name: "Abdullah Essam Fathy",
    //       shift: "Overnight",
    //       team: "659848fbe78289bb15339b6d",
    //       location: "6599c6a92338f4d1b5bc2b96",
    //       username: "me555555",
    //       email: "abdollahizzy41@gmail.com",
    //       password: "4102001336",
    //       seniorId: "6599c669444cd519f97282c2",
    //       device: 1,
    //       tasks: [],
    //       position: "Labeler",
    //     });
    //     labeler.save();
    //   }
    // });
    QC.findOne().then((user) => {
      if (!user) {
        const qc = new QC({
          name: "QC 1",
          shift: "Overnight",
          username: "me555555",
          email: "1@gmail.com",
          password: "4102001336",
          teamLeadId: "6598e93f9792f29af783b9a3",
          seniorId: "6599c669444cd519f97282c2",
          position: "Quality Control",
        });
        qc.save();
      }
    });
    // Tl.findOne().then((user) => {
    //   if (!user) {
    //     const tl = new Tl({
    //       name: "Abdullah Essam Fathy",
    //       shift: "Overnight",
    //       username: "me555555",
    //       email: "abdollahizzy41@gmail.com",
    //       password: "4102001336",
    //       locationName: "floor4",
    //       position: "Team Lead",
    //     });
    //     tl.save();
    //   }
    // });
    // STL.findOne().then((user) => {
    //   if (!user) {
    //     const stl = new STL({
    //       name: "Mahmoud Abdel-Tawab",
    //       shiftName: "OverNight",
    //       username: "me555555",
    //       email: "abdollahizzy41@gmail.com",
    //       password: "123456",
    //       position: "Senior Team Lead",
    //     });
    //     stl.save();
    //   }
    // });
    app.listen(port);
  })
  .catch((err) => {
    console.log(err);
  });
