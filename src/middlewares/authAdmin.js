// src/middlewares/authAdmin.js
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";

export const authAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";

    const [type, token] = authHeader.split(" ");

    if (type !== "Bearer" || !token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const payload = jwt.verify(token, JWT_SECRET);

    if (!payload || (payload.role !== "admin" && payload.role !== "staff")) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    // simpan info user di req untuk dipakai di controller kalau perlu
    req.user = {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      role: payload.role,
    };

    next();
  } catch (err) {
    console.error("authAdmin error:", err);
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};