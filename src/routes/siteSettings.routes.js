import { Router } from "express";
import { SiteSettingsController } from "../controllers/siteSettingsController.js";
import { authAdmin } from "../middlewares/authAdmin.js";

const router = Router();

// Public endpoint untuk frontend website
router.get("/public", SiteSettingsController.getPublic);

// Admin only
router.get("/", authAdmin, SiteSettingsController.getAdmin);
router.put("/", authAdmin, SiteSettingsController.update);

export default router;