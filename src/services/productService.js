// // src/services/productService.js
// import { db, admin } from "../firebase/firebaseAdmin.js";
// import { slugify } from "../utils/slugify.js";

// const collectionName = "products";

// export const productService = {
//   // List produk + optional search & category
//   async listProducts({ search, categoryId } = {}) {
//     if (!db) {
//       console.warn("Firestore is not initialized. Returning empty product list.");
//       return [];
//     }

//     let query = db.collection(collectionName).where("isActive", "==", true);

//     if (categoryId) {
//       query = query.where("categoryId", "==", categoryId);
//     }

//     const snapshot = await query.get();

//     let products = snapshot.docs.map((doc) => {
//       const data = doc.data();
//       return {
//         id: doc.id,
//         ...data,
//         createdAt: data.createdAt?.toDate?.().toISOString?.() || null,
//         updatedAt: data.updatedAt?.toDate?.().toISOString?.() || null,
//       };
//     });

//     // Live search (filter di memory)
//     if (search) {
//       const s = search.toLowerCase();
//       products = products.filter((p) => {
//         const name = p.name?.toLowerCase() || "";
//         const desc = p.description?.toLowerCase() || "";
//         return name.includes(s) || desc.includes(s);
//       });
//     }

//     return products;
//   },

//   async getProductById(id) {
//     if (!db) {
//       console.warn("Firestore is not initialized. getProductById returns null.");
//       return null;
//     }

//     const doc = await db.collection(collectionName).doc(id).get();
//     if (!doc.exists) return null;

//     const data = doc.data();
//     return {
//       id: doc.id,
//       ...data,
//       createdAt: data.createdAt?.toDate?.().toISOString?.() || null,
//       updatedAt: data.updatedAt?.toDate?.().toISOString?.() || null,
//     };
//   },

//   async createProduct({ name, description, price, categoryId, categoryName, imageUrl, imageUrls }) {
//     if (!db) {
//       throw new Error("Firestore is not initialized");
//     }

//     const now = new Date();
//     const slug = slugify(name);

//     const normalizedImageUrls = Array.isArray(imageUrls)
//       ? imageUrls
//       : imageUrl
//         ? [imageUrl]
//         : [];

//     const docRef = await db.collection(collectionName).add({
//       name,
//       slug,
//       description,
//       price,
//       categoryId,
//       categoryName: categoryName || null,
//       imageUrl: normalizedImageUrls[0] || null,
//       imageUrls: normalizedImageUrls,
//       isActive: true,
//       createdAt: admin.firestore.Timestamp.fromDate(now),
//       updatedAt: admin.firestore.Timestamp.fromDate(now),
//     });

//     const doc = await docRef.get();
//     const data = doc.data();

//     return {
//       id: doc.id,
//       ...data,
//       createdAt: now.toISOString(),
//       updatedAt: now.toISOString(),
//     };
//   },

//   async updateProduct(id, payload) {
//     if (!db) {
//       throw new Error("Firestore is not initialized");
//     }

//     const docRef = db.collection(collectionName).doc(id);
//     const existing = await docRef.get();
//     if (!existing.exists) {
//       return null;
//     }

//     const now = new Date();
//     const dataUpdate = {};

//     if (payload.name) {
//       dataUpdate.name = payload.name;
//       dataUpdate.slug = slugify(payload.name);
//     }
//     if (payload.description !== undefined) dataUpdate.description = payload.description;
//     if (payload.price !== undefined) dataUpdate.price = Number(payload.price);
//     if (payload.categoryId !== undefined) dataUpdate.categoryId = payload.categoryId;
//     if (payload.categoryName !== undefined) dataUpdate.categoryName = payload.categoryName;
//     if (payload.isActive !== undefined) dataUpdate.isActive = payload.isActive;

//     // update gambar
//     if (payload.imageUrl !== undefined) dataUpdate.imageUrl = payload.imageUrl;
//     if (payload.imageUrls !== undefined) {
//       const arr = Array.isArray(payload.imageUrls)
//         ? payload.imageUrls
//         : [payload.imageUrls];
//       dataUpdate.imageUrls = arr;
//       if (!dataUpdate.imageUrl && arr.length > 0) {
//         dataUpdate.imageUrl = arr[0];
//       }
//     }

//     dataUpdate.updatedAt = admin.firestore.Timestamp.fromDate(now);

//     await docRef.update(dataUpdate);

//     const updatedDoc = await docRef.get();
//     const updatedData = updatedDoc.data();

//     return {
//       id: updatedDoc.id,
//       ...updatedData,
//       createdAt: updatedData.createdAt?.toDate?.().toISOString?.() || null,
//       updatedAt: now.toISOString(),
//     };
//   },

//   async deleteProduct(id) {
//     if (!db) {
//       throw new Error("Firestore is not initialized");
//     }

//     const docRef = db.collection(collectionName).doc(id);
//     const existing = await docRef.get();
//     if (!existing.exists) {
//       return false;
//     }

//     const now = new Date();

//     await docRef.update({
//       isActive: false,
//       deletedAt: admin.firestore.Timestamp.fromDate(now),
//       updatedAt: admin.firestore.Timestamp.fromDate(now),
//     });

//     return true;
//   },
// };


