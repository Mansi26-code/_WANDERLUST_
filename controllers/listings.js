const Listing = require('../models/listing');
const { listingSchema } = require('../schema.js');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports = {

    renderNewForm: (req, res) => {
        res.render('listings/new');
    },

    createListing: async (req, res, next) => {
        try {
            const { error } = listingSchema.validate(req.body);
            if (error) {
                req.flash('error', error.details.map(err => err.message).join(', '));
                return res.redirect('/listings/new');
            }

            const response = await geocodingClient.forwardGeocode({
                query: `${req.body.listing.location}, ${req.body.listing.country}`,
                limit: 1
            }).send();

            const coordinates = response.body.features[0].geometry.coordinates;
            const newListing = new Listing({
                ...req.body.listing,
                geometry: {
                    type: 'Point',
                    coordinates: coordinates
                },
                owner: req.user._id
            });

            if (req.file) {
                newListing.image = {
                    url: req.file.path,
                    filename: req.file.filename
                };
            }

            await newListing.save();
            req.flash('success', 'New Listing Created');
            res.redirect(`/listings/${newListing._id}`);
        } catch (error) {
            next(error);
        }
    },

    index: async (req, res) => {
        try {
          const allListings = await Listing.find({});
          res.render("listings/index.ejs", { allListings }); // Send listings as JSON response
        } catch (e) {
          console.error(e);
          res.status(500).json({ message: "Error fetching listings" });
        }
      },
    showListing: async (req, res) => {
        try {
            const listing = await Listing.findById(req.params.id).populate('reviews').populate('owner');
            if (!listing) {
                req.flash('error', 'Listing not found');
                return res.redirect('/listings');
            }
            res.render('listings/show', { listing, mapToken });
        } catch (error) {
            console.error(error);
            req.flash('error', 'Something went wrong');
            res.redirect('/listings');
        }
    },

    renderEditForm: async (req, res) => {
        try {
            const listing = await Listing.findById(req.params.id);
            if (!listing) {
                req.flash('error', 'Listing not found');
                return res.redirect('/listings');
            }
            res.render('listings/edit', { listing });
        } catch (error) {
            console.error(error);
            req.flash('error', 'Something went wrong');
            res.redirect('/listings');
        }
    },

    updateListing: async (req, res) => {
        try {
            const listing = await Listing.findByIdAndUpdate(req.params.id, { ...req.body.listing });
            req.flash('success', 'Listing updated successfully');
            res.redirect(`/listings/${listing._id}`);
        } catch (error) {
            console.error(error);
            req.flash('error', 'Something went wrong');
            res.redirect('/listings');
        }
    },

    deleteListing: async (req, res) => {
        try {
            await Listing.findByIdAndDelete(req.params.id);
            req.flash('success', 'Listing deleted successfully');
            res.redirect('/listings');
        } catch (error) {
            console.error(error);
            req.flash('error', 'Something went wrong');
            res.redirect('/listings');
        }
    },

    searchListings: async (req, res) => {
        try {
            const { query } = req.query;
            const searchQuery = new RegExp(query, 'i'); // Case-insensitive search
            const allListings = await Listing.find({
                $or: [
                    { location: searchQuery },
                    { country: searchQuery }
                ]
            });

            if (allListings.length > 0) {
                res.render('listings/index', { allListings, category: null }); // or send JSON if using AJAX
            } else {
                res.render('listings/index', { allListings: [], category: null }); // Empty result
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Something went wrong' });
        }
    }
};
