const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary');
const Listing=require("../models/listing");
const uploadListRouter = express.Router();

const upload = multer({ dest: 'uploads/' });
cloudinary.config({
  cloud_name: 'dovjugvy7',
  api_key: '267293914616543',
  api_secret: 'ty_nPu7eiaSWYr22-bLNMbM7fr0',
});

uploadListRouter.post('/', upload.array('listing[image]', 1), async(req, res) => {
    try {
        const listing = req.body.listing;
        const image = req.files[0].path;
        const result = await cloudinary.uploader.upload(image, {
            folder: 'listings',
            public_id: 'listing-image',
        });
        const validatedData = {
          title: listing.title,
          description: listing.description,
          image: {
            url: result.secure_url,
            filename: result.public_id,
          },
          price: listing.price,
          location: listing.location,
          country: listing.country,
        };

        const newListing = new Listing(validatedData);
        console.log(newListing);
        await newListing.save();
        res.redirect('/listings');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating listing');
    }
});

module.exports = uploadListRouter;