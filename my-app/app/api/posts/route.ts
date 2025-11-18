import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/api/lib/firebaseAdmin';
import { headers } from 'next/headers';
import { verifyUserToken } from '../utils/verifyUserToken';

// Job post interface matching the JobFormData structure
interface Message {
  id?: string;
  userId: string;
  message: string;
  timestamp: number;
}

// GET - List all job posts
export async function GET(request: NextRequest) {
  try {

    const headersList = await headers();
    const whopUserId = headersList.get("x-whop-user-id"); 

    if (!whopUserId) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    // Admin SDK query (use Query type to allow where/orderBy chaining)
    let postsQuery: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> = db.collection("messages");
    

    const snapshot = await postsQuery.get();

    const messages: Message[] = [];

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      messages.push({
        id: docSnap.id,
        ...data,
        timestamp: data.timestamp?.toDate?.()?.getTime() || data.timestamp,
      } as Message);
    });


    return NextResponse.json({
      success: true,
      posts: messages,
      total: messages.length,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

// POST - Create a new job post
export async function POST(request: NextRequest) {
  try {
    const userToken = await verifyUserToken();
    if (!userToken) {
      return null;
    }
    
    const headersList = await headers();
    const whopUserId = headersList.get("x-whop-user-id"); 

    if (!whopUserId) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      "message",
      "userId",
    ];

    for (const field of requiredFields) {
      if (!body[field] || (typeof body[field] === "string" && body[field].trim() === "")) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        );
      }
    }


    const now = new Date();

    const message: Omit<Message, "id"> = {
      userId: body.userId,
      message: body.message,
      timestamp: now.getTime(),
    };

    // ✅ Admin SDK: create document
    const docRef = await db.collection("messages").add(message);

    return NextResponse.json({
      success: true,
      id: docRef.id,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.error("Error creating message:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create message" },
      { status: 500 }
    );
  }
}