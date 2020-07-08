// Requiring express and express router
var express= require("express");
var router = express.Router({mergeParams: true});

// Requiring necessary models
var Campground = require("../models/campground");
var Comment = require("../models/comment");

// Requiring middleware 
var middleware = require("../middleware");

// ================
// COMMENT ROUTES
// ================


// NEW ROUTE - Renders form to add new comment. Get route to comment form(new template). 

router.get("/new", middleware.isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, foundData){
		if(err || !foundData){
			req.flash("error", "Cannot find campground!");
			res.redirect("back");
			console.log(err);
		} else {
			res.render("comments/new",{campground: foundData});
		}
	});
	
});

// CREATE ROUTE - Add comment to database. Post route to add new comment to database. 

router.post("/", middleware.isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, foundData){
		if(err || !foundData){
			req.flash("error","Comment not added!");
			res.redirect("/campgrounds")
		} else {
			Comment.create(req.body.comment, function(err, newComment){
				if(err || !newComment){
					req.flash("error", "Something went wrong!");
				} else {
// 					Add user id and username to author and save. 
					newComment.author.id = req.user._id;
					newComment.author.username = req.user.username;
					newComment.save();
					
// 					Push new comment to campground and save. 
					foundData.comments.push(newComment);
					foundData.save();
					req.flash("success", "Successfully added comment!");
					res.redirect("/campgrounds/" + req.params.id);
				}
			});
			
			
		}
	})
	
});

// EDIT ROUTE 

router.get("/:comment_id/edit", middleware.checkCommentOwnership ,function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err || !foundCampground){
			req.flash("error", "Campground not found!");
			return res.redirect("back"); 
		}
	
	    Comment.findById(req.params.comment_id, function(err, foundComment){
	    	if(err || !foundComment){
				req.flash("error", "Comment not found!");
	    		res.redirect("back")
	    	} else {
	    		res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
	    	}
		});
	});
});

// UPDATE ROUTE 

router.put("/:comment_id", middleware.checkCommentOwnership,function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err || !updatedComment){
			req.flash("error", "Cannot update comment!");
			res.redirect("back");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
})

// DESTROY ROUTE

router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err, deletedComment){
		if(err){
			res.redirect("back");
		} else {
			req.flash("success", "Comment deleted!");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});



// Export router
module.exports = router;