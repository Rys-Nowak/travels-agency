import { db } from "../config.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { validateId, validateUser, validateUsername } from "../helpers/validation.js";

dotenv.config();
const jwtSecret = process.env.JWT_SECRET;
const usersCollection = db.collection("users");
const refreshCollection = db.collection("refresh");
const rolesCollection = db.collection("roles");

export function register(req, res) {
    // validate, hash pass, add user, add role, return user
    const user = {
        username: req.body.username,
        password: req.body.password
    }
    try {
        validateUser(user);
    } catch (err) {
        res.status(400).send({ message: err.message });
        return;
    }
    usersCollection.doc(user.username)
        .get().then(checkUsername(res, user)).catch((err) => {
            res.status(500).send({ message: err.message });
        }).catch((err) => {
            res.status(500).send({ message: err.message });
        });
}

function checkUsername(res, user) {
    return docSnap => {
        if (docSnap.exists) {
            res.status(409).send({ message: "User already exists" });
            return;
        }
        bcrypt.hash(user.password, 10).then(createUser(user, res)).catch((err) => {
            res.status(500).send({ message: err.message });
        });
    };
}

function createUser(user, res) {
    return (hash) => {
        usersCollection.doc(user.username)
            .set({
                username: user.username,
                passwordHash: hash
            })
            .then(setRole(user, res)).catch((err) => {
                res.status(500).send({ message: err.message });
            });
    };
}

function setRole(user, res) {
    return () => {
        const role = "client";
        rolesCollection.doc(user.username + role)
            .set({
                username: user.username,
                role: role
            })
            .then(() => {
                res.status(201).send({
                    username: user.username,
                    role: role
                });
            }).catch((err) => {
                res.status(500).send({ message: err.message });
            });
    };
}

export function login(req, res) {
    // validate, check user, create tokens, save refresh, return both tokens
    const user = {
        username: req.body.username,
        password: req.body.password
    }
    try {
        validateUser(user);
    } catch (err) {
        res.status(400).send({ message: err.message });
        return;
    }
    usersCollection.doc(user.username).get()
        .then(comparePasswords(res, user)).catch((err) => {
            res.status(500).send({ message: err.message });
        });
}

function comparePasswords(res, user) {
    return (userSnap) => {
        if (!userSnap.exists) {
            res.status(404).send({ message: "User not found" });
            return;
        }
        const userData = userSnap.data();
        bcrypt.compare(user.password, userData.passwordHash)
            .then(getRoles(res, user)).catch((err) => {
                res.status(500).send({ message: err.message });
            });
    };
}

function getRoles(res, user) {
    return (decryptResult) => {
        if (!decryptResult) {
            res.status(401).send({ message: "Access denied" });
            return;
        }
        rolesCollection.where("username", "==", user.username)
            .get()
            .then((rolesSnap) => rolesSnap.docs.map((el) => el.data().role))
            .then(sendTokens(user, res)).catch((err) => {
                res.status(500).send({ message: err.message });
            });
    };
}

function sendTokens(user, res) {
    return (roles) => {
        const token = jwt.sign({
            username: user.username,
            roles: roles
        }, jwtSecret, { expiresIn: 10 }); // 1 min
        const refresh = crypto.randomUUID().toString();
        refreshCollection.doc(refresh).set({ username: user.username })
            .then(() => {
                res.send(
                    { token: "JWT " + token, refresh: refresh }
                );
            }).catch((err) => {
                res.status(500).send({ message: err.message });
            });
    };
}

export function refreshAccessToken(req, res) {
    // if verify token, create new access, save to refresh, return new access
    const username = req.body.username;
    const refresh = req.body.refresh;
    try {
        validateUsername(username);
        validateId(refresh);
    } catch (err) {
        res.status(400).send({ message: err.message });
        return;
    }
    refreshCollection.doc(refresh).get()
        .then((docSnap) => {
            if (!docSnap.exists || docSnap.data().username !== username) {
                res.status(401).send({ message: "Invalid credentials" });
                return;
            }
            rolesCollection.where("username", "==", username)
                .get()
                .then((rolesSnap) => rolesSnap.docs.map((el) => el.data().role))
                .then((roles) => {
                    const token = jwt.sign({
                        username: username,
                        roles: roles
                    }, jwtSecret, { expiresIn: 10 }); // 1 min
                    res.send({ token: "JWT: " + token });
                });
        })
        .catch((err) => {
            res.status(500).send({ message: err.message });
        });
}

export function rejectRefreshToken(req, res) {
    // if exists, delete refresh
    const refresh = req.body.refresh;
    try {
        validateId(refresh);
    } catch (err) {
        res.status(400).send({ message: err.message });
        return;
    }
    refreshCollection.doc(refresh).get()
        .then((docSnap) => {
            if (!docSnap.exists) {
                res.status(404).send({ message: "Refresh token not found" });
                return;
            }
            refreshCollection.doc(refresh).delete().then(() => {
                res.sendStatus(204);
            })
        })
        .catch((err) => {
            res.status(500).send({ message: err.message });
        });
}
