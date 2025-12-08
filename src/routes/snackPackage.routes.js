// src/routes/snackPackage.routes.js
import { Router } from "express";
import { SnackPackageController } from "../controllers/SnackPackageController.js";

const snackPackageRouter = Router();

// GET /api/snack-packages?search=&page=&limit=&onlyActive=true
snackPackageRouter.get("/", SnackPackageController.list);

// GET /api/snack-packages/:id
snackPackageRouter.get("/:id", SnackPackageController.getDetail);

// POST /api/snack-packages
snackPackageRouter.post("/", SnackPackageController.create);

// PUT /api/snack-packages/:id
snackPackageRouter.put("/:id", SnackPackageController.update);

// DELETE /api/snack-packages/:id  (soft delete -> isActive=false)
snackPackageRouter.delete("/:id", SnackPackageController.remove);

export default snackPackageRouter;