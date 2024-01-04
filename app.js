const path = require("path");
const express = require("express");

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("views", "views");

const indexRoutes = require("./routes/index");
const labelerRoutes = require("./routes/labeler");

app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRoutes);

// app.use("/labeler", labelerRoutes);

app.listen(port);
