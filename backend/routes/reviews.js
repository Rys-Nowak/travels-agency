import express from "express";
import { db } from "../config.js";

const router = express.Router();

function postReview(req, res) {
    const review = req.body;
    db.collection("reviews")
        .doc(`${review.username}-${review.tripId}`)
        .set(review)
        .then(() => {
            res.status(201).send(review);
        })
        .catch((err) => {
            res
                .status(500)
                .send({ message: err.message });
        });
}

async function getReviewsByTrip(req, res) {
    const tripId = req.params.tripId;
    const reviewsSnap = await db
        .collection("reviews")
        .where("tripId", "==", tripId)
        .get()
        .catch((err) => {
            res.status(500).send({ message: err.message });
        });
    
    res.send(reviewsSnap.docs.map((doc) => doc.data()));
}

async function getAllReviews(req, res) {
    const reviewsSnap = await db
        .collection("reviews")
        .get().catch((err) => {
            res.status(500).send({ message: err.message });
        });

    res.send(reviewsSnap.docs.map((doc) => doc.data()));
}

router.post("/", postReview);
router.get("/:tripId", getReviewsByTrip);
router.get("/", getAllReviews);

export default router;
