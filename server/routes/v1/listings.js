import express from "express";
import {
  getListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
} from "../../controllers/listings.js";
import { protect } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getListings);
router.get("/:id", getListingById);
router.post("/", protect, createListing);
router.put("/:id", protect, updateListing);
router.delete("/:id", protect, deleteListing);


export default router;
