const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const StartTaskSchema = new Schema({
  id: { type: Number, required: true },
  queueName: { type: String, required: true },
  numObj: { type: Number, required: true },
  date: { type: String },
  labelerId: { type: Schema.Types.ObjectId, required: true, ref: "Labeler" },
});

module.exports = mongoose.model("StartTask", StartTaskSchema);
