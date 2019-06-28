
var express 				= require("express"), 
	app     				= express(), 
	bodyparser 				= require("body-parser"),
    mongoose 				= require("mongoose"),
	Campground 		 		= require("./models/campground"),
	passport				= require("passport"),
	localStategy			= require("passport-local"),
	passportLocalMongoose 	= require("passport-local-mongoose");
	Comment     			= require("./models/comments"),
	User        			= require("./models/user"),
	seedDB					= require("./seeds"),
	expressSession			= require("express-session");

mongoose.connect("mongodb://localhost/yelpcamp_Data",{ useNewUrlParser: true });
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"))
app.set("view engine", "ejs");
console.log(__dirname);
seedDB();

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
	res.locals.currentUser = req.user;
	next();
});

// Campground.create(
// 	{
// 		name:"Granite Hill",
// 		image:"https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80.jpg",
// 		description: "This is a huge Granite Hill. With Granite."
// 	},function(err,camp){
// 		if(err){
// 			console.log(err);
// 		}
// 		else{
// 			console.log(camp);
// 		}
// });

//landing
app.get("/",function(req,res){
	res.redirect("/campgrounds");
});

//list all camps
app.get("/campgrounds", function(req, res){
	Campground.find({}, function(err, camp){
		if(err) console.log(err);
		else {
			res.render("campgrounds/index", {campgrounds:camp});
		}
	});
});

//to add a new camp
app.post("/campgrounds", isLoggedIn, function(req, res){
	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description;
	var newCamp = {name:name, image:image, description:description};
	
	Campground.create(
	newCamp,function(err,camp){
		if(err){
			console.log(err);
		}
		else{
			res.redirect("/campgrounds");
		}
	});
	//console.log(name+" "+image);
});

//new camp(form only)
app.get("/campgrounds/new", isLoggedIn,function(req, res){
	res.render("campgrounds/new");
});

//show
app.get("/campgrounds/:id", function(req, res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, campbyID){
		if(err) console.log(err);
		else{
			// console.log(campbyID);
			res.render("campgrounds/show",{campground:campbyID});
		}
	})
});


//========COMMENT ROUTES=======//

//new comment(form only)
app.get("/campgrounds/:id/comments/new", isLoggedIn	,function(req, res){
	Campground.findById(req.params.id, function(err, campbyID){
		if(err) console.log(err);
		else{
			// console.log(campbyID);
			res.render("comments/new",{campground:campbyID});
		}
	});
});

//adds new comment
app.post("/campgrounds/:id/comments/", isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campbyID){
		if(err) console.log(err);
		else{
			// console.log(campbyID);
			Comment.create(req.body.comment, function(err, comment){
				if(err) console.log(err);
				else{
					campbyID.comments.push(comment);
					campbyID.save();
					res.redirect("/campgrounds/"+req.params.id);
				}
			})
		}
	});
});


//AUTH ROUTES

//sign up(form only)
app.get("/register", function(req, res){
	res.render("auth/register");
});

//signs a new user up
app.post("/register", function(req, res){
	var newUser = new User({username:req.body.username});
	User.register(newUser, req.body.password,function(err, newUser){
		if(err) {
			console.log(err);
			return res.redirect("/register");
		}
		passport.authenticate("local")(req, res, function(){
			res.redirect("/campgrounds");
		});
	});
});

//login(form only)
app.get("/login", function(req, res){
	res.render("auth/login");
}); 

//logs user in
app.post("/login", passport.authenticate("local",
	{
		successRedirect:"/campgrounds",
		failureRedirect:"/login",
}));

//logout
app.get("/logout",function(req, res){
	req.logout();
	res.redirect("/campgrounds");
});

//check if loggedIn
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login")
}

app.listen(3000, function(){
	console.log("YelpCamp Server Initiated.");
});