import { initializeApp } from "firebase-admin/app";
import cors from "cors";

// Initialize Firebase and CORS
initializeApp();
export const corsHandler = cors({ origin: true });