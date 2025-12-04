// src/middlewares/uploadMiddleware.js
import multer from "multer";

const storage = multer.memoryStorage();

// "images" = nama field form-data, max 5 file (bisa kamu ubah)
export const uploadMultipleImages = multer({ storage }).array("images", 5);