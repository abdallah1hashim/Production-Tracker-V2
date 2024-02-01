const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const InfoSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  floor: {
    type: String,
    required: true,
  },
  shift_: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
});

// module.exports = mongoose.model("Info", InfoSchema);

module.exports = mongoose.models.Info || mongoose.model('Info', InfoSchema);

