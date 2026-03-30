import { siteSettingsService } from "../services/siteSettingsService.js";

export const SiteSettingsController = {
  async getPublic(req, res, next) {
    try {
      const data = await siteSettingsService.getPublicSiteSettings();

      return res.json({
        success: true,
        data,
      });
    } catch (err) {
      return next(err);
    }
  },

  async getAdmin(req, res, next) {
    try {
      const data = await siteSettingsService.getSiteSettings({
        createIfMissing: true,
      });

      return res.json({
        success: true,
        data,
      });
    } catch (err) {
      return next(err);
    }
  },

  async update(req, res, next) {
    try {
      const updated = await siteSettingsService.updateSiteSettings(req.body);

      return res.json({
        success: true,
        message: "Site settings berhasil diperbarui.",
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
};