import express from "express";
import assetController from "../controller/asset.js";
import upload from "../library/multer.js";
import { verifyTokenMiddleware } from "../library/token.js";

const router: express.Router = express.Router();

router.post(
  "/upload",
  verifyTokenMiddleware,
  upload.single("file"),
  assetController.uploadAsset
);

export default router;