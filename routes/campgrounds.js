// Requiring express and express router
var express= require("express");
var router = express.Router();

// Requiring necessary models
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var Review = require("../models/review");

// Requiring middleware 
var middleware = require("../middleware");


// ===================
// CAMPGROUND ROUTES
// ===================


// INDEX ROUTE - Shows all campgrounds. Get route to Campgrounds page(index template).  

router.get("/", function(req, res){
	var perPage = 8;
    var pageQuery = parseInt(req.query.page);
    var pageNumber = pageQuery ? pageQuery : 1;
	if(req.query.search){
	const regex = new RegExp(escapeRegex(req.query.search),'gi');
	Campground.find({name: regex}, function(err, allCampgrounds){
		if(err || !allCampgrounds){
			req.flash("error", "Cannot find campgrounds!");
			console.log(err);
		} else { 
            //Render index page(campgrounds page) and send data array to index page.
			if(allCampgrounds.length < 1){
				req.flash("error", "The campground you searched for is not available!");
				res.redirect("back");
			}
				res.render("campgrounds/index", { campground: allCampgrounds, page: 'campgrounds'});}
			
	});		
	} else {
    // Getting all campgrounds from database   	
	Campground.find({}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function(err, allCampgrounds){
		Campground.countDocuments().exec(function (err, count) {
		if(err || !allCampgrounds){
			req.flash("error", "Cannot find campgrounds!");
			console.log(err);
		} else { 
            //Render index page(campgrounds page) and send data array to index page.
			res.render("campgrounds/index", { campground: allCampgrounds,
											  page: 'campgrounds',
											  current: pageNumber,
											  pages: Math.ceil(count / perPage) });
		}

	});
	});
   }
});


// CREATE ROUTE - Add new campground to database. Post route to create new campground.  

router.post("/", middleware.isLoggedIn, function(req, res){
	
    //Getting data from form page.  	
	var name = req.body.name;
	var price = req.body.price;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newCampground = {name: name, price: price, image: image, description: desc, author: author };
	
    //Adding new data to database. 	
	Campground.create(newCampground, function(err, newlycreated){
		if(err || !newlycreated){
			req.flash("error", "Cannot create campground!");
			res.redirect("back");
		} else {  
            // Redirect to campgrounds page with new data 
			req.flash("success", "New campground added!");
			res.redirect("/campgrounds"); 
		}
	}); 
	
});

// NEW ROUTE - Show form to create new route. Get route to new campground form(new template).

router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});



// SHOW ROUTE - Shows more info of a campground. Get route to show page(show template).

// SHOW - shows more info about one campground
router.get("/:id", function (req, res) {
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").populate({
        path: "reviews",
        options: {sort: {createdAt: -1}}
    }).exec(function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});


// EDIT ROUTE 

router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
		Campground.findById(req.params.id,function(err, foundCampground){
			if(err || !foundCampground){
				req.flash("error", "Campground not found!");
				res.redirect("back");
			}
			res.render("campgrounds/edit",{campground: foundCampground});
		});
});

// UPDATE ROUTE

router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	    delete req.body.campground.rating;
    // find and update the correct campground
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, foundData){
		if(err || !foundData){
			req.flash("error", "Cannot update campground!");
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
});

// DESTROY ROUTE

// DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            // deletes all comments associated with the campground
            Comment.deleteMany({"_id": {$in: campground.comments}}, function (err) {
                if (err) {
                    console.log(err);
                    return res.redirect("/campgrounds");
                }
                // deletes all reviews associated with the campground
                Review.deleteMany({"_id": {$in: campground.reviews}}, function (err) {
                    if (err) {
                        console.log(err);
                        return res.redirect("/campgrounds");
                    }
                    //  delete the campground
                    campground.deleteOne();
                    req.flash("success", "Campground deleted successfully!");
                    res.redirect("/campgrounds");
                });
            });
        }
    });
});

function escapeRegex(text){
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&");
}

// Export router
module.exports = router;
