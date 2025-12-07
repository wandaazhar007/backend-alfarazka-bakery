import { Router } from "express";
import healthRouter from "./health.routes.js";
import productRouter from "./product.routes.js";
import uploadRouter from "./upload.routes.js";
import categoryRouter from "./category.routes.js";
import authRouter from "./auth.routes.js";
import adminUserRouter from "./adminUser.routes.js";

const router = Router();

router.use("/health", healthRouter);
router.use("/products", productRouter);
router.use("/upload", uploadRouter);
router.use("/categories", categoryRouter);
router.use("/auth", authRouter);

// route untuk admin users
// route for admin users

// Hasil akhir di HTTP: /api/admin-users/...
// Resulting endpoint at HTTP: /api/admin-users/...
router.use("/admin-users", adminUserRouter);

export default router;