const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const ExpressError=require("../utils/ExpressError.js");
const wrapAsync=require("../utils/wrapAsync.js");
const passport=require("passport");
const{saveRedirectUrl}=require("../middleware.js");
const usercontroller=require("../controllers/user.js");


//for get and post of signup
router.route("/signup")
.get(usercontroller.renderSignupForm)
.post(wrapAsync(usercontroller.signup));

//for get and post of login

router.route("/login")
.get(usercontroller.renderloginForm)
.post(passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash:true,
}),
usercontroller.Afterlogin
);


router.get("/logout",usercontroller.Afterlogout);
   
module.exports =router;