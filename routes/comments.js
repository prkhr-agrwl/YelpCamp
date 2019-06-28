var express	 	= require("express"),
	router  	= express.Router({mergeParams:true}),
	Campground 	= require("../models/campground"),
	Comment    	= require("../models/comments");

//new comment(form only)
router.get("/new", isLoggedIn	,function(req, res){
	Campground.findById(req.params.id, function(err, campbyID){
		if(err) console.log(err);
		else{
			// console.log(campbyID);
			res.render("comments/new",{campground:campbyID});
		}
	});
});

//adds new comment
router.post("/", isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campbyID){
		if(err) console.log(err);
		else{
			//console.log(req.user);
			// console.log(campbyID);
			Comment.create(req.body.comment, function(err, comment){
				if(err) console.log(err);
				else{
					//add username and id to comment db
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					campbyID.comments.push(comment);
					campbyID.save();
					//console.log(comment);
					res.redirect("/campgrounds/"+req.params.id);
				}
			})
		}
	});
});

//check if loggedIn
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login")
}


module.exports = router;