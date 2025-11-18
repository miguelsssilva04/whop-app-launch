import { defineSecret } from "firebase-functions/params";

// Example: Replace with your actual secret names
export const WHOP_API_KEY = defineSecret("WHOP_API_KEY");
export const WHOP_WEBHOOK_SECRET = defineSecret("WHOP_WEBHOOK_SECRET");

// Example: Replace with your actual Whop App ID
export const WHOP_APP_ID = "your_app_id_here";
