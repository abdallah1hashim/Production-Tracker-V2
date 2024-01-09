const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const QueueSchema = new Schema({
  name: { type: String },
});

module.exports = mongoose.model("Q", QueueSchema);
