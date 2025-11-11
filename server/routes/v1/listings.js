import express from "express";
import {
  getListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
} from "../../controllers/listings.js";
//import { protect } from "../../middleware/authMiddleware.js"; 

const router = express.Router();

router.get("/", getListings);
router.get("/:id", getListingById);

router.post("/", createListing);
router.put("/:id", updateListing);
router.delete("/:id", deleteListing);


export default router;
