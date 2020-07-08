// Requiring express and express router
var express= require("express");
var router = express.Router();

// Requiring necessary models
var Campground = require("../models/campground");
var Comment = require("../models/comment");

// Requiring middleware 
var middleware = require("../middleware");


// ===================
// CAMPGROUND ROUTES
// ===================


// INDEX ROUTE - Shows all campgrounds. Get route to Campgrounds page(index template).  

router.get("/", function(req, res){
	
    // Getting all campgrounds from database   	
	Campground.find({}, function(err, allCampgrounds){
		if(err || !allCampgrounds){
			req.flash("error", "Cannot find campgrounds!");
			console.log(err);
		} else { 
            //Render index page(campgrounds page) and send data array to index page.
			res.render("campgrounds/index", { campgrounds: allCampgrounds, page: 'campgrounds'});}
	});
	
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

router.get("/:id", function(req, res){
	
    //Find data based on id 	
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err || !foundCampground){
			req.flash("error", "Campground not found!");
			res.redirect("back");
		} else { 
            // Send data found based on id and send it to show file. Render show file. 			
			res.render("campgrounds/show", { campgrounds: foundCampground }); 
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

router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			req.flash("error", "Cannot remove campground!");
			res.redirect("/campgrounds");
		} else {
			req.flash("success", "Campground deleted!");
			res.redirect("/campgrounds");
		}
	});
});


// Export router
module.exports = router;
