const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const WorksOnSchema = new Schema({
  taskId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Task",
  },
  labelerId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Labeler",
  },
  StartednumObj: { 
    type: Number,
    default: 0, 
  },
  SubmittednumObj: {
    type: Number,
    default: 0,
  },
  startDate: { type: String },
  submittedDate: { type: String },
  },
  { timestamps: true }
);

// module.exports = mongoose.model("WorksOn", WorksOnSchema);

module.exports = mongoose.models.WorksOn || mongoose.model('WorksOn', WorksOnSchema);