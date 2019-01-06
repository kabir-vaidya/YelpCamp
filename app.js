var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    flash       = require("connect-flash"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comments"),
    User        = require("./models/user"),
    seedDB      = require("./seeds"),
    methodOverride = require("method-override");

var indexRoutes = require("./routes/index.js");
var campgroundRoutes = require("./routes/campgrounds.js");
var commentRoutes = require("./routes/comments.js");

//Flash
app.use(flash());

//Mongoose
mongoose.connect("mongodb://localhost/yelpcamp", {useNewUrlParser: true});

//Body Parser
app.use(bodyParser.urlencoded({extended: true}));

//EJS
app.set("view engine", "ejs");

//Setting up public folder for styles
app.use(express.static(__dirname + "/public"));

//Seed
// seedDB();

//Method Override
app.use(methodOverride("_method"));

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Locals
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});


//INDEX ROUTES, INCLUDING AUTH
app.use("", indexRoutes);


//CAMPGROUND ROUTES
app.use("/campgrounds", campgroundRoutes);

// COMMENTS ROUTES
app.use("/campgrounds/:id/comments", commentRoutes);



app.listen(3000, function(){
   console.log("The YelpCamp Server Has Started!");
});