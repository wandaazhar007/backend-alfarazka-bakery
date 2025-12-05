// src/routes/index.js
import { Router } from "express";
import healthRouter from "./health.routes.js";
import productRouter from "./product.routes.js";
import uploadRouter from "./upload.routes.js";
import categoryRouter from "./category.routes.js";
import authRouter from "./auth.routes.js";

const router = Router();

router.use("/health", healthRouter);
router.use("/products", productRouter);
router.use("/upload", uploadRouter);   // <— tambah ini
router.use("/categories", categoryRouter);
router.use("/auth", authRouter);


export default router;