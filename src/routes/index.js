// // src/routes/index.js
// import { Router } from "express";
// import healthRouter from "./health.routes.js";
// import productRouter from "./product.routes.js";
// import uploadRouter from "./upload.routes.js";
// import categoryRouter from "./category.routes.js";
// import authRouter from "./auth.routes.js";
// // import adminUserRoutes from "./adminUserRoutes.js";
// const router = Router();

// router.use("/health", healthRouter);
// router.use("/products", productRouter);
// router.use("/upload", uploadRouter);   // <— tambah ini
// router.use("/categories", categoryRouter);
// router.use("/auth", authRouter);
// // router.use("/admin-user", adminUserRoutes);


// export default router;


// src/routes/index.js
import { Router } from "express";
import healthRouter from "./health.routes.js";
import productRouter from "./product.routes.js";
import uploadRouter from "./upload.routes.js";
import categoryRouter from "./category.routes.js";
import authRouter from "./auth.routes.js";
import adminUserRouter from "./adminUser.routes.js"; // ✅ import baru

const router = Router();

router.use("/health", healthRouter);
router.use("/products", productRouter);
router.use("/upload", uploadRouter);
router.use("/categories", categoryRouter);
router.use("/auth", authRouter);

// ✅ route untuk admin users
// Hasil akhir di HTTP: /api/admin-users/...
router.use("/admin-users", adminUserRouter);

export default router;