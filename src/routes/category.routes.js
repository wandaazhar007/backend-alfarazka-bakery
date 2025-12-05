// src/routes/category.routes.js
import { Router } from "express";
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import { authAdmin } from "../middlewares/authAdmin.js";

const router = Router();

// Public (kalau mau dipakai buat filter di website pelanggan)
router.get("/", getCategories);
router.get("/:id", getCategoryById);

// Admin only
router.post("/", authAdmin, createCategory);
router.put("/:id", authAdmin, updateCategory);
router.delete("/:id", authAdmin, deleteCategory);

export default router;