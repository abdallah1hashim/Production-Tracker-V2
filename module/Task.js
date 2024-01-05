const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TaskSchema = new Schema(
  {
    id: { type: Number, required: true },
    queueName: { type: String },
    StartednumObj: { type: Number },
    SubmittednumObj: { type: Number },
    startDate: { type: String },
    submittedDate: { type: String },
    labelerId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Labeler",
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", TaskSchema);
