var mongoose = require("mongoose");
var bookSchema = new mongoose.Schema({

  title: String,
  image: String,
  postedBy: String,
  contact: String,
  description: String,
  year: Number,
  user: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  },
  sold: { type:Boolean, default: false },
  uploadDate: { type: Date, default:Date.now }
});

module.exports = mongoose.model("Book", bookSchema);
