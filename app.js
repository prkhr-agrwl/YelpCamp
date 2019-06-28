
var express 	= require("express"), 
	app     	= express(), 
	bodyparser 	= require("body-parser"),
    mongoose 	= require("mongoose"),
	Campground  = require("./models/campground"),
	Comment     = require("./models/comments"),
	// User        = require("./models/user"),
	seedDB		= require("./seeds");

mongoose.connect("mongodb://localhost/yelpcamp_Data",{ useNewUrlParser: true });
app.use(bodyparser.urlencoded({extended:true}));
app.set("view engine", "ejs");
seedDB();

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
app.post("/campgrounds", function(req, res){
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
app.get("/campgrounds/new", function(req, res){
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


app.get("/campgrounds/:id/comments/new", function(req, res){
	Campground.findById(req.params.id, function(err, campbyID){
		if(err) console.log(err);
		else{
			// console.log(campbyID);
			res.render("comments/new",{campground:campbyID});
		}
	});
});

app.post("/campgrounds/:id/comments/", function(req, res){
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

app.listen(3000, function(){
	console.log("YelpCamp Server Initiated.");
});