import { db } from "../config.js";
import { validateFullTrip, validateId, validateTripElements } from "../helpers/validation.js";

const tripsCollection = db.collection("trips");

export function postTrip(req, res) {
    const trip = req.body;
    try {
        validateFullTrip(trip);
    } catch (err) {
        res.status(400).send({ message: err.message });
        return;
    }
    tripsCollection
        .doc(trip.id)
        .get()
        .then((docSnap) => {
            if (docSnap.exists) {
                res.status(400).send({ message: "Trip with given id already exists" });
            } else {
                tripsCollection
                    .doc(trip.id)
                    .set(trip)
                    .then(() => {
                        res.status(201).send(trip);
                    })
                    .catch((err) => {
                        res.status(500).send({ message: err.message });
                    });
            }
        }).catch((err) => {
            res.status(500).send({ message: err.message });
        });
}

export function getAllTrips(req, res) {
    tripsCollection
        .get()
        .then(snapshot => {
            res.send(snapshot.docs.map(doc => doc.data()));
        })
        .catch((err) => {
            res.status(500).send({ message: err.message });
        });

}

export function updateTrip(req, res) {
    const id = req.params.id;
    try {
        validateId(id);
    } catch (err) {
        res.status(400).send({ message: err.message });
        return;
    }
    const trip = req.body;
    try {
        validateTripElements(trip);
    } catch (err) {
        res.status(400).send({ message: err.message });
        return;
    }
    tripsCollection
        .doc(id)
        .get()
        .then((docSnap) => {
            if (docSnap.exists) {
                tripsCollection
                    .doc(id)
                    .update(trip)
                    .then(() => {
                        tripsCollection
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

export function deleteTrip(req, res) {
    const id = req.params.id;
    try {
        validateId(id);
    } catch (err) {
        res.status(400).send({ message: err.message });
        return;
    }
    tripsCollection
        .doc(id)
        .get()
        .then((docSnap) => {
            if (!docSnap.exists) {
                res.status(404).send({ message: "Trip not found" });
            } else {
                tripsCollection
                    .doc(id)
                    .delete()
                    .then(() => {
                        res.sendStatus(204);
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
