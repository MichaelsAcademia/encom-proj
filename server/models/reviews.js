import mongoose from "mongoose";

//Schema that I needed to make according to Michael's Design. Pretty simple so far.
const reviewSchema = new mongoose.Schema(
    {
        reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Orders", required: true },
        rating: { type: Number, required: true, min: 0, max: 5},
        comment: { type: String, default: ''}
    },
    {timestamps: true} //This helps to make created and updated parts of schema I needed to make. Here is the link where I found it: https://mongoosejs.com/docs/timestamps.html
)

export default mongoose.model('Review', reviewSchema)