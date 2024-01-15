import express from "express";
import { postTrip, getAllTrips, updateTrip, deleteTrip } from "../controllers/trip.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { restrict } from "../middlewares/restrict.js";

const router = express.Router();

router.post("/", verifyToken, restrict, postTrip);
router.get("/", getAllTrips);
router.put("/:id", verifyToken, updateTrip);
router.delete("/:id", verifyToken, restrict, deleteTrip);

export default router;
