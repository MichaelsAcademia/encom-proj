import express from "express";

import {
  getAllReviews,
  getReviewById,
  getUserReviews,
  createReview,
  updatedReview,
  deletedReview,
} from "../../controllers/reviews.js";
import { protect } from "../../middleware/authMiddleware.js";

const router = express.Router();

//Routes for reviews
router.get("/", getAllReviews);
router.get("/:id", getReviewById);
router.get("/user/:username", getUserReviews);
router.post("/", protect, createReview);
router.put("/:id", protect, updatedReview);
router.delete("/:id", protect, deletedReview);


export default router;
