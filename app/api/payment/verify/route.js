import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Razorpay from "razorpay";
import crypto from "crypto";
import UserService from "@/lib/services/UserService";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      await request.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, error: "Missing payment verification data" },
        { status: 400 }
      );
    }

    // Verify payment signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      return NextResponse.json(
        { success: false, error: "Payment verification failed" },
        { status: 400 }
      );
    }

    // Fetch payment details from Razorpay
    const payment = await razorpay.payments.fetch(razorpay_payment_id);
    const order = await razorpay.orders.fetch(razorpay_order_id);

    if (payment.status !== "captured") {
      return NextResponse.json(
        { success: false, error: "Payment not completed" },
        { status: 400 }
      );
    }

    // Update user to premium
    const user = await UserService.updatePlanStatus(userId, true);

    // Record the order directly in the database
    try {
      await connectDB();

      const userDoc = await User.findOne({ clerkId: userId });
      if (userDoc) {
        const newOrder = {
          orderId: razorpay_payment_id,
          planName: "Premium Plan",
          amount: payment.amount / 100, // Convert back from smallest unit
          currency: payment.currency.toUpperCase(),
          status: "completed",
          paymentMethod: "razorpay",
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          timestamp: new Date(),
        };

        userDoc.orderHistory.push(newOrder);
        await userDoc.save();
        console.log("✅ Order recorded successfully:", newOrder.orderId);
      }
    } catch (orderError) {
      console.warn("Failed to record order:", orderError);
      // Don't fail the payment verification if order recording fails
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
      user: {
        id: user._id,
        planId: user.planId,
        isPremium: user.planId === "premium",
      },
      payment: {
        orderId: razorpay_payment_id,
        razorpayOrderId: razorpay_order_id,
        amount: payment.amount / 100,
        currency: payment.currency.toUpperCase(),
      },
    });
  } catch (error) {
    console.error("❌ Error verifying payment:", error);
    return NextResponse.json(
      { success: false, error: "Payment verification failed" },
      { status: 500 }
    );
  }
}
