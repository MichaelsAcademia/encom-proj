import express from "express";
import listingRoutes from "./listings.js";
import userRoutes from "./users.js";

const router = express.Router();

router.use("/listings", listingRoutes);
router.use("/users", userRoutes);

export default router;
