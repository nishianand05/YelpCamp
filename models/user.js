var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

// User Schema setup
var userSchema = new mongoose.Schema({
	username: String,
	password: String
});

// Plugging in passportLocalMongoose methods to userSchema
userSchema.plugin(passportLocalMongoose);

// Exporting User model
module.exports = mongoose.model('User', userSchema);