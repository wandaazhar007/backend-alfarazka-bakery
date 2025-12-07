import { Router } from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { authAdmin } from "../middlewares/authAdmin.js";

const router = Router();

// Public (frontend pelanggan)
// Public (for customer website)
router.get("/", getProducts);
router.get("/:id", getProductById);

// Admin only
router.post("/", authAdmin, createProduct);
router.put("/:id", authAdmin, updateProduct);
router.delete("/:id", authAdmin, deleteProduct);

export default router;