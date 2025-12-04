// src/firebase/firebaseAdmin.js
import admin from "firebase-admin";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const serviceAccount = require("./serviceAccountKey.json");

const storageBucket = serviceAccount.project_id
  ? `${serviceAccount.project_id}.firebasestorage.app`
  : undefined;

// const storageBucket = "alfarazka-bakery.firebasestorage.app";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket,
  });
  console.log("Firebase Admin initialized ✅");
  console.log("Using storage bucket:", storageBucket);
}

const db = admin.firestore();
const bucket = admin.storage().bucket(); // <— ini yang dipakai untuk upload

export { admin, db, bucket };