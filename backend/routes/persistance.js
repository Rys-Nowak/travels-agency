import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { changePersistance, getPersistance } from "../controllers/persistance.controller.js";
import { restrictForAdmin } from '../middlewares/restrict.js';

const router = express.Router();

router.post("/", verifyToken, restrictForAdmin, changePersistance);
router.get("/", getPersistance);

export default router;
