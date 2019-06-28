// all the middleware goes here
var middleWareObj = {};
var Campground 	= require("../models/campground");
var Comment    	= require("../models/comment");

middleWareObj.checkCampOwnership = function(req, res, next){
	//check if user is logged in
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err, campbyID){
			if(err) {
				res.redirect("back");
			}
			else{
				//does she own the campground?
				if(campbyID.author.id.equals(req.user._id)){
					next();	
				}
				else{
					res.redirect("back");
				}
			}
		});
	}
	else{
		res.redirect("back");
	}
}

middleWareObj.checkCommentOwnership = function(req, res, next){
	//check if user is logged in
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, commentByID){
			if(err) {
				res.redirect("back");
			}
			else{
				//does she own the comment?
				if(commentByID.author.id.equals(req.user._id)){
					next();	
				}
				else{
					res.redirect("back");
				}
			}
		});
	}
	else{
		res.redirect("back");
	}
}

middleWareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}
 	

module.exports = middleWareObj;