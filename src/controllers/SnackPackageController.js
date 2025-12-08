import { snackPackageService } from "../services/snackPackageService.js";

export const SnackPackageController = {
  async list(req, res, next) {
    try {
      const page = Number(req.query.page || 1);
      const limit = Number(req.query.limit || 10);
      const search = req.query.search || "";
      const onlyActive = req.query.onlyActive !== "false"; // default true

      const result = await snackPackageService.listSnackPackages({
        page,
        limit,
        search,
        onlyActive,
      });

      return res.json({
        success: true,
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  },

  async getDetail(req, res, next) {
    try {
      const { id } = req.params;
      const pkg = await snackPackageService.getSnackPackageById(id);

      if (!pkg) {
        return res.status(404).json({
          success: false,
          message: "Paket snack tidak ditemukan.",
        });
      }

      return res.json({
        success: true,
        data: pkg,
      });
    } catch (err) {
      return next(err);
    }
  },

  async create(req, res, next) {
    try {
      const payload = req.body;

      const created = await snackPackageService.createSnackPackage(payload);

      return res.status(201).json({
        success: true,
        message: "Paket snack berhasil dibuat.",
        data: created,
      });
    } catch (err) {
      // kirim pesan jelas ke admin jika melanggar batas karakter
      if (err.statusCode === 400) {
        return res.status(400).json({
          success: false,
          message: err.message,
          errors: err.details || [],
        });
      }
      return next(err);
    }
  },

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const payload = req.body;

      const updated = await snackPackageService.updateSnackPackage(id, payload);

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: "Paket snack tidak ditemukan.",
        });
      }

      return res.json({
        success: true,
        message: "Paket snack berhasil diperbarui.",
        data: updated,
      });
    } catch (err) {
      if (err.statusCode === 400) {
        return res.status(400).json({
          success: false,
          message: err.message,
          errors: err.details || [],
        });
      }
      return next(err);
    }
  },

  async remove(req, res, next) {
    try {
      const { id } = req.params;

      const ok = await snackPackageService.deleteSnackPackage(id);
      if (!ok) {
        return res.status(404).json({
          success: false,
          message: "Paket snack tidak ditemukan.",
        });
      }

      return res.json({
        success: true,
        message: "Paket snack dinonaktifkan.",
      });
    } catch (err) {
      return next(err);
    }
  },
};