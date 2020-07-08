// Requiring express and express router
var express= require("express");
var router = express.Router();

// Requiring passport
var passport = require("passport");

// Requiring necessary models
var User = require("../models/user");


// LANDING PAGE ROUTE
router.get("/", function(req, res){
	res.render("landing");
});

// =======================
// AUTHENTICATION ROUTES
// =======================


// Sign up routes ====================================

// Register form route

router.get("/register", function(req, res){
	res.render("register", {page: 'register'});
})

// Post route to handle signup logic

router.post("/register",function(req, res){
	var newUser = new User({ username: req.body.username })
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			req.flash("error", err.message);
			return res.render("register");
		}
		
        // Authenticate and log user in 		 
        // Authentication done after user is created
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome to YelpCamp " + user.username + " !");
			res.redirect("/campgrounds");
		});
	});
});

// Login routes ===============================

// Login form route

router.get("/login",function(req, res){
	res.render("login", { page: 'login'});
});

// Post route to handle login logic 
// User is presumed to exist, hence we use passport.authenticate as middleware.
router.post("/login", passport.authenticate("local", {
	successRedirect: "/campgrounds",
	failureRedirect: "/login",
	failureFlash: "Invalid username or password!",
	successFlash: "Successfully logged in!"
}) ,function(req, res){
	
});


// Logout routes ==========================


router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Logged you out!");
	res.redirect("/campgrounds");
});

// * route

router.get("*", function(req, res){
	req.flash("error","This page does not exist");
	res.redirect("back");
});

// Exporting router
module.exports = router;