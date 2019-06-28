var express	 	= require("express"),
	router  	= express.Router({mergeParams:true}),
	Comment    	= require("../models/comment"),
	User   		= require("../models/user"),
	passport	= require("passport");

//landing
router.get("/",function(req,res){
	res.redirect("/campgrounds");
});

//AUTH ROUTES

//sign up(form only)
router.get("/register", function(req, res){
	res.render("auth/register");
});

//signs a new user up
router.post("/register", function(req, res){
	var newUser = new User({username:req.body.username});
	User.register(newUser, req.body.password,function(err, newUser){
		if(err) {
			req.flash("error", err.message);
			console.log(err);
			return res.redirect("/register");
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "I see you're a man of culture as well.");
			res.redirect("/campgrounds");
		});
	});
});

//login(form only)
router.get("/login", function(req, res){
	res.render("auth/login");
}); 

//logs user in
router.post("/login", passport.authenticate("local",
	{
		successRedirect:"/campgrounds",
		failureRedirect:"/login",
}));

//logout
router.get("/logout",function(req, res){
	req.logout();
	req.flash("success", "Here, let me show you out.");
	res.redirect("/campgrounds");
});

module.exports = router;