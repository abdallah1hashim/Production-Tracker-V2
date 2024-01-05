const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const labelerSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
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
  metiuser: {
    type: Number,
    required: true,
  },
  team: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "QC",
  },
  shift: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  device: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Labeler", labelerSchema);
