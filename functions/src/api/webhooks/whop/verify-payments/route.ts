import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { getFirestore } from "firebase-admin/firestore";
import { corsHandler } from "../../../../lib/firebase";
import { getWhopSdk } from "../../../../lib/whop-sdk";
import type { Payment } from '@whop/sdk/resources.js';
import { WHOP_WEBHOOK_SECRET , WHOP_API_KEY } from "../../../../lib/secrets";


export const verifyPayment = onRequest(
  { secrets: [WHOP_WEBHOOK_SECRET, WHOP_API_KEY] },
  async (req, res) => {
    corsHandler(req, res, async () => {
        try {
          if (req.method !== 'POST') {
                      res.status(204).send('');
                      return;
                    }
          
                    const requestBodyText = req.rawBody
                      ? req.rawBody.toString('utf8')
                      : typeof req.body === 'string'
                      ? req.body
                      : JSON.stringify(req.body ?? {});
          
                    const headers = Object.fromEntries(Object.entries(req.headers));
                    logger.info('WEBHOOK HEADERS:', headers);
                    const webhookData = getWhopSdk().webhooks.unwrap(requestBodyText, { 
                      headers: Object.fromEntries(
                        Object.entries(headers).map(([k, v]) => [
                          k,
                          Array.isArray(v) ? v.join(', ') : v ?? ''
                        ])
                      )
                    });
    
          if (webhookData?.type === 'payment.succeeded' && webhookData.data) {
            logger.info('Payment succeeded:', webhookData.data);
            processPaymentSucceeded(webhookData.data as Payment).catch((err: unknown) => {
              logger.error('Error in processPaymentSucceeded:', err);
            });
          } else if (webhookData?.type === 'payment.succeeded' && !webhookData.data) {
            logger.warn('Payment succeeded but webhookData.data is missing');
          } else {
            logger.info('Unhandled webhook type:', webhookData?.type);
          }
          
          res.json({ result: `Payment ${webhookData?.type === 'payment.succeeded' ? 'succeeded' : 'failed'}` });
        } catch (error) {
          logger.error("Error:", error);
          res.status(500).json({ error: "Failed to process payment" });
        }
      });
});

async function processPaymentSucceeded(invoice: Payment) {
  const db = getFirestore();
  const paymentId = invoice.id;
  const snapshot = await db
    .collection('posts')
    .where('receiptId', '==', paymentId)
    .get();

  if (snapshot.empty) return;

  const batch = db.batch();
  snapshot.forEach((doc) => {
    batch.update(doc.ref, { pending: false });
  });
  await batch.commit();
}