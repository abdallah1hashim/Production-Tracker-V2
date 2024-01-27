const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const StlSchema = new Schema({
  info: {
    type:Schema.Types.ObjectId,
    ref:'Info',
  },
});

// module.exports = mongoose.model("Stl", StlSchema);

module.exports = mongoose.models.Stl || mongoose.model('Stl', StlSchema);