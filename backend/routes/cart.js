import express from "express";
import { addToCart, getUserCart, removeFromCart } from "../controllers/cart.controller.js";

const router = express.Router();

router.post("/", addToCart);
router.get("/", getUserCart);
router.delete("/", removeFromCart)

export default router;
