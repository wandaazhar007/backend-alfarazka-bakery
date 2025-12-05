// src/routes/adminUserRoutes.js
import express from "express";
import { adminUserController } from "../controllers/adminUserController.js";
import { authAdmin } from "../middlewares/authAdmin.js";

const router = express.Router();

// Semua endpoint admin-user wajib login admin
router.use(authAdmin);

// GET /api/admin-users
router.get("/", adminUserController.list);

// GET /api/admin-users/:id
router.get("/:id", adminUserController.getById);

// POST /api/admin-users
router.post("/", adminUserController.create);

// PUT /api/admin-users/:id
router.put("/:id", adminUserController.update);

// DELETE /api/admin-users/:id
router.delete("/:id", adminUserController.remove);

export default router;