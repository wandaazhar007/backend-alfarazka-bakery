// src/routes/upload.routes.js
import { Router } from "express";
import { uploadImages } from "../controllers/uploadController.js";
import { uploadMultipleImages } from "../middlewares/uploadMiddleware.js";

const router = Router();

// POST /api/upload/images
router.post("/images", uploadMultipleImages, uploadImages);

export default router;