// src/controllers/uploadController.js
import { uploadService } from "../services/uploadService.js";

export const uploadImages = async (req, res, next) => {
  try {
    const files = req.files; // dari multer.array("images", ...)
    const folder = req.body.folder || "products";

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Tidak ada file image yang di-upload",
      });
    }

    const result = await uploadService.uploadImages(files, folder);

    res.status(201).json({
      success: true,
      data: result, // array { fileName, url }
    });
  } catch (err) {
    next(err);
  }
};