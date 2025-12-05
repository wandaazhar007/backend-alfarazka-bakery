// src/controllers/adminUserController.js
import { adminUserService } from "../services/adminUserService.js";

export const adminUserController = {
  // GET /api/admin-users
  async list(req, res, next) {
    try {
      const users = await adminUserService.listAdminUsers();
      return res.json({
        success: true,
        data: {
          users,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/admin-users/:id
  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const user = await adminUserService.getAdminUserById(id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User tidak ditemukan",
        });
      }

      return res.json({
        success: true,
        data: {
          user,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  // POST /api/admin-users
  async create(req, res, next) {
    try {
      const { name, email, password, role } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: "Nama, email, dan password wajib diisi",
        });
      }

      const user = await adminUserService.createAdminUser({
        name,
        email,
        password,
        role,
      });

      return res.status(201).json({
        success: true,
        message: "User admin berhasil dibuat",
        data: {
          user,
        },
      });
    } catch (err) {
      // error duplicate email dari service
      if (err.message && err.message.includes("Email sudah terdaftar")) {
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }
      next(err);
    }
  },

  // PUT /api/admin-users/:id
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { name, role, password } = req.body;

      const updated = await adminUserService.updateAdminUser(id, {
        name,
        role,
        password,
      });

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: "User tidak ditemukan",
        });
      }

      return res.json({
        success: true,
        message: "User admin berhasil diperbarui",
        data: {
          user: updated,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  // DELETE /api/admin-users/:id
  async remove(req, res, next) {
    try {
      const { id } = req.params;
      const ok = await adminUserService.deleteAdminUser(id);

      if (!ok) {
        return res.status(404).json({
          success: false,
          message: "User tidak ditemukan",
        });
      }

      return res.json({
        success: true,
        message: "User admin berhasil dihapus",
      });
    } catch (err) {
      next(err);
    }
  },
};