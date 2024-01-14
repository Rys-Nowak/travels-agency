import { db } from "../config.js";
import { validateCartElement } from "../helpers/validation.js";

const cartCollection = db.collection("cart");

export function addToCart(req, res) {
    const cartElement = {
        username: "test",
        tripId: req.body.tripId
    }
    try {
        validateCartElement(cartElement);
    } catch (err) {
        res.status(400).send({ message: err.message });
        return;
    }
    cartCollection
        .doc(`${cartElement.username}-${cartElement.tripId}`)
        .set(cartElement)
        .then(() => {
            res.status(201).send(cartElement);
        })
        .catch((err) => {
            res
                .status(500)
                .send({ message: err.message });
        });
}

export function getUserCart(req, res) {
    const username = "test";
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
    const tripId = req.params.id;
    const username = "test";
    try {
        validateId(tripId);
    } catch (err) {
        res.status(400).send({ message: err.message });
        return;
    }
    cartCollection
        .doc(`${username}-${tripId}`)
        .get()
        .then((docSnap) => {
            if (!docSnap.exists) {
                res.status(404).send({ message: "Trip not found" });
            } else {
                cartCollection
                    .doc(`${username}-${tripId}`)
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
