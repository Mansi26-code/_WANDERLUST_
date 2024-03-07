const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");

const app = express();
const {listingSchema }=require("./schema.js");
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

// Routes

app.get("/", (req, res) => {
  res.send("Hi, I am root");
});


const validateListing=(req,res,next)=>{

  let {error}=listingSchema.validate(req.body);
 
  if(error)
  {
    let errMsg=error.details.map((el)=>el.message).join(".");
   throw new ExpressError(400,errMsg);
  }
  else{
    next();
  }

};



// Index Route
app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("./listings/index.ejs", { allListings });
});

// New route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

// Show Route
app.get("/listings/:id", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
});

// Create route
app.post("/listings",validateListing, wrapAsync(async (req, res,next) => {

 let result=listingSchema.validate(req.body);
 console.log(result);
 if(result.error)
 {
  throw new ExpressError(400,result.error);
 }
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");


})

);




// Edit Route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
}));

// Update route
app.put("/listings/:id",validateListing, wrapAsync(async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect("/listings");
}));

// Delete route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
  const { id } = req.params;
  const deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
}));


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
