const express = require("express");
const router = express.Router({ mergeParams: true }); // Ensure params are merged from the parent router
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const reviewscontroller=require("../controllers/reviews.js");
const { validateReview,isLoggedIn,isReviewAuthor } = require("../middleware.js");

// Reviews POST route
router.post("/", isLoggedIn,validateReview, wrapAsync(reviewscontroller.createReview));

// Reviews DELETE route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewscontroller.deleteReview));

module.exports = router;
