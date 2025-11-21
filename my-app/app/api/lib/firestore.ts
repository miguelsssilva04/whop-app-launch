import { db } from './firebaseAdmin';
import { Timestamp, FieldValue } from 'firebase-admin/firestore';

export type LaunchStatus = 'upcoming' | 'open' | 'closed';

export type LaunchDoc = {
  status: LaunchStatus;
  weekNumber: number;
  openDate: Timestamp;
  closeDate: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type AppDoc = {
  name: string;
  description: string;
  image: string;
  authorId: string;
  pageDescription?: string;
  category?: string;
  target?: 'B2C' | 'B2B';
  testAppUrl?: string;
  upvotes?: number;
  comments?: number;
};

function isoWeekNumber(d: Date): number {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

export async function addAppToNextUpcoming(app: AppDoc, providedLaunchId?: string): Promise<{ launchId: string; appId: string; }> {
  const result = await db.runTransaction(async (tx) => {
    let launchRef = providedLaunchId ? db.collection('launches').doc(providedLaunchId) : null;
    if (launchRef) {
      const snap = await tx.get(launchRef);
      if (!snap.exists) {
        throw new Error('launch_not_found');
      }
      const data = snap.data() as LaunchDoc;
      if (data.status !== 'upcoming') {
        throw new Error('invalid_launch_status');
      }
    } else {
      const query = db.collection('launches')
        .where('status', '==', 'upcoming')
        .orderBy('openDate', 'asc')
        .limit(1);
      const qSnap = await tx.get(query);
      if (!qSnap.empty) {
        launchRef = qSnap.docs[0].ref;
      } else {
        const now = new Date();
        const openDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        const closeDate = new Date(openDate.getTime() + 7 * 24 * 60 * 60 * 1000);
        const weekNumber = isoWeekNumber(openDate);
        launchRef = db.collection('launches').doc();
        const payload: LaunchDoc = {
          status: 'upcoming',
          weekNumber,
          openDate: Timestamp.fromDate(openDate),
          closeDate: Timestamp.fromDate(closeDate),
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        };
        tx.set(launchRef, payload);
      }
    }
    const appRef = launchRef!.collection('apps').doc();
    const appPayload: AppDoc = {
      name: app.name,
      description: app.description,
      image: app.image,
      authorId: app.authorId,
      pageDescription: app.pageDescription,
      category: app.category,
      target: app.target,
      testAppUrl: app.testAppUrl,
      upvotes: app.upvotes ?? 0,
      comments: app.comments ?? 0,
    };
    tx.set(appRef, appPayload);
    return { launchId: launchRef!.id, appId: appRef.id };
  });
  return result;
}