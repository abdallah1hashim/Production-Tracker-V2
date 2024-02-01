const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const QueueSchema = new Schema({
  name: { 
    type: String,
    required: true,
  },
    
  },
  { timestamps: true }
);

// module.exports = mongoose.model("Queue", QueueSchema);

module.exports = mongoose.models.Queue || mongoose.model('Queue', QueueSchema);