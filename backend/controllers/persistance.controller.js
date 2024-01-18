import { validatePersistanceMode } from "../helpers/validation.js";
import { db } from "../config.js";

export function changePersistance(req, res) {
    try {
        validatePersistanceMode(req.body.mode);
    } catch (err) {
        res.status(400).send({ message: err.message });
        return;
    }
    db.collection("persistance")
        .doc("0")
        .set({ mode: req.body.mode })
        .then(() => res.send({ mode: req.body.mode }))
        .catch((err) => {
            res.status(500).send({ message: err.message });
        });
}

export function getPersistance(req, res) {
    db.collection("persistance")
        .doc("0")
        .get()
        .then((docSnap) => res.send(docSnap.data()))
        .catch((err) => {
            res.status(500).send({ message: err.message });
        });
}
