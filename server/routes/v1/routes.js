import express from "express"
import listingRoutes from "./listings.js"
import userRoutes from "./users.js"
import reviewRoutes from './reviews.js'
import orderRoutes from "./orders.js"
import cartRoutes from "./carts.js"
import authRoutes from "./auth.js"

import { protect } from "../../middleware/authMiddleware.js"

const router = express.Router()

router.use("/listings", listingRoutes)
router.use("/users", protect, userRoutes)
router.use("/reviews", protect, reviewRoutes)
router.use("/orders", protect, orderRoutes)
router.use("/carts", protect, cartRoutes)
router.use("/auth", authRoutes)

export default router
