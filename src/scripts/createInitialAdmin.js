// src/scripts/createInitialAdmin.js
import dotenv from "dotenv";
dotenv.config();

import "../firebase/firebaseAdmin.js"; // pastikan Firebase init
import { adminUserService } from "../services/adminUserService.js";

const run = async () => {
  try {
    const adminUser = await adminUserService.createAdminUser({
      name: "Super Admin",
      email: "admin@alfarazka.com",
      password: "000000",
      role: "admin",
    });

    console.log("Admin user created:");
    console.log({
      id: adminUser.id,
      email: adminUser.email,
      role: adminUser.role,
    });

    process.exit(0);
  } catch (err) {
    console.error("Error creating initial admin:", err);
    process.exit(1);
  }
};

run();