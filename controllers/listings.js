const Listing = require("../models/listing");
const { listingSchemaJoi } = require('../schema.js');
const Joi = require('joi');
const multer = require('multer');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN; // Ensure this environment variable is set
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// Middleware to handle file uploads using multer
const upload = multer({ dest: 'uploads/' });

// Controller method for creating a new listing
module.exports.createListing = async (req, res, next) => {
    try {
        // Validate incoming data
        const { error } = listingSchemaJoi.validate(req.body.listing);
        if (error) {
            req.flash("error", error.details.map(err => err.message).join(', '));
            return res.redirect("/listings/new");
        }

        // Perform geocoding to get coordinates
        const response = await geocodingClient.forwardGeocode({
            query: `${req.body.listing.location}, ${req.body.listing.country}`,
            limit: 1
        }).send();

        const coordinates = response.body.features[0].geometry.coordinates;

        // Prepare image details
        const url = req.file.path;
        const filename = req.file.filename;

        // Create new listing object
        const newListing = new Listing({
            ...req.body.listing,
            image: { url, filename },
            owner: req.user._id,
            geometry: {
                type: "Point",
                coordinates: coordinates
            }
        });

        // Save listing to database
        await newListing.save();

        req.flash("success", "New Listing Created");
        res.redirect("/listings");
    } catch (error) {
        next(error); // Pass error to error-handling middleware
    }
};



// //