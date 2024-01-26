const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const InfoSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  floor: {
    type: String,
    required: true,
  },
  shift: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Info", InfoSchema);