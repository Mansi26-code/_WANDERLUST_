const Listing=require("../models/listing");
const { listingSchema } = require('../schema.js');
const {z} = require("zod")

module.exports.index= async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
  };

  module.exports.renderNewForm= (req, res) => {
   res.render("listings/new.ejs");
  };

  module.exports.showListing=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");

    if(!listing)
        {
            req.flash("error","Listing you requested does not exist!");
            res.redirect("/listings");
        }
        console.log(listing);
    res.render("listings/show.ejs", { listing });
  };
  ////////////////////////////////////////////////////////////////////////////
  const imageSchemaInput = z.object({
    url: z.string().optional(),
    filename: z.string().optional(),
  });
  
  const reviewSchemaInput = z.object({
    type: z.string(),
    ref: z.literal('Review'),
  });
  
  const listingSchemaInput = z.object({
    title: z.string().min(1).max(100).trim(),
    description: z.string().min(1).max(1000).trim(),
    image: imageSchemaInput,
    price: z.number().positive().finite(),
    location: z.string().min(1).max(100).trim(),
    country: z.string().min(1).max(100).trim(),
    reviews: z.array(reviewSchemaInput),
    owner: z.string().length(24, 'Invalid ObjectId format'),
  });

  module.exports.createListing = async (req, res, next) => {
    console.log('inside create listing');
    try {
      const { filename } = req.file;
      const imageUrl = `/images/${filename}`;
  
      const data = {
        ...req.body.listing,
        image: {
          url: imageUrl,
          filename,
        },
        owner: req.user._id,
      };
  
      const validatedData = listingSchemaInput.parse(data);
      console.log('data validated');
      const newListing = new Listing(validatedData);
      console.log(newListing);
      await newListing.save();
  
      req.flash('success', 'New Listing Created!');
      res.redirect('/listings');
    } catch (error) {
      if (error instanceof z.ZodError) {
        req.flash('error', 'Invalid input data');
        return res.redirect('/listings/new');
      }
      next(error);
    }
  };

   module.exports.renderEditForm=async (req, res) => {
   
      
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
     
       req.flash("error","Listing you requested for does not exist!");
       res.redirect("/listings");
    }
   
    res.render("listings/edit.ejs", { listing });
   
  };

  module.exports.updateListing=async (req, res) => {
    const { id } = req.params;
    

    await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing=async (req, res) => {

 
    const { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted!")
    res.redirect("/listings");
  }