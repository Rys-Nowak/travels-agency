import { db } from "../config.js";
import { updateTrip } from "./trip.controller.js";

const reviewsCollection = db.collection("reviews")

function isUsername(name) {
    return /^[a-zA-Z0-9_\.-]+$/.test(name);
}

function isRate(rate) {
    return Number.isInteger(rate) && rate >= 1 && rate <= 5;
}

function isId(id) {
    return true;
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
}

function validateId(id) {
    if (isId(id)) return true;
    throw new Error("Invalid id");
}

function validateFullReview(review) {
    if (isId(review.id) && isRate(review.rate) && isUsername(review.username)) return true;
    throw new Error("Invalid data");
}

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