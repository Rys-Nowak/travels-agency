import express from "express";
import { getCurrentUser } from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/current", verifyToken, getCurrentUser);

export default router;
