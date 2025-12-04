// src/controllers/categoryController.js
import { categoryService } from "../services/categoryService.js";

export const getCategories = async (req, res, next) => {
  try {
    const { search } = req.query;

    const categories = await categoryService.listCategories({ search });

    res.json({
      success: true,
      data: categories,
    });
  } catch (err) {
    next(err);
  }
};

export const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await categoryService.getCategoryById(id);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    res.json({
      success: true,
      data: category,
    });
  } catch (err) {
    next(err);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "name wajib diisi",
      });
    }

    const category = await categoryService.createCategory({
      name,
      description,
    });

    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (err) {
    next(err);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updated = await categoryService.updateCategory(id, req.body);
    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    res.json({
      success: true,
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const ok = await categoryService.deleteCategory(id);
    if (!ok) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    res.json({
      success: true,
      message: "Category deactivated (soft delete)",
    });
  } catch (err) {
    next(err);
  }
};