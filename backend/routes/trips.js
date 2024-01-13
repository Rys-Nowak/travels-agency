import express from "express";
import { postTrip, getAllTrips, updateTrip, deleteTrip } from "../controllers/trip.controller.js";

const router = express.Router();

router.post("/", postTrip);
router.get("/", getAllTrips);
router.put("/:id", updateTrip);
router.delete("/:id", deleteTrip);

export default router;
