const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const { isLoggedIn, isOwner, validateListing } = require('../middleware');
const listingController = require('../controllers/listings');
const multer = require('multer');
const { storage } = require('../cloudConfig');
const upload = multer({ storage });

// Define routes
router.route('/')
  .get(wrapAsync(listingController.index))
  .post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingController.createListing));

router.get('/new', isLoggedIn, listingController.renderNewForm);
router.get('/search', wrapAsync(listingController.searchListings));
router.route('/:id')
  .get(wrapAsync(listingController.showListing))
  .put(isLoggedIn, upload.single('image'), isOwner, validateListing, wrapAsync(listingController.updateListing))
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;





//