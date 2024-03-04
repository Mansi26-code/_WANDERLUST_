const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: {
        url: { type: String }, // Making url optional
        filename: { type: String } // Making filename optional
    },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    country: { type: String, required: true }
});

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;
