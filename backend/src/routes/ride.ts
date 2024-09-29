import express from "express";
import rideController from "../controller/ride.js";
import { verifyTokenMiddleware } from "../library/token.js";

const router: express.Router = express.Router();

router.get("/", verifyTokenMiddleware, rideController.recentRides);
router.get("/availableRides", verifyTokenMiddleware, rideController.availableRides);
router.post("/create", verifyTokenMiddleware, rideController.createRide);
router.put("/presentOffer", verifyTokenMiddleware, rideController.presentOffer);
router.put("/acceptOffer", verifyTokenMiddleware, rideController.acceptOffer);
router.put("/startRide", verifyTokenMiddleware, rideController.startRide);
router.put("/completed", verifyTokenMiddleware, rideController.completed);

export default router;
