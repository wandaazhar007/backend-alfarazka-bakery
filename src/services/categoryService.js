// src/services/categoryService.js
import { db, admin } from "../firebase/firebaseAdmin.js";
import { slugify } from "../utils/slugify.js";

const collectionName = "categories";

export const categoryService = {
  // List kategori + optional search
  async listCategories({ search } = {}) {
    if (!db) {
      console.warn("Firestore is not initialized. Returning empty category list.");
      return [];
    }

    let query = db.collection(collectionName).where("isActive", "==", true);

    const snapshot = await query.get();

    let categories = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.().toISOString?.() || null,
        updatedAt: data.updatedAt?.toDate?.().toISOString?.() || null,
      };
    });

    // search sederhana (untuk live search di admin/website, kalau mau)
    if (search) {
      const s = search.toLowerCase();
      categories = categories.filter((c) => {
        const name = c.name?.toLowerCase() || "";
        const desc = c.description?.toLowerCase() || "";
        return name.includes(s) || desc.includes(s);
      });
    }

    return categories;
  },

  async getCategoryById(id) {
    if (!db) {
      console.warn("Firestore is not initialized. getCategoryById returns null.");
      return null;
    }

    const doc = await db.collection(collectionName).doc(id).get();
    if (!doc.exists) return null;

    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate?.().toISOString?.() || null,
      updatedAt: data.updatedAt?.toDate?.().toISOString?.() || null,
    };
  },

  async createCategory({ name, description }) {
    if (!db) {
      throw new Error("Firestore is not initialized");
    }

    const now = new Date();
    const slug = slugify(name);

    const docRef = await db.collection(collectionName).add({
      name,
      slug,
      description: description || "",
      isActive: true,
      createdAt: admin.firestore.Timestamp.fromDate(now),
      updatedAt: admin.firestore.Timestamp.fromDate(now),
    });

    const doc = await docRef.get();
    const data = doc.data();

    return {
      id: doc.id,
      ...data,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };
  },

  async updateCategory(id, payload) {
    if (!db) {
      throw new Error("Firestore is not initialized");
    }

    const docRef = db.collection(collectionName).doc(id);
    const existing = await docRef.get();
    if (!existing.exists) {
      return null;
    }

    const now = new Date();
    const dataUpdate = {};

    if (payload.name) {
      dataUpdate.name = payload.name;
      dataUpdate.slug = slugify(payload.name);
    }

    if (payload.description !== undefined) {
      dataUpdate.description = payload.description;
    }

    if (payload.isActive !== undefined) {
      dataUpdate.isActive = payload.isActive;
    }

    dataUpdate.updatedAt = admin.firestore.Timestamp.fromDate(now);

    await docRef.update(dataUpdate);

    const updatedDoc = await docRef.get();
    const updatedData = updatedDoc.data();

    return {
      id: updatedDoc.id,
      ...updatedData,
      createdAt: updatedData.createdAt?.toDate?.().toISOString?.() || null,
      updatedAt: now.toISOString(),
    };
  },

  async deleteCategory(id) {
    if (!db) {
      throw new Error("Firestore is not initialized");
    }

    const docRef = db.collection(collectionName).doc(id);
    const existing = await docRef.get();
    if (!existing.exists) {
      return false;
    }

    const now = new Date();

    // soft delete
    await docRef.update({
      isActive: false,
      deletedAt: admin.firestore.Timestamp.fromDate(now),
      updatedAt: admin.firestore.Timestamp.fromDate(now),
    });

    return true;
  },
};