const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TlSchema = new Schema({
    info: [InfoSchema],
    stlID: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Stl",
    }
  
});

module.exports = mongoose.model("Tl", TlSchema);