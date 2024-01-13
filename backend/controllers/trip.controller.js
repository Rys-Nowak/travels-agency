import { db } from "../config.js";

const tripsCollection = db.collection("trips");

function isId(id) {
    return true;
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
}

function isName(name) {
    return /^[A-Za-z ]*$/.test(name);
}

function isDescription(description) {
    return /^[A-Za-z0-9,.-_'"\?\! ]*$/.test(description);
}

function isUrl(url) {
    const pattern = new RegExp(
        '^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', // fragment locator
        'i'
    );
    return pattern.test(url) || url === "";
}

function isDate(date) {
    return /^[0-9]{1,2}\.[0-9]{2}.[0-9]{4}$/.test(date);
}

function isPositive(value) {
    return Number.isFinite(value) && value >= 0;
}

function isPositiveInt(value) {
    return Number.isInteger(value) && value >= 0;
}

function validateId(id) {
    if (isId(id)) return true;
    throw new Error("Invalid id");
}

function validateFullTrip(trip) {
    if (isId(trip.id) &&
        isName(trip.name) &&
        isName(trip.country) &&
        isDate(trip.start) &&
        isDate(trip.end) &&
        isPositive(trip.cost) &&
        isPositive(trip.rating) &&
        isPositiveInt(trip.capacity) &&
        isPositiveInt(trip.available) &&
        isDescription(trip.description) &&
        isUrl(trip.img)) {
        return true;
    }
    throw new Error("Invalid data");
}

function validateTripElements(trip) {
    if (!trip.id &&
        (!trip.name || isName(trip.name)) &&
        (!trip.country || isName(trip.country)) &&
        (!trip.start || isDate(trip.start)) &&
        (!trip.end || isDate(trip.end)) &&
        (!trip.cost || isPositive(trip.cost)) &&
        (!trip.capacity || isPositiveInt(trip.capacity)) &&
        (!trip.available || isPositiveInt(trip.available)) &&
        (!trip.description || isDescription(trip.description)) &&
        (!trip.img || isUrl(trip.img))) {
        return true;
    }
    throw new Error("Invalid data!");
}

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
