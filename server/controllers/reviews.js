import Review from '../models/reviews.js'

export const getAllReviews = async (req, res) => {
    try {
        const {sellerId, orderId} = req.query
        const filter = {}

        if (sellerId) filter.sellerId = sellerId;
        if (orderId) filter.orderId = orderId;

        const reviews = await Review.find(filter)

        if(!reviews || reviews.length ===0){
            return res.status(404).json({message: 'No reviews found'})
        } res.status(200).json(reviews)}
            catch (error){
            res.status(500).json({message: error.message})
            }
        }   

export const getReviewById = async (req, res) => {
    try{
        const review = await Review.findById(req.params.id)

        if (!review){
            return res.status(404).json({message: 'Review not found'})
        } res.status(200).json(review)}
            catch (error){
            res.status(500).json({message: error.message})
            }
        }

    export const  createReview = async (req, res) => {
        try {
            const { reviewId, sellerId, orderId, rating, comment} = req.body

            if (!reviewId || !sellerId || !orderId || rating == null){
                res.status(400).json({message: 'Missing required fields. Please enter all required fields'})
            }

        const newReview = new Review({
            reviewId,
            sellerId,
            orderId,
            rating,
            comment
        })

        await newReview.save()
        res.status(201).json(newReview)
       } catch (error) {
        res.status(500).json({message: error.message})
       }
    }

    export const updatedReview = async (req, res) => {
        try {
        const updatedReview = await Review.findByIdAndUpdate(
            req.params.id, req.body, {new: true}
        )

        if (!updatedReview){
            return res.status(404).json({message: 'Review not found'})
        }

        res.status(200).json(updatedReview)
        } catch (error) {
        res.status(500).json({message: error.message})
        }
    }
    
    export const deletedReview = async (req, res) => {
        try{
            const deletedReview = await Review.findByIdAndDelete(req.params.id)

        if(!deletedReview){
            return res.status(404).json({message: 'Review not found'})
        }

        res.status(200).json({message: 'Review deleted successfully'})
        } catch (error) {
        res.status(500).json({message: error.message})
        }
}
        