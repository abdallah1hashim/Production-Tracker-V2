const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const tlSchema = new Schema({
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
  locationName: {
    type: String,
    required: true,
  },
  seniorId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "STL",
  },
  position: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("TL", tlSchema);
