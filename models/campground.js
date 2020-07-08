var mongoose = require("mongoose");

// Campground Schema setup

var campgroundSchema = new mongoose.Schema({
	name: String,
	price: String,
	image: String,
	description: String,
// 	Associating campground and author
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		
		username: String
	},
// 	Associating campground and comments 
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	]
});

// Compiling into a model that uses campgroundSchema 
var Campground = mongoose.model("Campground",campgroundSchema);

// Export Campground model
module.exports = Campground;

