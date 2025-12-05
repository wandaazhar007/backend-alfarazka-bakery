// src/routes/auth.routes.js
import { Router } from "express";
import { loginAdmin } from "../controllers/authController.js";

const router = Router();

// POST /api/auth/login
router.post("/login", loginAdmin);

export default router;