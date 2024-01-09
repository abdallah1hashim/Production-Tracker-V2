const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TaskSchema = new Schema(
  {
    id: { type: Number },
    queueName: { type: String },
    StartednumObj: { type: Number },
    SubmittednumObj: { type: Number },
    startDate: { type: String },
    submittedDate: { type: String },
    labelerId: {
      type: Schema.Types.ObjectId,
      ref: "Labeler",
    },
    teamId: {
      type: Schema.Types.ObjectId,
      ref: "QC",
    },
    teamLeadId: {
      type: Schema.Types.ObjectId,
      ref: "TL",
    },
    seniorId: {
      type: Schema.Types.ObjectId,
      ref: "STL",
    },
    submitted: { type: Boolean },
    skipped: { type: Boolean },
    labelersWorkedOn: [
      {
        labelerId: {
          type: Schema.Types.ObjectId,
          ref: "Labeler",
        },
      },
    ],
    queues: [],
    tasks: [],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", TaskSchema);
