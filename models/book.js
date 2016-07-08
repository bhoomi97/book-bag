var mongoose = require("mongoose");
var bookSchema = new mongoose.Schema({

  title: String,
  postedBy: String,
  contact: String,
  description: String,
  sold: { type:Boolean, default: false },
  uploadDate: { type: Date, default:Date.now }
});

module.exports = mongoose.model("Book", bookSchema);
