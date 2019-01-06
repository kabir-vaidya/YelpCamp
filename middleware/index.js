var express = require("express"),
    Campground  = require("../models/campground"),
    Comment     = require("../models/comments");

var middlewareObj = {};

middlewareObj.isLoggedIn = function (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please login first!");
    res.redirect("/login");
}

middlewareObj.checkCommentOwnership = function (req, res, next) {
    if(req.isAuthenticated()){
        Comment.findById(req.params.id, function(err, foundComment){
            if(err || !foundComment){
                req.flash("error", "Comment not found");
                res.redirect("back");
            }  else {
                // does user own the campground?
            if(foundComment.author.id.equals(req.user._id)) {
                next();
            } else {
                res.redirect("back");
            }
            }
        });
    } else {
        res.redirect("back");
    }
}

middlewareObj.checkCampgroundOwnership = function (req, res, next) {
    if(req.isAuthenticated()){
        Comment.findById(req.params.id, function(err, foundComment){
            if(err || !foundCampground){
                req.flash("error", "Campground not found");
                res.redirect("back");
            }  else {
                // does user own the campground?
            if(foundComment.author.id.equals(req.user._id)) {
                next();
            } else {
                res.redirect("back");
            }
            }
        });
    } else {
        res.redirect("back");
    }
}


module.exports = middlewareObj;