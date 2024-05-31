// routes/listing.js
const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const Listing = require('../models/listing.js');
const { isLoggedIn, isOwner, validateListing } = require('../middleware.js');
const listingController = require('../controllers/listings.js');
const { listingSchema } = require('../schema.js'); // Ensure the path is correct

const multer = require('multer');
const { storage } = require('../cloudConfig.js');
const upload = multer({ storage });

router.route('/')
  .get(wrapAsync(listingController.index))
  .post( upload.single('listing[image]'), (req,res)=>{
    res.send(req.file)
  })
  
router.get('/new', isLoggedIn, listingController.renderNewForm);

router.route('/:id')
  .get(wrapAsync(listingController.showListing))
  .put(isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing))
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;

