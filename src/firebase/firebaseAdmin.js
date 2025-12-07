// // src/firebase/firebaseAdmin.js
// import admin from "firebase-admin";
// import { createRequire } from "module";

// const require = createRequire(import.meta.url);
// const serviceAccount = require("./serviceAccountKey.json");

// const storageBucket = serviceAccount.project_id
//   ? `${serviceAccount.project_id}.firebasestorage.app`
//   : undefined;

// // const storageBucket = "alfarazka-bakery.firebasestorage.app";

// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     storageBucket,
//   });
//   console.log("Firebase Admin initialized ✅");
//   console.log("Using storage bucket:", storageBucket);
// }

// const db = admin.firestore();
// const bucket = admin.storage().bucket(); // <— ini yang dipakai untuk upload

// export { admin, db, bucket };



// src/firebase/firebaseAdmin.js
import admin from "firebase-admin";
import "dotenv/config"; // pastikan package dotenv sudah ter-install

// Bangun object service account dari environment variables
const serviceAccount = {
  type: process.env.FIREBASE_TYPE, // "service_account"
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  // ubah \n di string .env menjadi newline asli
  private_key: process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
    : undefined,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url:
    process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
};

// Bisa override lewat env (opsional)
const storageBucket =
  process.env.FIREBASE_STORAGE_BUCKET ||
  (serviceAccount.project_id
    ? `${serviceAccount.project_id}.firebasestorage.app`
    : undefined);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket,
  });
  console.log("Firebase Admin initialized ✅");
  console.log("Using storage bucket:", storageBucket);
}

const db = admin.firestore();
const bucket = admin.storage().bucket(); // dipakai untuk upload ke storage

export { admin, db, bucket };

