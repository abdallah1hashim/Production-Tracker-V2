const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const labelerSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: Number,
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
    type: Schema.Types.ObjectId,
    required: true,
    ref: "TL",
  },
  device: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Labeler", labelerSchema);
