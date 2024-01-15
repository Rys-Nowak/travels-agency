import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();
const jwtSecret = process.env.JWT_SECRET;

export function verifyToken(req, res, next) {
    if (req.headers?.authorization?.startsWith("Bearer ")) {
        const token = req.headers.authorization.split("Bearer ")[1];
        try {
            const user = jwt.verify(token, jwtSecret);
            if (user) {
                req["currentUser"] = user.username;
                req["userRoles"] = user.roles;
                next();
            } else {
                throw new Error("Access denied");
            }
        } catch (error) {
            res.status(401).send({
                message: error.message,
            });
        }
    } else {
        res.status(401).send({
            message: "Invalid token",
        });
    }
}
