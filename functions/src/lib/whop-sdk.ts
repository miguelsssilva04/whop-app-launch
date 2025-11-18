import Whop from "@whop/sdk";
import { WHOP_API_KEY, WHOP_WEBHOOK_SECRET, WHOP_APP_ID } from "./secrets";

let cachedWhop: Whop | null = null;

export function getWhopSdk(): Whop {
  if (!cachedWhop) {
    cachedWhop = new Whop({
      apiKey: WHOP_API_KEY.value(),
      appID: WHOP_APP_ID,
      webhookKey: btoa(WHOP_WEBHOOK_SECRET.value() || ""),
    });
  }
  return cachedWhop;
}