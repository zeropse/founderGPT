import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const user = await User.findOne({ clerkId: userId }).select("orderHistory");

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const orders = user.orderHistory.sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("❌ Error fetching order history:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const authHeader = request.headers.get("authorization");
    let userId;

    // Check if it's an internal webhook call or regular auth
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      // For internal calls from webhook, the token is the userId
      if (token.startsWith("user_")) {
        userId = token;
      } else {
        // Regular Clerk auth
        const authResult = await auth();
        userId = authResult.userId;
      }
    } else {
      // Regular Clerk auth
      const authResult = await auth();
      userId = authResult.userId;
    }

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const {
      orderId,
      planName,
      amount,
      status = "completed",
      paymentMethod,
      razorpayOrderId,
      razorpayPaymentId,
    } = await request.json();

    if (!orderId || !planName || amount === undefined) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const newOrder = {
      orderId,
      planName,
      amount,
      status,
      paymentMethod,
      timestamp: new Date(),
      ...(razorpayOrderId && { razorpayOrderId }),
      ...(razorpayPaymentId && { razorpayPaymentId }),
    };

    user.orderHistory.push(newOrder);
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Order added successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("❌ Error adding order:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    user.orderHistory = [];
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Order history cleared successfully",
    });
  } catch (error) {
    console.error("❌ Error clearing order history:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
