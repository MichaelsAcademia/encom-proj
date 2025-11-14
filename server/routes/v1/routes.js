import express from "express"
import listingRoutes from "./listings.js"
import userRoutes from "./users.js"
import reviewRoutes from './reviews.js'
import orderRoutes from "./orders.js"
import cartRoutes from "./carts.js"

const router = express.Router()

router.use("/listings", listingRoutes)
router.use("/users", userRoutes)
router.use("/reviews", reviewRoutes)
router.use("/orders", orderRoutes)
router.use("/carts", cartRoutes)

export default router
