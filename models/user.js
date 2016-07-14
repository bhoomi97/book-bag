var mongoose = require("mongoose");
// Passport local plugin
var passportLocalMongoose = require("passport-local-mongoose");


var userSchema = new mongoose.Schema({
  username: String,
  password: String
});
userSchema.plugin(passportLocalMongoose, {usernameLowerCase: true});

// export
module.exports = mongoose.model("User", userSchema);
