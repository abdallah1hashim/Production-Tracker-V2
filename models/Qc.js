const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const QcSchema = new Schema({
    info: [InfoSchema],
    tlId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Tl",
    },
  
});

module.exports = mongoose.model("Qc", QcSchema);
