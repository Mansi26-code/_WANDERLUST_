module.exports.createReview = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            throw new ExpressError('Listing not found', 404);
        }
        const newReview = new Review(req.body.review);
        newReview.author = req.user._id; // Assuming req.user._id is set by your authentication middleware
        listing.reviews.push(newReview);
        await newReview.save();
        await listing.save();
        req.flash('success', 'New review created!');
        res.redirect(`/listings/${listing._id}`);
    } catch (error) {
        req.flash('error', error.message);
        res.redirect(`/listings/${req.params.id}`);
    }
};

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    try {
        await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
        await Review.findByIdAndDelete(reviewId);
        req.flash('success', 'Review Deleted!');
        res.redirect(`/listings/${id}`);
    } catch (error) {
        req.flash('error', error.message);
        res.redirect(`/listings/${id}`);
    }
};
