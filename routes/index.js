var express = require("express"),
    passport    = require("passport"),
    User = require("../models/user.js"),
    router = express.Router();

router.get("/", function(req, res){
    res.render("home");
});

// show register form
router.get("/register", function(req, res){
    res.render("register"); 
 });
 //handle sign up logic
 router.post("/register", function(req, res){
     var newUser = new User({username: req.body.username});
     User.register(newUser, req.body.password, function(err, user){
         if(err){
             return res.render("register", {"error": err.message});
         }
         passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds"); 
         });
     });
 });
 
 // show login form
 router.get("/login", function(req, res){
    res.render("login", {message: req.flash("error")}); 
 });
 // handling login logic
 router.post("/login", passport.authenticate("local", 
     {
         successRedirect: "/campgrounds",
         failureRedirect: "/login"
     }), function(req, res){
 });
 
 // logout route
 router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Successfully logged out")
    res.redirect("/campgrounds");
 });
 
 function isLoggedIn(req, res, next){
     if(req.isAuthenticated()){
         return next();
     }
     res.redirect("/login");
 }

 module.exports = router;