import express from "express";
import { postReview, getReviewsByTrip, getAllReviews } from "../controllers/review.controller.js";

const router = express.Router();

router.post("/", postReview);
router.get("/:tripId", getReviewsByTrip);
router.get("/", getAllReviews);

export default router;
