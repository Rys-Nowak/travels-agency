import express from "express";
import { addToCart, getUserCart, removeFromCart } from "../controllers/cart.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, addToCart);
router.get("/", verifyToken, getUserCart);
router.delete("/:tripId", verifyToken, removeFromCart)

export default router;
