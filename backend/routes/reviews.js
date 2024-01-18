import express from "express";
import { postReview, getReviewsByTrip, getAllReviews } from "../controllers/review.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { restrictForClient } from "../middlewares/restrict.js";

const router = express.Router();

router.post("/", verifyToken, restrictForClient, postReview);
router.get("/:tripId", verifyToken, getReviewsByTrip);
router.get("/", verifyToken, getAllReviews);

export default router;
