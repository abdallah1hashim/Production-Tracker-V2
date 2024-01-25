const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const StlSchema = new Schema({
    info: [InfoSchema]
});

module.exports = mongoose.model("Stl", StlSchema);