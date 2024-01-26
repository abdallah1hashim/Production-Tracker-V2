const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const LabelerSchema = new Schema({
  info: [InfoSchema],
  username: {
    type: String,
    required: true,
  },
  qcId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Qc",
  },
  device: {
    type: Number,
    required: true,
  },

});


module.exports = mongoose.model("Labeler", LabelerSchema);