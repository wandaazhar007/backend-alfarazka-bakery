// src/routes/product.routes.js
import { Router } from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = Router();

// GET /api/products -> list (support ?search=&categoryId=)
router.get("/", getProducts);

// GET /api/products/:id -> detail
router.get("/:id", getProductById);

// POST /api/products -> create
router.post("/", createProduct);

// PUT /api/products/:id -> update
router.put("/:id", updateProduct);

// DELETE /api/products/:id -> soft delete
router.delete("/:id", deleteProduct);

export default router;