// src/routes/upload.routes.js
import { Router } from "express";
import { uploadImages } from "../controllers/uploadController.js";
import { uploadMultipleImages } from "../middlewares/uploadMiddleware.js";
import { authAdmin } from "../middlewares/authAdmin.js";

const router = Router();

// Admin only
router.post("/images", authAdmin, uploadMultipleImages, uploadImages);

export default router;