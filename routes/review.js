const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const reviewsController = require('../controllers/reviews');

router.post('/', isLoggedIn, validateReview, wrapAsync(reviewsController.createReview));
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, wrapAsync(reviewsController.deleteReview));

module.exports = router;
