// src/services/adminUserService.js
import { db, admin } from "../firebase/firebaseAdmin.js";
import bcrypt from "bcrypt";
import {
  ADMIN_USERS_COLLECTION,
  mapAdminUserDoc,
} from "../models/adminUserModel.js";

const collectionName = ADMIN_USERS_COLLECTION;

export const adminUserService = {
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

  async createAdminUser({ name, email, password, role = "admin" }) {
    if (!db) throw new Error("Firestore is not initialized");

    const now = new Date();
    const passwordHash = await bcrypt.hash(password, 10);

    const docRef = await db.collection(collectionName).add({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role,
      isActive: true,
      createdAt: admin.firestore.Timestamp.fromDate(now),
      updatedAt: admin.firestore.Timestamp.fromDate(now),
    });

    const doc = await docRef.get();
    return mapAdminUserDoc(doc);
  },
};