import { db, admin } from "../firebase/firebaseAdmin.js";
import {
  SITE_SETTINGS_COLLECTION,
  SITE_SETTINGS_DOC_ID,
  mapSiteSettingsDoc,
  buildDefaultSiteSettingsPayload,
} from "../models/siteSettingsModel.js";

const collectionName = SITE_SETTINGS_COLLECTION;
const docId = SITE_SETTINGS_DOC_ID;

function validateUrl(value, fieldLabel, errors) {
  if (!value) return;

  try {
    const url = new URL(value);
    if (!["http:", "https:"].includes(url.protocol)) {
      errors.push(`${fieldLabel} harus menggunakan http:// atau https://`);
    }
  } catch {
    errors.push(`${fieldLabel} tidak valid.`);
  }
}

function validateEmail(value, fieldLabel, errors) {
  if (!value) return;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(String(value).trim())) {
    errors.push(`${fieldLabel} tidak valid.`);
  }
}

function validateSiteSettingsPayload(payload = {}) {
  const errors = [];

  if (
    payload.phoneNumberDisplay !== undefined &&
    !String(payload.phoneNumberDisplay).trim()
  ) {
    errors.push("Nomor telepon display wajib diisi.");
  }

  if (
    payload.whatsappNumber !== undefined &&
    !String(payload.whatsappNumber).trim()
  ) {
    errors.push("Nomor WhatsApp wajib diisi.");
  }

  if (payload.whatsappNumber !== undefined) {
    const normalized = String(payload.whatsappNumber).replace(/\D/g, "");
    if (!normalized) {
      errors.push("Nomor WhatsApp hanya boleh berisi angka.");
    }
  }

  if (
    payload.businessName !== undefined &&
    !String(payload.businessName).trim()
  ) {
    errors.push("Nama bisnis wajib diisi.");
  }

  if (
    payload.addressLabel !== undefined &&
    !String(payload.addressLabel).trim()
  ) {
    errors.push("Label alamat wajib diisi.");
  }

  if (
    payload.serviceAreaText !== undefined &&
    !String(payload.serviceAreaText).trim()
  ) {
    errors.push("Teks area layanan wajib diisi.");
  }

  validateUrl(payload.instagramUrl, "Instagram URL", errors);
  validateUrl(payload.mapsUrl, "Google Maps URL", errors);
  validateUrl(payload.embedMapUrl, "Embed Map URL", errors);
  validateEmail(payload.email, "Email", errors);

  if (errors.length > 0) {
    const err = new Error("Validasi site settings gagal.");
    err.statusCode = 400;
    err.details = errors;
    throw err;
  }
}

export const siteSettingsService = {
  async getSiteSettings({ createIfMissing = true } = {}) {
    if (!db) throw new Error("Firestore is not initialized");

    const ref = db.collection(collectionName).doc(docId);
    const doc = await ref.get();

    if (!doc.exists) {
      if (!createIfMissing) return null;

      const defaultPayload = buildDefaultSiteSettingsPayload();
      await ref.set(defaultPayload);

      const createdDoc = await ref.get();
      return mapSiteSettingsDoc(createdDoc);
    }

    return mapSiteSettingsDoc(doc);
  },

  async getPublicSiteSettings() {
    const settings = await this.getSiteSettings({ createIfMissing: true });
    if (!settings) return null;

    return {
      phoneNumberDisplay: settings.phoneNumberDisplay || "",
      whatsappNumber: settings.whatsappNumber || "",
      instagramUrl: settings.instagramUrl || "",
      mapsUrl: settings.mapsUrl || "",
      embedMapUrl: settings.embedMapUrl || "",
      businessName: settings.businessName || "",
      email: settings.email || "",
      addressLabel: settings.addressLabel || "",
      serviceAreaText: settings.serviceAreaText || "",
      updatedAt: settings.updatedAt || null,
    };
  },

  async updateSiteSettings(payload = {}) {
    if (!db) throw new Error("Firestore is not initialized");

    validateSiteSettingsPayload(payload);

    const ref = db.collection(collectionName).doc(docId);
    const existing = await ref.get();

    if (!existing.exists) {
      await ref.set(buildDefaultSiteSettingsPayload());
    }

    const updateData = {};

    if (payload.phoneNumberDisplay !== undefined) {
      updateData.phoneNumberDisplay = String(payload.phoneNumberDisplay).trim();
    }

    if (payload.whatsappNumber !== undefined) {
      updateData.whatsappNumber = String(payload.whatsappNumber).replace(
        /\D/g,
        ""
      );
    }

    if (payload.instagramUrl !== undefined) {
      updateData.instagramUrl = String(payload.instagramUrl).trim();
    }

    if (payload.mapsUrl !== undefined) {
      updateData.mapsUrl = String(payload.mapsUrl).trim();
    }

    if (payload.embedMapUrl !== undefined) {
      updateData.embedMapUrl = String(payload.embedMapUrl).trim();
    }

    if (payload.businessName !== undefined) {
      updateData.businessName = String(payload.businessName).trim();
    }

    if (payload.email !== undefined) {
      updateData.email = String(payload.email).trim();
    }

    if (payload.addressLabel !== undefined) {
      updateData.addressLabel = String(payload.addressLabel).trim();
    }

    if (payload.serviceAreaText !== undefined) {
      updateData.serviceAreaText = String(payload.serviceAreaText).trim();
    }

    updateData.updatedAt = admin.firestore.Timestamp.fromDate(new Date());

    await ref.set(updateData, { merge: true });

    const updatedDoc = await ref.get();
    return mapSiteSettingsDoc(updatedDoc);
  },
};