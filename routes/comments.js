var express = require("express"),
    Campground  = require("../models/campground"),
    Comment     = require("../models/comments"),
    middleware = require("../middleware"),
    router = express.Router({mergeParams: true});

router.get("/new", middleware.isLoggedIn, function(req, res){
    // find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {campground: campground});
        }
    })
});

router.post("/", middleware.isLoggedIn,function(req, res){
   //lookup campground using ID
   Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
               comment.author.id = req.user._id;
               comment.author.username = req.user.username
               comment.save();
               campground.comments.push(comment);
               campground.save();
               res.redirect('/campgrounds/' + campground._id);
           }
        });
       }
   });
});

//Edit
router.get("/:comments_id/edit", middleware.checkCommentOwnership, (req,res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if(err || !foundCampground) {
            req.flash("error", "Cammground not found");
            res.redirect("back");
        } 
        Comment.findById(req.params.comments_id, (err, foundComment) => {
            if(err || !foundComment){
                req.flash("error", "Cammground not found");
                res.redirect("back");
            }
            else res.render("comments/edit",{comment: foundComment, campground_id: req.params.id});
        });
    });
});

//Update
router.put("/:comments_id", middleware.checkCommentOwnership, (req,res) => {
    Comment.findByIdAndUpdate(req.params.comments_id, req.body.comment, (err,comment) => {
        if(err) console.log(err);
        else res.redirect("/campgrounds/"+req.params.id);
    })
})

//Destroy
router.delete("/:comments_id", middleware.checkCommentOwnership, (req,res) => {
    Comment.findByIdAndRemove(req.params.comments_id, (err) => {
        if(err) console.log(err);
        else {
            console.log(req.params.comments_id);
         res.redirect("/campgrounds/" + req.params.id);
        }
    })
})


module.exports = router;