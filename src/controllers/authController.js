// src/controllers/authController.js
import { adminUserService } from "../services/adminUserService.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";

export const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "email dan password wajib diisi",
      });
    }

    const user = await adminUserService.findByEmail(email);
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Email atau password salah",
      });
    }

    const match = await bcrypt.compare(password, user.passwordHash || "");
    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Email atau password salah",
      });
    }

    const payload = {
      sub: user.id,
      role: user.role,
      email: user.email,
      name: user.name,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};