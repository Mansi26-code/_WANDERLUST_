const Listing = require('../models/listing');
const { listingSchemaJoi } = require('../schema.js');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    const { category } = req.query;
    const query = category ? { category } : {};
    const listings = await Listing.find(query);
    res.render('listings/index', { listings });
};

module.exports.renderNewForm = (req, res) => {
    res.render('listings/new');
};

module.exports.createListing = async (req, res, next) => {
    try {
        const { error } = listingSchemaJoi.validate(req.body.listing);
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

        await newListing.save();
        req.flash('success', 'New Listing Created');
        res.redirect(`/listings/${newListing._id}`);
    } catch (error) {
        next(error);
    }
};

module.exports.showListing = async (req, res) => {
    const listing = await Listing.findById(req.params.id).populate('reviews').populate('owner');
    if (!listing) {
        req.flash('error', 'Listing not found');
        return res.redirect('/listings');
    }
    res.render('listings/show', { listing });
};

module.exports.renderEditForm = async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        req.flash('error', 'Listing not found');
        return res.redirect('/listings');
    }
    res.render('listings/edit', { listing });
};

module.exports.updateListing = async (req, res) => {
    const listing = await Listing.findByIdAndUpdate(req.params.id, { ...req.body.listing });
    req.flash('success', 'Listing updated successfully');
    res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteListing = async (req, res) => {
    await Listing.findByIdAndDelete(req.params.id);
    req.flash('success', 'Listing deleted successfully');
    res.redirect('/listings');
};






// //