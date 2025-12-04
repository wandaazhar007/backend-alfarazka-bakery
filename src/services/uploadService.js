// src/services/uploadService.js
import { bucket } from "../firebase/firebaseAdmin.js";
import { v4 as uuidv4 } from "uuid";
import path from "path";

export const uploadService = {
  async uploadImages(files, folder = "products") {
    if (!files || files.length === 0) return [];

    const uploads = files.map(async (file) => {
      const ext = path.extname(file.originalname) || ".jpg";
      const fileName = `${folder}/${Date.now()}-${uuidv4()}${ext}`;

      const blob = bucket.file(fileName);

      // simpan buffer file ke Storage
      await blob.save(file.buffer, {
        contentType: file.mimetype,
        // tidak perlu public di sini, kita pakai signed URL
      });

      // buat signed URL yang bisa diakses dari frontend
      const [url] = await blob.getSignedUrl({
        action: "read",
        expires: "03-01-2035", // sesuaikan kebutuhan
      });

      return {
        fileName,
        url,
      };
    });

    return Promise.all(uploads);
  },
};