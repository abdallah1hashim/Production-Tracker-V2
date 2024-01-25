const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const QueueSchema = new Schema({
  id: { 
    type: Number,
    unique: true
  },
  name: { 
    type: String,
    required: true,
  },
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("Queue", QueueSchema);