var express 				= require("express"), 
	app     				= express(), 
	bodyparser 				= require("body-parser"),
    mongoose 				= require("mongoose"),
	Campground 		 		= require("./models/campground"),
	passport				= require("passport"),
	localStategy			= require("passport-local"),
	passportLocalMongoose 	= require("passport-local-mongoose");
	Comment     			= require("./models/comment"),
	User        			= require("./models/user"),
	seedDB					= require("./seeds"),
	flash					= require("connect-flash"),
	methodOverride			= require("method-override"),
	expressSession			= require("express-session");


//requiring routes
var commentRoutes 		= require("./routes/comments"),
	campgroudRoutes 	= require("./routes/campgrounds"),
	indexRoutes 		= require("./routes/index");

mongoose.connect("mongodb://localhost/yelpcamp_Data",{ useNewUrlParser: true });		
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"))
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());
//console.log(__dirname);
//seed the database
//seedDB();

//PASSPORT CONFIG
app.use(expressSession({
	secret:"loner",
	resave:false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser	= req.user;
	res.locals.error		= req.flash("error");
	res.locals.success		= req.flash("success");
	next();
});

app.use("/campgrounds", campgroudRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/", indexRoutes);
 
app.listen(3000, function(){
	console.log("YelpCamp Server Initiated.");
});