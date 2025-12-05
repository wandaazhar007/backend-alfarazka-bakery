// // src/services/adminUserService.js
// import { db, admin } from "../firebase/firebaseAdmin.js";
// import bcrypt from "bcrypt";
// import {
//   ADMIN_USERS_COLLECTION,
//   mapAdminUserDoc,
// } from "../models/adminUserModel.js";

// const collectionName = ADMIN_USERS_COLLECTION;

// export const adminUserService = {
//   async findByEmail(email) {
//     if (!db) throw new Error("Firestore is not initialized");

//     const snapshot = await db
//       .collection(collectionName)
//       .where("email", "==", email.toLowerCase())
//       .limit(1)
//       .get();

//     if (snapshot.empty) return null;

//     return mapAdminUserDoc(snapshot.docs[0]);
//   },

//   async createAdminUser({ name, email, password, role = "admin" }) {
//     if (!db) throw new Error("Firestore is not initialized");

//     const now = new Date();
//     const passwordHash = await bcrypt.hash(password, 10);

//     const docRef = await db.collection(collectionName).add({
//       name,
//       email: email.toLowerCase(),
//       passwordHash,
//       role,
//       isActive: true,
//       createdAt: admin.firestore.Timestamp.fromDate(now),
//       updatedAt: admin.firestore.Timestamp.fromDate(now),
//     });

//     const doc = await docRef.get();
//     return mapAdminUserDoc(doc);
//   },
// };


// src/services/adminUserService.js
import { db, admin } from "../firebase/firebaseAdmin.js";
import bcrypt from "bcrypt";
import {
  ADMIN_USERS_COLLECTION,
  mapAdminUserDoc,
} from "../models/adminUserModel.js";

const collectionName = ADMIN_USERS_COLLECTION;

export const adminUserService = {
  /**
   * Dipakai untuk login (auth)
   */
  async findByEmail(email) {
    if (!db) throw new Error("Firestore is not initialized");

    const snapshot = await db
      .collection(collectionName)
      .where("email", "==", email.toLowerCase())
      .limit(1)
      .get();

    if (snapshot.empty) return null;

    return mapAdminUserDoc(snapshot.docs[0]);
  },

  /**
   * Create admin user (dipakai script awal & nanti endpoint POST /api/admin-users)
   */
  async createAdminUser({ name, email, password, role = "admin" }) {
    if (!db) throw new Error("Firestore is not initialized");

    if (!name || !email || !password) {
      throw new Error("Nama, email, dan password wajib diisi");
    }

    const emailLower = email.toLowerCase().trim();

    // Cek apakah email sudah terdaftar
    const existingSnapshot = await db
      .collection(collectionName)
      .where("email", "==", emailLower)
      .limit(1)
      .get();

    if (!existingSnapshot.empty) {
      throw new Error("Email sudah terdaftar sebagai admin/staff");
    }

    const now = new Date();
    const passwordHash = await bcrypt.hash(password, 10);

    const docRef = await db.collection(collectionName).add({
      name,
      email: emailLower,
      passwordHash,
      role,
      isActive: true,
      createdAt: admin.firestore.Timestamp.fromDate(now),
      updatedAt: admin.firestore.Timestamp.fromDate(now),
    });

    const doc = await docRef.get();
    return mapAdminUserDoc(doc);
  },

  /**
   * List semua admin/staff yang masih aktif
   * Untuk endpoint: GET /api/admin-users
   */
  async listAdminUsers() {
    if (!db) {
      console.warn("Firestore is not initialized. Returning empty users list.");
      return [];
    }

    const snapshot = await db
      .collection(collectionName)
      .where("isActive", "==", true)
      .get();

    return snapshot.docs.map((doc) => mapAdminUserDoc(doc));
  },

  /**
   * Get user by id
   * Untuk endpoint: GET /api/admin-users/:id
   */
  async getAdminUserById(id) {
    if (!db) throw new Error("Firestore is not initialized");

    const doc = await db.collection(collectionName).doc(id).get();
    if (!doc.exists) return null;

    return mapAdminUserDoc(doc);
  },

  /**
   * Update nama/role/password
   * Untuk endpoint: PUT /api/admin-users/:id
   */
  async updateAdminUser(id, { name, role, password }) {
    if (!db) throw new Error("Firestore is not initialized");

    const docRef = db.collection(collectionName).doc(id);
    const existing = await docRef.get();
    if (!existing.exists) {
      return null;
    }

    const now = new Date();
    const dataUpdate = {};

    if (name !== undefined) dataUpdate.name = name;
    if (role !== undefined) dataUpdate.role = role;

    if (password) {
      const passwordHash = await bcrypt.hash(password, 10);
      dataUpdate.passwordHash = passwordHash;
    }

    dataUpdate.updatedAt = admin.firestore.Timestamp.fromDate(now);

    await docRef.update(dataUpdate);

    const updatedDoc = await docRef.get();
    return mapAdminUserDoc(updatedDoc);
  },

  /**
   * Soft delete user (isActive = false)
   * Untuk endpoint: DELETE /api/admin-users/:id
   */
  async deleteAdminUser(id) {
    if (!db) throw new Error("Firestore is not initialized");

    const docRef = db.collection(collectionName).doc(id);
    const existing = await docRef.get();
    if (!existing.exists) {
      return false;
    }

    const now = new Date();

    await docRef.update({
      isActive: false,
      deletedAt: admin.firestore.Timestamp.fromDate(now),
      updatedAt: admin.firestore.Timestamp.fromDate(now),
    });

    return true;
  },
};