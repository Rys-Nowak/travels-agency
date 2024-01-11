import express from "express";
import { db } from "../config.js";

const router = express.Router();

function postTrip(req, res) {
    const trip = req.body;
    db.collection("trips")
        .doc(trip.id)
        .get()
        .then((doc) => {
            if (doc.exists) {
                res.status(400).send({ message: "Trip already exists" });
            } else {
                db.collection("trips")
                    .doc(trip.id)
                    .set(trip)
                    .then(() => {
                        res.status(201).send(trip);
                    })
                    .catch((err) => {
                        res
                            .status(500)
                            .send({ message: err.message });
                    });
            }
        });
}

async function getTrips(req, res) {
    const snapshot = await db
        .collection("trips")
        .get()
        .catch((err) => {
            res.status(500).send({ message: err.message });
        });

    res.send(snapshot.docs.map(doc => doc.data()));
}

function updateTrip(req, res) {
    const id = req.params.id;
    const trip = req.body;
    db.collection("trips")
        .doc(id)
        .get()
        .then(async (docSnap) => {
            if (docSnap.exists) {
                await db
                    .collection("trips")
                    .doc(id)
                    .update(trip)
                    .then(() => {
                        db.collection("trips")
                            .doc(id)
                            .get()
                            .then((docSnap) => {
                                res.send(docSnap.data());
                            })
                            .catch((err) => {
                                res.status(500).send({ message: err.message });
                            });
                    })
                    .catch((err) => {
                        res.status(500).send({ message: err.message });
                    });
            } else {
                res.status(404).send({ message: "Trip not found" });
            }
        })
        .catch((err) => {
            res.status(500).send({ message: err.message });
        });
}

function deleteTrip(req, res) {
    const id = req.params.id;
    db.collection("trips")
        .doc(id)
        .get()
        .then((docSnap) => {
            if (!docSnap.exists) {
                res.status(404).send({ message: "Trip not found" });
            } else {
                db.collection("trips")
                    .doc(id)
                    .delete()
                    .then(() => {
                        res.sendStatus(200);
                    })
                    .catch((err) => {
                        res.status(500).send({ message: err.message });
                    });
            }
        })
        .catch((err) => {
            res.status(500).send({ message: err.message });
        });
}

router.post("/", postTrip);
router.get("/", getTrips);
router.put("/:id", updateTrip);
router.delete("/:id", deleteTrip);

export default router;
