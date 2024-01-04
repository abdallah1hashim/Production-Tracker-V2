const path = require("path");
const express = require("express");

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.static(path.join(__dirname, "public")));
app.use("/labeler", express.static(path.join(__dirname, "public")));
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

const indexRoutes = require("./routes/index");
const labelerRoutes = require("./routes/labeler");

app.use("/", indexRoutes);
app.use("/labeler", labelerRoutes);

// app.use("/labeler", labelerRoutes);

app.listen(port);
