import express from "express";

import {
  getAllReviews,
  getReviewById,
  createReview,
  updatedReview,
  deletedReview,
} from "../../controllers/reviews.js";
//import { protect } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllReviews);
router.get("/:id", getReviewById);
router.post("/", createReview);
router.put("/:id", updatedReview);
router.delete("/:id", deletedReview);


export default router;
