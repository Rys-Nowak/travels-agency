import { db } from "../config.js";
import { validateFullReview, validateId } from "../helpers/validation.js";

const reviewsCollection = db.collection("reviews");

export function postReview(req, res) {
    const review = req.body;
    try {
        validateFullReview(review);
    } catch (err) {
        res.status(400).send({ message: err.message });
        return;
    }
    reviewsCollection
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

export function getReviewsByTrip(req, res) {
    const tripId = req.params.tripId;
    try {
        validateId(tripId);
    } catch (err) {
        res.status(400).send({ message: err.message });
        return;
    }
    reviewsCollection
        .where("tripId", "==", tripId)
        .get()
        .then(snapshot => {
            res.send(snapshot.docs.map((doc) => doc.data()));
        })
        .catch((err) => {
            res.status(500).send({ message: err.message });
        });
}

export function getAllReviews(req, res) {
    reviewsCollection
        .get()
        .then(snapshot => {
            res.send(snapshot.docs.map((doc) => doc.data()));
        })
        .catch((err) => {
            res.status(500).send({ message: err.message });
        });
}