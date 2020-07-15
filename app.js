// Requiring packages

var express = require("express"), 
	app = express(), 
	bodyParser = require("body-parser"), 
	mongoose = require("mongoose"),
	flash = require("connect-flash"),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	methodOverride = require("method-override"),
    Campground = require("./models/campground"),
	Comment = require("./models/comment"),
	User = require("./models/user"),
	seedDB = require("./seeds");

// Requiring routes

var campgroundRoutes = require("./routes/campgrounds"),
	commentRoutes = require("./routes/comments"),
	indexRoutes = require("./routes/index");


// Creating and using yelp_camp database 

var url = process.env.DATABASEURL || "mongodb://localhost:27017/yelp_camp_v12"
mongoose.set('useUnifiedTopology', true);
mongoose.connect(url,{ useNewUrlParser: true });
mongoose.set('useFindAndModify', false);


// Using body-parser & setting ejs 

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// Telling express to use public directory

app.use(express.static(__dirname + "/public"));

// Telling express to use method override

app.use(methodOverride("_method"));



//  Seed the database

// seedDB();

app.locals.moment = require('moment');

// Passport configuration

app.use(require("express-session")({
	secret: "My first project!!!",
	resave: false,
	saveUninitialized: false
}));

// Telling express to use connect-flash
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Middleware for all routes

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
})

// Telling express to use routes

app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/",indexRoutes);

// Listen method to start server


app.listen(process.env.PORT || 3000, process.env.IP, function(){
	console.log("The YelpCamp has started!");
});