import express from "express";
import userRoute from "./user.js";
import assetRoute from "./asset.js";
import rideRoute from "./ride.js";

const router: express.Router = express.Router();

router.use("/user", userRoute);
router.use("/asset", assetRoute);
router.use("/ride", rideRoute);

export default router;