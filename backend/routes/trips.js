import express from "express";
import { postTrip, getAllTrips, updateTrip, deleteTrip } from "../controllers/trip.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { restrictForAdminOrManager } from "../middlewares/restrict.js";

const router = express.Router();

router.post("/", verifyToken, restrictForAdminOrManager, postTrip);
router.get("/", getAllTrips);
router.put("/:id", verifyToken, updateTrip);
router.delete("/:id", verifyToken, restrictForAdminOrManager, deleteTrip);

export default router;
