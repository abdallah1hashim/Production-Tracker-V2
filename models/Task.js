const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TaskSchema = new Schema({
  id: { type: String },
  status: { type: String },
  queueId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Queue",
  }
  
},
  { timestamps: true }
);

// module.exports = mongoose.model("Task", TaskSchema);

module.exports = mongoose.models.Task || mongoose.model('Task', TaskSchema);