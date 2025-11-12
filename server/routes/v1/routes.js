import express from "express"
import listingRoutes from "./listings.js"
import userRoutes from "./users.js"
import orderRoutes from "./orders.js"

const router = express.Router()

router.use("/listings", listingRoutes)
router.use("/users", userRoutes)
router.use("/orders", orderRoutes)

export default router
