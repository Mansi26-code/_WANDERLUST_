// review.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Assuming you have a User model for the author
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Review', reviewSchema);


