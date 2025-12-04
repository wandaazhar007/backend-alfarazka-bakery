// src/routes/category.routes.js
import { Router } from "express";
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

const router = Router();

// GET /api/categories -> list (support ?search=)
router.get("/", getCategories);

// GET /api/categories/:id -> detail kategori
router.get("/:id", getCategoryById);

// POST /api/categories -> buat kategori baru
router.post("/", createCategory);

// PUT /api/categories/:id -> update kategori
router.put("/:id", updateCategory);

// DELETE /api/categories/:id -> soft delete kategori
router.delete("/:id", deleteCategory);

export default router;