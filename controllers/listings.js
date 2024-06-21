const Listing = require("../models/listing");
const { listingSchema } = require('../schema.js');
const { z } = require("zod");
const Joi = require('joi');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Define schemas for input validation using zod
const listingSchemaInput = z.object({
  title: z.string(),
  description: z.string(),
  price: z.number().min(0),
  location: z.string(),
  country: z.string(),
  image: z.string().optional()
});

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
  const result = listingSchemaInput.safeParse(req.body.listing);
  if (!result.success) {
    const errorMessages = result.error.errors.map(err => err.message).join(', ');
    return res.status(400).json({ error: errorMessages });
  } 
  next();
};

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("./listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested does not exist!");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = [
  upload.single('image'),
  validateListing,  // Add validation middleware here
  async (req, res, next) => {
    try {
      const { path: url, filename } = req.file;
      const newListing = new Listing(req.body.listing);
      newListing.owner = req.user._id;
      newListing.image = { url, filename };
      await newListing.save();
      req.flash("success", "New Listing Created!");
      res.redirect("/listings");
    } catch (error) {
      next(error);
    }
  }
];

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let updatedListing = await Listing.findByIdAndUpdate(id, {
      ...req.body.listing,
  });
  if (typeof req.file !== "undefined") {
      let url = req.file.path;
      let filename = req.file.filename;
      updatedListing.image = { url, filename };
      await updatedListing.save();
  }
  req.flash("success", "Listing Updated");
  res.redirect(`/listings/${id}`);
}
module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
// updated on 21st june