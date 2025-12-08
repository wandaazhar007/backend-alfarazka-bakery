import { admin, db } from "../firebase/firebaseAdmin.js";

export const SNACK_PACKAGES_COLLECTION = "snackPackages";

export function mapSnackPackageDoc(doc) {
  const data = doc.data();

  return {
    id: doc.id,
    name: data.name || "",
    shortDescription: data.shortDescription || "",
    price: data.price || 0,
    fitFor: data.fitFor || "",
    point1: data.point1 || "",
    point2: data.point2 || "",
    point3: data.point3 || "",
    isActive: data.isActive ?? true,
    createdAt:
      data.createdAt?.toDate?.().toISOString?.() || null,
    updatedAt:
      data.updatedAt?.toDate?.().toISOString?.() || null,
  };
}