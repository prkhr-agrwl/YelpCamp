var express = require("express");
var app= express();
var bodyparser = require("body-parser");

app.use(bodyparser.urlencoded({extended:true}));
app.set("view engine", "ejs");

var campgrounds = [
		{name:"Salmon Creek", image:"https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80.jpg"},
		{name:"Granite Hill", image:"https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80.jpg"},
		{name:"Ventura Ranch", image:"https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80.jpg"},
		{name:"Lake Rudolph", image:"https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80.jpg"},
		{name:"LakeDale Resort", image:"https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80.jpg"}
	];

app.get("/",function(req,res){
	res.render("landing");
});

app.get("/campgrounds", function(req, res){
	res.render("campgrounds", {campgrounds:campgrounds});
});

app.post("/campgrounds", function(req, res){
	var name = req.body.name;
	var image = req.body.image;
	var newCamp = {name:name, image:image};
	campgrounds.push(newCamp);
	// console.log(name+" "+image);

	res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req, res){
	res.render("new");
});

app.listen(3000, function(){
	console.log("YelpCamp Server Initiated.");
});