var mongoose = require("mongoose");
var Comment = require("./comment");
var Review = require("./review");
// Campground Schema setup

var campgroundSchema = new mongoose.Schema({
	name: String,
	price: String,
	image: String,
	description: String,
	createdAt: { type: Date, default: Date.now},
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
	],
	reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    rating: {
        type: Number,
        default: 0
    }
});

// Compiling into a model that uses campgroundSchema 
var Campground = mongoose.model("Campground",campgroundSchema);

// Export Campground model
module.exports = Campground;

