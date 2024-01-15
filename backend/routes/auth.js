import express from "express";
import { login, refreshAccessToken, register, rejectRefreshToken } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshAccessToken);
router.post("/reject", rejectRefreshToken);

export default router;
