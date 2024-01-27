const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TlSchema = new Schema({
    info: {
        type: Schema.Types.ObjectId,
        ref:'Info',
      },
    stlID: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Stl",
    }
  
});

// module.exports = mongoose.model("Tl", TlSchema);

module.exports = mongoose.models.Tl || mongoose.model('Tl', TlSchema);