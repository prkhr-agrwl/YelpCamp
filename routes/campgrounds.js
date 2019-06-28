var express	 	= require("express"),
	router  	= express.Router({mergeParams:true}),
	middleWare  = require("../middleware"),
	Campground 	= require("../models/campground");

//list all camps
router.get("/", function(req, res){
	Campground.find({}, function(err, camp){
		if(err) console.log(err);
		else {
			res.render("campgrounds/index", {campgrounds:camp});
		}
	});
});

//to add a new camp
router.post("/", middleWare.isLoggedIn, function(req, res){
	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description;
	var author = {
		username:req.user.username,
		id:req.user._id
	}
	var newCamp = {name:name, image:image, description:description, author:author};
	//console.log(req.user);
	Campground.create(
		newCamp,function(err,camp){
			if(err){
				console.log(err);
			}
			else{
				//console.log(camp);
				res.redirect("/campgrounds");
			}
	});
	//console.log(name+" "+image);
});

//new camp(form only)
router.get("/new", middleWare.isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});

//show
router.get("/:id", function(req, res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, campbyID){
		if(err) console.log(err);
		else{
			// console.log(campbyID);
			res.render("campgrounds/show", {campground:campbyID});
		}
	})
});

//edit campground(form only)
router.get("/:id/edit", middleWare.checkCampOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, campbyID){
		res.render("campgrounds/edit", {campground:campbyID});
	}); 
});

//update put route
router.put("/:id", middleWare.checkCampOwnership, function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampbyID){
		res.redirect("/campgrounds/"+req.params.id);
	});
});

//delete route
router.delete("/:id", middleWare.checkCampOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		res.redirect("/campgrounds")
	});
});

module.exports = router;