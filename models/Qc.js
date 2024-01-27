const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const QcSchema = new Schema({
    info: {
        type:Schema.Types.ObjectId,
        ref:'Info',
      },
    tlId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Tl",
    },
  
});

// module.exports = mongoose.model("Qc", QcSchema);

module.exports = mongoose.models.Qc || mongoose.model('Qc', QcSchema);