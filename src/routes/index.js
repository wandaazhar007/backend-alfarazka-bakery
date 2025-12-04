// src/routes/index.js
import { Router } from "express";
import healthRouter from "./health.routes.js";
import productRouter from "./product.routes.js";
import uploadRouter from "./upload.routes.js";

const router = Router();

router.use("/health", healthRouter);
router.use("/products", productRouter);
router.use("/upload", uploadRouter);   // <— tambah ini

export default router;