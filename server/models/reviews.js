import mongoose from "mongoose";

//Schema that I needed to make according to Michael's Design. Pretty simple so far.
const reviewSchema = new mongoose.Schema(
    {
        reviewId: { type: String, required: true},
        sellerId: { type: String, required: true},
        orderId: { type: String, required: true},
        rating: { type: String, required: true, min: 0, max: 5},
        comment: { type: String, default: ''}
    },

    {timestamps: true} //This helps to make created and updated parts of schema I needed to make. Here is the link where I found it: https://mongoosejs.com/docs/timestamps.html
)

export default mongoose.model('Review', reviewSchema)