//src/services/snackPackageService.js
import { db, admin } from "../firebase/firebaseAdmin.js";
import {
  SNACK_PACKAGES_COLLECTION,
  mapSnackPackageDoc,
} from "../models/snackPackageModel.js";

const collectionName = SNACK_PACKAGES_COLLECTION;

// --- VALIDATION HELPERS ---

function validateLength(fieldValue, max, fieldLabel, errors) {
  if (typeof fieldValue === "string") {
    const len = fieldValue.trim().length;
    if (len > max) {
      errors.push(
        `${fieldLabel} tidak boleh lebih dari ${max} karakter (saat ini ${len} karakter).`
      );
    }
  }
}

function validateSnackPackagePayload(payload, { isUpdate = false } = {}) {
  const errors = [];

  // batas karakter:
  // name        <= 30
  // shortDesc   <= 60
  // fitFor      <= 60
  // point1–3    <= 60
  if (!isUpdate || payload.name !== undefined) {
    validateLength(payload.name, 30, "Nama paket", errors);
  }

  if (!isUpdate || payload.shortDescription !== undefined) {
    validateLength(
      payload.shortDescription,
      60,
      "Deskripsi singkat",
      errors
    );
  }

  if (!isUpdate || payload.fitFor !== undefined) {
    validateLength(payload.fitFor, 60, "Cocok untuk", errors);
  }

  if (!isUpdate || payload.point1 !== undefined) {
    validateLength(payload.point1, 60, "Poin 1", errors);
  }

  if (!isUpdate || payload.point2 !== undefined) {
    validateLength(payload.point2, 60, "Poin 2", errors);
  }

  if (!isUpdate || payload.point3 !== undefined) {
    validateLength(payload.point3, 60, "Poin 3", errors);
  }

  if (errors.length > 0) {
    const err = new Error("Validasi data paket snack gagal.");
    err.statusCode = 400;
    err.details = errors;
    throw err;
  }
}

// --- SERVICE IMPLEMENTATION ---

export const snackPackageService = {
  /**
   * List paket snack.
   *
   * options:
   * - page, limit
   * - search
   * - status: "all" | "active" | "inactive"
   * - onlyActive: boolean (default true, dipakai untuk frontend publik)
   */
  async listSnackPackages({
    search,
    onlyActive = true,
    status,
    page = 1,
    limit = 10,
  } = {}) {
    if (!db) throw new Error("Firestore is not initialized");

    let query = db.collection(collectionName);

    // --- FILTER STATUS ---
    // ADMIN bisa kirim status=all | active | inactive
    // FRONTEND publik pakai onlyActive=true
    const normalizedStatus =
      typeof status === "string" ? status.toLowerCase() : undefined;

    if (normalizedStatus === "active") {
      // khusus aktif
      query = query.where("isActive", "==", true);
      onlyActive = false; // supaya di bawah tidak difilter lagi
    } else if (normalizedStatus === "inactive") {
      // khusus non-aktif
      query = query.where("isActive", "==", false);
      onlyActive = false;
    } else if (normalizedStatus === "all") {
      // semua status -> tidak pakai filter isActive
      onlyActive = false;
    }

    // fallback: kalau status tidak dikirim, gunakan onlyActive (default true)
    if (onlyActive) {
      query = query.where("isActive", "==", true);
    }

    const snapshot = await query.get();

    let items = snapshot.docs.map(mapSnackPackageDoc);

    // --- FILTER SEARCH (di memory) ---
    if (search) {
      const s = String(search).toLowerCase();
      items = items.filter((pkg) => {
        const name = pkg.name || "";
        const shortDesc = pkg.shortDescription || "";
        const fitFor = pkg.fitFor || "";
        return (
          name.toLowerCase().includes(s) ||
          shortDesc.toLowerCase().includes(s) ||
          fitFor.toLowerCase().includes(s)
        );
      });
    }

    // sort dari terbaru (createdAt yang sudah di-map bisa berupa string/timestamp)
    items.sort((a, b) => {
      const ca = a.createdAt || "";
      const cb = b.createdAt || "";
      return String(cb).localeCompare(String(ca));
    });

    // --- PAGINATION SEDERHANA DI MEMORY ---
    page = Number(page) || 1;
    limit = Number(limit) || 10;
    if (page < 1) page = 1;
    if (limit < 1) limit = 10;

    const total = items.length;
    const totalPages = limit ? Math.max(1, Math.ceil(total / limit)) : 1;
    const start = (page - 1) * limit;
    const pagedItems = items.slice(start, start + limit);

    return {
      items: pagedItems,
      total,
      page,
      limit,
      totalPages,
    };
  },

  async getSnackPackageById(id) {
    if (!db) throw new Error("Firestore is not initialized");

    const doc = await db.collection(collectionName).doc(id).get();
    if (!doc.exists) return null;

    return mapSnackPackageDoc(doc);
  },

  async createSnackPackage(payload) {
    if (!db) throw new Error("Firestore is not initialized");

    // lempar error ke admin jika melanggar aturan panjang
    validateSnackPackagePayload(payload, { isUpdate: false });

    const now = new Date();

    const docRef = await db.collection(collectionName).add({
      name: payload.name?.trim() || "",
      shortDescription: payload.shortDescription?.trim() || "",
      price: Number(payload.price || 0),
      fitFor: payload.fitFor?.trim() || "",
      point1: payload.point1?.trim() || "",
      point2: payload.point2?.trim() || "",
      point3: payload.point3?.trim() || "",
      isActive: payload.isActive ?? true,
      createdAt: admin.firestore.Timestamp.fromDate(now),
      updatedAt: admin.firestore.Timestamp.fromDate(now),
    });

    const doc = await docRef.get();
    return mapSnackPackageDoc(doc);
  },

  async updateSnackPackage(id, payload) {
    if (!db) throw new Error("Firestore is not initialized");

    const docRef = db.collection(collectionName).doc(id);
    const existing = await docRef.get();
    if (!existing.exists) return null;

    // validasi hanya field yang dikirim
    validateSnackPackagePayload(payload, { isUpdate: true });

    const now = new Date();
    const updateData = {};

    if (payload.name !== undefined) {
      updateData.name = payload.name.trim();
    }
    if (payload.shortDescription !== undefined) {
      updateData.shortDescription = payload.shortDescription.trim();
    }
    if (payload.price !== undefined) {
      updateData.price = Number(payload.price);
    }
    if (payload.fitFor !== undefined) {
      updateData.fitFor = payload.fitFor.trim();
    }
    if (payload.point1 !== undefined) {
      updateData.point1 = payload.point1.trim();
    }
    if (payload.point2 !== undefined) {
      updateData.point2 = payload.point2.trim();
    }
    if (payload.point3 !== undefined) {
      updateData.point3 = payload.point3.trim();
    }
    if (payload.isActive !== undefined) {
      updateData.isActive = Boolean(payload.isActive);
    }

    updateData.updatedAt = admin.firestore.Timestamp.fromDate(now);

    await docRef.update(updateData);

    const updatedDoc = await docRef.get();
    return mapSnackPackageDoc(updatedDoc);
  },

  async deleteSnackPackage(id) {
    if (!db) throw new Error("Firestore is not initialized");

    const docRef = db.collection(collectionName).doc(id);
    const existing = await docRef.get();
    if (!existing.exists) return false;

    const now = new Date();

    await docRef.update({
      isActive: false,
      deletedAt: admin.firestore.Timestamp.fromDate(now),
      updatedAt: admin.firestore.Timestamp.fromDate(now),
    });

    return true;
  },
};