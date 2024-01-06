const path = require("path");
const express = require("express");
const mongoose = require("mongoose");

const app = express();
const port = 3000;

// Add middleware for parsing JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const Labeler = require("./module/Labeler");
const Qc = require("./module/qc");
const Tl = require("./module/tl");
const STL = require("./module/stl");

app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.static(path.join(__dirname, "public")));
app.use("/labeler", express.static(path.join(__dirname, "public")));
app.use("/qc", express.static(path.join(__dirname, "public")));
app.use("/tl", express.static(path.join(__dirname, "public")));
app.use(
  "/css",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/css"))
);
app.use(
  "/js",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/js"))
);
app.use(
  "/js",
  express.static(path.join(__dirname, "node_modules/jquery/dist"))
);

app.use((req, res, next) => {
  // Labeler.findOne({ username: "me555555" })
  //   .populate({ path: "team", select: "name" })
  //   .exec()
  //   .then((user) => {
  //     req.user = user;
  //     next();
  //   })
  //   .catch((err) => console.log(err));
  // Qc.findOne({ username: "me555555" })
  //   .then((user) => {
  //     req.user = user;
  //     next();
  //   })
  //   .catch((err) => console.log(err));
  Tl.findOne({ username: "me555555" })
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

const indexRoutes = require("./routes/index");
const labelerRoutes = require("./routes/labeler");
const qcRoutes = require("./routes/qc");
const tlRoutes = require("./routes/tl");

app.use("/", indexRoutes);
app.use("/labeler", labelerRoutes);
app.use("/qc", qcRoutes);
app.use("/tl", tlRoutes);

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
    //       username: "me555555",
    //       email: "abdollahizzy41@gmail.com",
    //       password: "4102001336",
    //       metiuser: 555555,
    //       location: "floor4",
    //       device: 1,
    //       tasks: [],
    //     });
    //     labeler.save();
    //   }
    // });
    // Qc.findOne().then((user) => {
    //   if (!user) {
    //     const qc = new Qc({
    //       name: "Abdullah Essam Fathy",
    //       shift: "Overnight",
    //       username: "me555555",
    //       email: "abdollahizzy41@gmail.com",
    //       password: "4102001336",
    //       teamLeadId: "6598e93f9792f29af783b9a3",
    //     });
    //     qc.save();
    //   }
    // });
    Tl.findOne().then((user) => {
      if (!user) {
        const tl = new Tl({
          name: "Abdullah Essam Fathy",
          shift: "Overnight",
          username: "me555555",
          email: "abdollahizzy41@gmail.com",
          password: "4102001336",
          locationName: "floor4",
          position: "Team Lead",
        });
        tl.save();
      }
    });
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
