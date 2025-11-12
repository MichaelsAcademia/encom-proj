import express from "express"
import listingRoutes from "./listings.js"
import userRoutes from "./users.js"
import reviewRoutes from './reviews.js'

const router = express.Router()

router.use("/listings", listingRoutes)
router.use("/users", userRoutes)
router.use("/reviews", reviewRoutes)


export default router
