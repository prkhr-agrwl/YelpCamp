var express	 	= require("express"),
	router  	= express.Router({mergeParams:true}),
	Campground 	= require("../models/campground"),
	middleWare  = require("../middleware"),
	Comment    	= require("../models/comment");

//new comment(form only)
router.get("/new", middleWare.isLoggedIn,function(req, res){
	Campground.findById(req.params.id, function(err, campbyID){
		if(err) console.log(err);
		else{
			// console.log(campbyID);
			res.render("comments/new",{campground:campbyID});
		}
	});
});

//adds new comment
router.post("/", middleWare.isLoggedIn, function(req, res){
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

//edit form
router.get("/:comment_id/edit", middleWare.checkCommentOwnership, function(req, res){
	Comment.findById(req.params.comment_id, function(err, comment){
		res.render("comments/edit", {campground_id:req.params.id, comment:comment});		
	});
});

//update put route
router.put("/:comment_id/", middleWare.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, comment){
		res.redirect("/campgrounds/"+req.params.id);		
	});
});

//comment destroy route
router.delete("/:comment_id", middleWare.checkCommentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		res.redirect("/campgrounds/"+req.params.id);		
	});
});

module.exports = router;