// src/services/productService.js
import { db, admin } from "../firebase/firebaseAdmin.js";
import { slugify } from "../utils/slugify.js";

const collectionName = "products";

function normalizeTimestampToIso(ts) {
  return ts?.toDate?.()?.toISOString?.() || null;
}

// Utility untuk normalisasi imageUrls dari berbagai bentuk
function normalizeImageUrls({ imageUrl, imageUrls }) {
  let urls = [];

  // Kalau sudah array langsung pakai
  if (Array.isArray(imageUrls)) {
    urls = imageUrls;
  } else if (typeof imageUrls === "string" && imageUrls.trim().length > 0) {
    const raw = imageUrls.trim();

    // Coba parse JSON string: '["url1","url2"]'
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        urls = parsed;
      } else if (typeof parsed === "string") {
        urls = [parsed];
      }
    } catch {
      // Kalau bukan JSON, mungkin dipisah koma: "url1,url2"
      if (raw.includes(",")) {
        urls = raw.split(",").map((s) => s.trim());
      } else {
        urls = [raw];
      }
    }
  } else if (imageUrl) {
    // fallback kalau hanya ada imageUrl tunggal
    urls = [imageUrl];
  }

  // Bersihkan: hanya string non-kosong
  urls = urls.filter(
    (u) => typeof u === "string" && u.trim().length > 0
  );

  return {
    imageUrls: urls,
    imageUrl: urls.length > 0 ? urls[0] : null,
  };
}

export const productService = {
  // List produk + optional search & category
  async listProducts({ search, categoryId } = {}) {
    if (!db) {
      console.warn(
        "Firestore is not initialized. Returning empty product list."
      );
      return [];
    }

    let query = db.collection(collectionName).where("isActive", "==", true);

    if (categoryId) {
      query = query.where("categoryId", "==", categoryId);
    }

    const snapshot = await query.get();

    let products = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: normalizeTimestampToIso(data.createdAt),
        updatedAt: normalizeTimestampToIso(data.updatedAt),
      };
    });

    // Live search (filter di memory)
    if (search) {
      const s = search.toLowerCase();
      products = products.filter((p) => {
        const name = p.name?.toLowerCase() || "";
        const desc = p.description?.toLowerCase() || "";
        return name.includes(s) || desc.includes(s);
      });
    }

    return products;
  },

  async getProductById(id) {
    if (!db) {
      console.warn(
        "Firestore is not initialized. getProductById returns null."
      );
      return null;
    }

    const doc = await db.collection(collectionName).doc(id).get();
    if (!doc.exists) return null;

    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: normalizeTimestampToIso(data.createdAt),
      updatedAt: normalizeTimestampToIso(data.updatedAt),
    };
  },

  async createProduct({
    name,
    description,
    price,
    categoryId,
    categoryName,
    imageUrl,
    imageUrls,
  }) {
    if (!db) {
      throw new Error("Firestore is not initialized");
    }

    if (!name) {
      throw new Error("Product name is required");
    }

    const now = new Date();
    const slug = slugify(name);

    // 🔥 Normalisasi imageUrls dari payload
    const { imageUrl: finalImageUrl, imageUrls: finalImageUrls } =
      normalizeImageUrls({ imageUrl, imageUrls });

    const docRef = await db.collection(collectionName).add({
      name: name.trim(),
      slug,
      description: (description || "").trim(),
      price: Number(price),
      categoryId: categoryId || null,
      categoryName: categoryName || null,
      imageUrl: finalImageUrl || null,
      imageUrls: finalImageUrls,
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

  async updateProduct(id, payload) {
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
      dataUpdate.name = payload.name.trim();
      dataUpdate.slug = slugify(payload.name);
    }
    if (payload.description !== undefined) {
      dataUpdate.description = (payload.description || "").trim();
    }
    if (payload.price !== undefined) {
      dataUpdate.price = Number(payload.price);
    }
    if (payload.categoryId !== undefined) {
      dataUpdate.categoryId = payload.categoryId || null;
    }
    if (payload.categoryName !== undefined) {
      dataUpdate.categoryName = payload.categoryName || null;
    }
    if (payload.isActive !== undefined) {
      dataUpdate.isActive = payload.isActive;
    }

    // 🔥 Update gambar (support array, JSON string, dll)
    if (
      payload.imageUrl !== undefined ||
      payload.imageUrls !== undefined
    ) {
      const { imageUrl: finalImageUrl, imageUrls: finalImageUrls } =
        normalizeImageUrls({
          imageUrl: payload.imageUrl,
          imageUrls: payload.imageUrls,
        });

      dataUpdate.imageUrl = finalImageUrl || null;
      dataUpdate.imageUrls = finalImageUrls;
    }

    dataUpdate.updatedAt = admin.firestore.Timestamp.fromDate(now);

    await docRef.update(dataUpdate);

    const updatedDoc = await docRef.get();
    const updatedData = updatedDoc.data();

    return {
      id: updatedDoc.id,
      ...updatedData,
      createdAt: normalizeTimestampToIso(updatedData.createdAt),
      updatedAt: now.toISOString(),
    };
  },

  async deleteProduct(id) {
    if (!db) {
      throw new Error("Firestore is not initialized");
    }

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