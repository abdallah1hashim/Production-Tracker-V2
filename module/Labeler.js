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
  team: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "QC",
  },
  seniorId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "STL",
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
  position: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Labeler", labelerSchema);
