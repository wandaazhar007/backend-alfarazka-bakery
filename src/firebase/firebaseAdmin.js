//src/firebase/firebaseAdmin.js
import admin from "firebase-admin";
import "dotenv/config";


const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  // update \n in string .env become real newline
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
const bucket = admin.storage().bucket();

export { admin, db, bucket };

