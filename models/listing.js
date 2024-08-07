const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: {
    url: String,
    filename: String,
  },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  country: { type: String, required: true },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review',
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  category: {
		type: [String],
	},
  geometry:{
    type:{
      type:String,
      enum:["Point"],
      Required:true,
    },
    coordinates:{
      type:[Number],
      required:true
    },
  },
});

listingSchema.post('findOneAndDelete', async (listing) => {
  try {
    if (listing) {
      await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
  } catch (error) {
    console.error('Error occurred while deleting associated reviews:', error);
  }
});

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;

