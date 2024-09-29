import express from "express";
import userController from "../controller/user.js";
import { verifyTokenMiddleware } from "../library/token.js";

const router: express.Router = express.Router();

router.post("/signin", userController.signIn);
router.post("/signup", userController.signUp);
router.put(
  "/updateProfilePic",
  verifyTokenMiddleware,
  userController.updateProfilePic
);
router.post("/logout", verifyTokenMiddleware, userController.logout);
router.get(
  "/getUserByToken",
  verifyTokenMiddleware,
  userController.getUserByToken
);
router.get(
  "/getUserById/:userId",
  verifyTokenMiddleware,
  userController.getUserById
);
router.put("/updateLocation", verifyTokenMiddleware, userController.updateDriverLocation);
router.put("/rateDriver", verifyTokenMiddleware, userController.rateDriver);
router.put("/status", verifyTokenMiddleware, userController.updateDriverStatus);
router.post("/getDrivers", verifyTokenMiddleware, userController.getDrivers);

export default router;
