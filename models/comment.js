var mongoose = require("mongoose");

// Comment Schema setup 

var commentSchema = new mongoose.Schema({
	text: String,
	createdAt: { type: Date, default: Date.now },
// 	Associating comment and author
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		}, 
		username: String
	}
});

// Compiling into model that uses commentSchema
var Comment = mongoose.model('Comment', commentSchema);

// Exporting Comment model 
module.exports = Comment;