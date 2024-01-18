import express from "express";
import { addToCart, getUserCart, removeFromCart } from "../controllers/cart.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { restrictForClient } from "../middlewares/restrict.js";

const router = express.Router();

router.post("/", verifyToken, restrictForClient, addToCart);
router.get("/", verifyToken, restrictForClient, getUserCart);
router.delete("/:tripId", verifyToken, restrictForClient, removeFromCart)

export default router;
