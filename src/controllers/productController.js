// src/controllers/productController.js
import { productService } from "../services/productService.js";

export const getProducts = async (req, res, next) => {
  try {
    const { search, categoryId, page, limit } = req.query;

    // default pagination
    const pageNumber = Number(page) > 0 ? Number(page) : 1;
    const pageSize =
      Number(limit) > 0 && Number(limit) <= 100 ? Number(limit) : 12;

    // ambil semua produk yang sudah difilter search + kategori
    const allProducts = await productService.listProducts({
      search,
      categoryId,
    });

    const total = allProducts.length;
    const totalPages = total > 0 ? Math.ceil(total / pageSize) : 1;

    const startIndex = (pageNumber - 1) * pageSize;
    const pagedProducts = allProducts.slice(
      startIndex,
      startIndex + pageSize
    );

    res.json({
      success: true,
      data: pagedProducts,
      pagination: {
        page: pageNumber,
        limit: pageSize,
        total,
        totalPages,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      categoryId,
      categoryName,
      imageUrl,
      imageUrls,
    } = req.body;

    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: "name dan price wajib diisi",
      });
    }

    const product = await productService.createProduct({
      name,
      description: description || "",
      price: Number(price),
      categoryId: categoryId || "",
      categoryName: categoryName || "",
      imageUrl: imageUrl || "",
      imageUrls: imageUrls || [],
    });

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updated = await productService.updateProduct(id, req.body);

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.json({
      success: true,
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const ok = await productService.deleteProduct(id);

    if (!ok) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.json({
      success: true,
      message: "Product deactivated (soft delete)",
    });
  } catch (err) {
    next(err);
  }
};