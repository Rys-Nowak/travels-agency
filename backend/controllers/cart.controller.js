import { db } from "../config.js";
import { validateCartElement, validateId } from "../helpers/validation.js";

const cartCollection = db.collection("cart");

export function addToCart(req, res) {
    const cartElement = {
        username: req.currentUser,
        tripId: req.body.tripId
    }
    try {
        validateCartElement(cartElement);
    } catch (err) {
        res.status(400).send({ message: err.message });
        return;
    }
    cartCollection
        .add(cartElement)
        .then(() => {
            res.status(201).send(cartElement);
        })
        .catch((err) => {
            res.status(500).send({ message: err.message });
        });
}

export function getUserCart(req, res) {
    const username = req.currentUser;
    cartCollection
        .where("username", "==", username)
        .get()
        .then(snapshot => {
            Promise.all(snapshot.docs.map((doc) => {
                const tripId = doc.data().tripId;
                return db.collection("trips")
                    .doc(tripId)
                    .get()
                    .then(doc => doc.data());
            })).then((trips) => {
                res.send(trips);
            }).catch((err) => {
                res.status(500).send({ message: err.message });
            });
        })
        .catch((err) => {
            res.status(500).send({ message: err.message });
        });
}

export function removeFromCart(req, res) {
    const tripId = req.params.tripId;
    const username = req.currentUser;
    try {
        validateId(tripId);
    } catch (err) {
        res.status(400).send({ message: err.message });
        return;
    }
    cartCollection
        .where("username", "==", username)
        .where("tripId", "==", tripId)
        .limit(1)
        .get()
        .then((querySnap) => {
            querySnap.forEach((doc) => doc.ref.delete())
            res.sendStatus(204);
        })
        .catch((err) => {
            res.status(500).send({ message: err.message });
        })
}
