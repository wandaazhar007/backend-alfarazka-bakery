// src/models/adminUserModel.js

export const ADMIN_USERS_COLLECTION = "adminUsers";

export const mapAdminUserDoc = (doc) => {
  const data = doc.data();
  return {
    id: doc.id,
    name: data.name,
    email: data.email,
    passwordHash: data.passwordHash,
    role: data.role || "admin", // "admin" | "staff"
    isActive: data.isActive ?? true,
    createdAt: data.createdAt?.toDate?.().toISOString?.() || null,
    updatedAt: data.updatedAt?.toDate?.().toISOString?.() || null,
  };
};