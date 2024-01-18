const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const flash = require("connect-flash");

const MONGODBURI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@nullla.fupqou2.mongodb.net/${process.env.MONGO_DB}`;

const app = express();
const port = 3000;
const store = new MongoDBStore({
  uri: MONGODBURI,
  collection: "sessions",
});

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
app.use(
  session({
    secret: "myappsecret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use(flash());

app.use(async (req, res, next) => {
  try {
    console.log(req.session.user);
    const position = req.session.user.position || null;
    if (position === "Labeler") {
      const user = await Labeler.findById(req.session.user._id);
      req.user = user;
    }
    if (position === "Quality Control") {
      const user = await QC.findById(req.session.user._id)
        .populate("teamLeadId")
        .populate("seniorId");
      req.user = user;
    }
    if (position === "Team Lead") {
      const user = await TL.findById(req.session.user._id).populate("seniorId");
      req.user = user;
    }
    if (position === "Senior Team Lead") {
      const user = await STL.findById(req.session.user._id);
      req.user = user;
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
  .connect(MONGODBURI)
  .then(() => {
    app.listen(process.env.PORT || port);
  })
  .catch((err) => {
    console.log(err);
  });
