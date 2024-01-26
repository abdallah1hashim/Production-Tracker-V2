const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TaskSchema = new Schema({
  id: { 
    type: Number,
    unique: true
  },
  submitted: { type: Boolean },
  skipped: { type: Boolean },
  queueId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Queue",
  }
  
},
  { timestamps: true }
);

module.exports = mongoose.model("Task", TaskSchema);
