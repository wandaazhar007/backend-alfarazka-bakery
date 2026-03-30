import { admin } from "../firebase/firebaseAdmin.js";

export const SITE_SETTINGS_COLLECTION = "siteSettings";
export const SITE_SETTINGS_DOC_ID = "main";

function normalizeTimestampToIso(ts) {
  return ts?.toDate?.()?.toISOString?.() || null;
}

export function mapSiteSettingsDoc(doc) {
  const data = doc.data() || {};

  return {
    id: doc.id,
    phoneNumberDisplay: data.phoneNumberDisplay || "",
    whatsappNumber: data.whatsappNumber || "",
    instagramUrl: data.instagramUrl || "",
    mapsUrl: data.mapsUrl || "",
    embedMapUrl: data.embedMapUrl || "",
    businessName: data.businessName || "",
    email: data.email || "",
    addressLabel: data.addressLabel || "",
    serviceAreaText: data.serviceAreaText || "",
    updatedAt: normalizeTimestampToIso(data.updatedAt),
  };
}

export function buildDefaultSiteSettingsPayload() {
  const now = admin.firestore.Timestamp.fromDate(new Date());

  return {
    phoneNumberDisplay: "0821-9422-8282",
    whatsappNumber: "6282194228282",
    instagramUrl: "https://www.instagram.com/alfarazkabakery",
    mapsUrl: "https://maps.app.goo.gl/dMbWuud6ZD9DSqap6",
    embedMapUrl: "",
    businessName: "Alfarazka Bakery",
    email: "",
    addressLabel: "Ciputat, Tangerang Selatan, Banten",
    serviceAreaText:
      "Ciputat, Pamulang, UIN Jakarta, Gintung, Legoso, BSD tertentu, dan sekitarnya.",
    updatedAt: now,
  };
}