const Listing = require("../models/listing");
// const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
// const mapToken=process.env.MAP_TOKEN;
// const geocodingClient = mbxGeocoding({ accessToken: mapToken});
const { listingSchemaInput } = require('../schema.js'); // Assuming listingSchemaInput is defined externally
const Joi = require('joi');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Define Joi schema for listing
const listingSchemaJoi = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required().min(0),
  location: Joi.string().required(),
  country: Joi.string().required(),
  image: Joi.string().allow("", null)
}).required();

// Middleware to validate listing data using zod
const validateListing = (req, res, next) => {
  const { error } = listingSchemaInput.safeParse(req.body.listing);
  if (error) {
    return res.status(400).json({ error: error.errors.map(err => err.message).join(', ') });
  }
  next();
};

// Middleware to handle file uploads using multer
const handleFileUpload = upload.single('image');

// Controller methods
module.exports.index = async (req, res, next) => {
  try {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
  } catch (error) {
    next(error); // Pass error to error-handling middleware
  }
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("owner");
    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
  } catch (error) {
    next(error); // Pass error to error-handling middleware
  }
};

module.exports.createListing = async (req, res, next) => {

  // let response=await geocodingClient
  // .forwardGeocode({
  //   query: 'Patna, Bihar',
  //   limit: 1
  // })
  //   .send();
  //   console.log(response.body.features[0].geometry);
  //   res.send("Done!");

  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  let savedListing = await newListing.save();
  // console.log(savedListinnng);
  req.flash("success", "New Listing Created");
  res.redirect("/listings");
}

module.exports.renderEditForm = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
  } catch (error) {
    next(error); // Pass error to error-handling middleware
  }
};

module.exports.updateListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedListing = await Listing.findByIdAndUpdate(id, req.body.listing, { new: true });
    if (!updatedListing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }
    if (req.file) {
      updatedListing.image = {
        url: req.file.path,
        filename: req.file.filename
      };
      await updatedListing.save();
    }
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
  } catch (error) {
    next(error); // Pass error to error-handling middleware
  }
};

module.exports.deleteListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
  } catch (error) {
    next(error); // Pass error to error-handling middleware
  }
};

// //