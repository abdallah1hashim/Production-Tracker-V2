const mongoose = require("mongoose");


const Schema = mongoose.Schema;

const LabelerSchema = new Schema({
  info: {
    type: Schema.Types.ObjectId,
    ref:'Info',
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


// module.exports = mongoose.model("Labeler", LabelerSchema);

module.exports = mongoose.models.Labeler || mongoose.model('Labeler', LabelerSchema);