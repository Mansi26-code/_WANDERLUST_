
require("dotenv").config();



const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const listings=require("./routes/listing.js");
const flash=require("connect-flash");
const reviews=require("./routes/review.js");
const app = express();
const session=require("express-session");
const passport=require("passport");
const localStratergy=require("passport-local");
const User=require("./models/user.js");



const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");


const{reviewSchema}=require("./schema.js");
const { userInfo } = require("os");
const MONGO_URL = "mongodb://127.0.0.1:27017/Wanderlust";

async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("Connected to DB");
}

main().catch((err) => {
  console.error(err);
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

//session options set krte hain
const sessionOptions={
  secret:"mysupersecretcode",
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now() + 7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true,//cross scripting attack se bachata h
  },
};
app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

app.use(session(sessionOptions)); //ab agar cookies me connect.sid dikh rha h...mtlb sessions work krrhe hain
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStratergy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user; //humara currUser store krega abhi wale user ke related jo bhi
  next(); //next ko call krna mat bhoolna varna isi loop me ghoomta rhega
});

app.get("/demouser",async(req,res)=>{
  let fakeUser=new User({
    email:"student@gmail.com",
    username:"delta-Student"


  });

   let registeredUser=await User.register(fakeUser,"helloworld");//register batata h ki kya vo user unique h
   res.send(registeredUser);
});//hashing algo used=pbkdf2
// Routes
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);



app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"Page Not Found"));
});
app.use((err,req,res,next)=>{
 
  let{statusCode=500,message="Something Went Wrong!"}=err;
 res.status(statusCode).render("error.ejs",{message})
 
  // res.status(statusCode).send(message);
});
app.listen(8080, () => {
  console.log("Server is listening to port 8080");
});
