import multer from "multer";

const storage = multer.memoryStorage();

// "images" = form-data field name, max 5 files (adjust as needed)
export const uploadMultipleImages = multer({ storage }).array("images", 5);