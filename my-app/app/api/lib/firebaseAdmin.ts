import { initializeApp, cert, getApps, getApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

// Normalize private key: handle escaped newlines from env vars
const normalizedPrivateKey = (process.env.FIREBASE_PRIVATE_KEY || "")
  .replace(/\\n/g, "\n");

const firebaseAdminApp =
  getApps().length === 0
    ? initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: normalizedPrivateKey,
        }),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      })
    : getApp();

    console.log("Admin init:", {
  projectId: process.env.FIREBASE_PROJECT_ID,
  hasKey: !!process.env.FIREBASE_PRIVATE_KEY,
});


export const db = getFirestore(firebaseAdminApp);
// Use default bucket configured via storageBucket
export const storage = getStorage(firebaseAdminApp).bucket();
