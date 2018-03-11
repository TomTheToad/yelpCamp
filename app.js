// Requirements
var express 	= require("express"),
	app 		= express(),
	bodyParser 	= require("body-parser"),
	mongoose 	= require("mongoose");

// Environment
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// See data
var seedData = 
	[
		{ 
			name: "Fort Wilderness", 
			image: "https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=c85daa025ee04c951b6ac12fe3ba031a&dpr=2&auto=format&fit=crop&w=767&h=511&q=60&cs=tinysrgb",
			description: "Disney World Campground! The best!"
		},
		{ 
			name: "Old Orchard KOA", 
			image: "https://images.unsplash.com/photo-1505735754789-3404132203ed?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=8e0ef56213507ac99a507966ab9c5499&dpr=2&auto=format&fit=crop&w=767&h=511&q=60&cs=tinysrgb",
			description: "Convenient to Portland, ME."
		},
		{ 
			name: "First Americans", 
			image: "https://images.unsplash.com/photo-1479244209311-71e35c910f59?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=dc35b0b256383753180a9449ff0d5ea5&auto=format&fit=crop&w=1650&q=80",
			description: "A totally made up place."
		}
	];
// Database connect
mongoose.connect("mongodb://localhost/yelp_camp");

// Database schema setup
var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Database add function
function addCampground(arr){
Campground.create({ name: arr["name"], image: arr["image"], description: arr["description"]}, 
	function(err, campground){
		if(err) {
			console.log(err);
		} else {
			console.log("Newly created campground");
			console.log(campground);
		}
	});
}

// Database add test data
// seedData.forEach( function(arr) {
// 	addCampground(arr);
// });

// Begin routes
app.get("/", function(req, res){
    res.render("landing");
});

// Index
app.get("/campgrounds", function(req, res){
	Campground.find({}, function(err, data){
		if(err){
			console.log(err);
		} else {
			res.render("index", {campgrounds: data});
		}
	});
});

// Create
app.post("/campgrounds", function(req, res){
	// get data from form and add to campgrounds array
	var newCampground = {
		name: req.body.name,
		image: req.body.image,
		description: req.body.description
	}
	addCampground(newCampground);
	// redirect back to campgrounds
	res.redirect("/campgrounds");
});

// New
app.get("/campgrounds/new", function(req, res){
	res.render("new.ejs");
});

// Show
app.get("/campgrounds/:id", function(req, res){
	Campground.findById(req.params.id, function(err, data){
		if(err){
			console.log(err);
		} else {
			res.render("show", {campground: data});
		}
	});
});

app.get("*", function(req, res){
	res.send("404 Not found");
});

app.listen(3000, function(){
    console.log("YelpCamp runnong on port 3000.");
});
