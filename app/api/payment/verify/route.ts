import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Razorpay from "razorpay";
import crypto from "crypto";
import UserService from "@/lib/services/UserService";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User";

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  throw new Error(
    "Missing Razorpay configuration. Please check your environment variables."
  );
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(request: Request) {
  const startTime = Date.now();

  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 401 }
      );
    }

    let paymentData;
    try {
      paymentData = await request.json();
    } catch (error) {
      return NextResponse.json(
        { success: false, error: "Invalid JSON payload" },
        { status: 400 }
      );
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      paymentData;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, error: "Missing payment verification data" },
        { status: 400 }
      );
    }

    if (
      typeof razorpay_order_id !== "string" ||
      !razorpay_order_id.startsWith("order_")
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid order ID format" },
        { status: 400 }
      );
    }

    if (
      typeof razorpay_payment_id !== "string" ||
      !razorpay_payment_id.startsWith("pay_")
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid payment ID format" },
        { status: 400 }
      );
    }

    console.log(
      `🔍 Verifying payment for user ${userId}: ${razorpay_payment_id}`
    );

    const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!razorpaySecret) {
      console.error("RAZORPAY_KEY_SECRET is not configured");
      return NextResponse.json(
        { success: false, error: "Payment verification configuration error" },
        { status: 500 }
      );
    }

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", razorpaySecret)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      console.error(
        `❌ Payment signature verification failed for ${razorpay_payment_id}`
      );
      return NextResponse.json(
        { success: false, error: "Payment signature verification failed" },
        { status: 400 }
      );
    }

    let payment, order;
    let retryCount = 0;
    const maxRetries = 3;

    while (retryCount < maxRetries) {
      try {
        [payment, order] = await Promise.all([
          razorpay.payments.fetch(razorpay_payment_id),
          razorpay.orders.fetch(razorpay_order_id),
        ]);
        break;
      } catch (error) {
        retryCount++;
        if (retryCount === maxRetries) {
          console.error(
            `❌ Failed to fetch payment details after ${maxRetries} attempts:`,
            error
          );
          throw new Error(
            "Unable to verify payment with Razorpay. Please try again."
          );
        }
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, retryCount) * 1000)
        );
      }
    }

    if (!payment) {
      console.error(`❌ Payment not found for ${razorpay_payment_id}`);
      return NextResponse.json(
        { success: false, error: "Payment not found" },
        { status: 404 }
      );
    }

    if (payment.status !== "captured") {
      console.error(
        `❌ Payment not captured: ${payment.status} for ${razorpay_payment_id}`
      );
      return NextResponse.json(
        {
          success: false,
          error: `Payment not completed. Status: ${payment.status}`,
        },
        { status: 400 }
      );
    }

    if (!order) {
      console.error(`❌ Order not found for ${razorpay_order_id}`);
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    if (order.status !== "paid") {
      console.error(
        `❌ Order not paid: ${order.status} for ${razorpay_order_id}`
      );
      return NextResponse.json(
        {
          success: false,
          error: `Order not completed. Status: ${order.status}`,
        },
        { status: 400 }
      );
    }

    if (payment.order_id !== razorpay_order_id) {
      console.error(
        `❌ Payment order ID mismatch: expected ${razorpay_order_id}, got ${payment.order_id}`
      );
      return NextResponse.json(
        {
          success: false,
          error: "Payment verification failed - order mismatch",
        },
        { status: 400 }
      );
    }

    console.log(
      `✅ Payment verification successful: ${razorpay_payment_id} for user ${userId}`
    );

    try {
      await connectDB();
      const existingUser = await User.findOne({
        clerkId: userId,
        "orderHistory.razorpayPaymentId": razorpay_payment_id,
      });

      if (existingUser) {
        console.log(`⚠️ Payment already processed: ${razorpay_payment_id}`);
        return NextResponse.json({
          success: true,
          message: "Payment already verified",
          user: {
            id: existingUser._id,
            planId: existingUser.planId,
            isPremium: existingUser.planId === "premium",
          },
          payment: {
            orderId: razorpay_payment_id,
            razorpayOrderId: razorpay_order_id,
            amount: Number(payment.amount) / 100,
            currency: order.currency || "USD",
            status: "already_processed",
          },
        });
      }
    } catch (dbError) {
      console.warn("Database check for duplicate payment failed:", dbError);
    }

    let user;
    try {
      user = await UserService.updatePlanStatus(userId, true);
      console.log(`✅ User ${userId} upgraded to premium successfully`);
    } catch (userServiceError) {
      console.error(
        `❌ Failed to upgrade user ${userId} to premium:`,
        userServiceError
      );
      return NextResponse.json(
        {
          success: false,
          error: "Failed to upgrade user plan. Please contact support.",
        },
        { status: 500 }
      );
    }

    let orderRecorded = false;
    try {
      await connectDB();

      const userDoc = await User.findOne({ clerkId: userId });
      if (userDoc) {
        // Get currency from the payment or order
        const orderCurrency = order.currency || "USD";
        const displayAmount = Number(payment.amount) / 100;

        const newOrder = {
          orderId: razorpay_payment_id,
          planName: "Premium Plan",
          amount: displayAmount,
          currency: orderCurrency,
          status: "completed",
          paymentMethod: "razorpay",
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          paymentDetails: {
            method: payment.method,
            bank: payment.bank,
            wallet: payment.wallet,
            vpa: payment.vpa,
            card_id: payment.card_id,
          },
          timestamp: new Date(),
          processingTime: Date.now() - startTime,
        };

        userDoc.orderHistory.push(newOrder);
        await userDoc.save();
        orderRecorded = true;
        console.log("✅ Order recorded successfully:", newOrder.orderId);
      } else {
        console.warn(
          `⚠️ User document not found for ${userId} during order recording`
        );
      }
    } catch (orderError) {
      console.error("❌ Failed to record order:", orderError);
    }

    const processingTime = Date.now() - startTime;
    console.log(
      `🎉 Payment verification completed in ${processingTime}ms for user ${userId}`
    );

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
        amount: Number(payment.amount) / 100,
        currency: order.currency || "USD",
        method: payment.method,
        status: "verified",
        orderRecorded,
      },
      meta: {
        processingTime,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error("❌ Error verifying payment:", error);

    let errorMessage = "Payment verification failed";
    let statusCode = 500;

    if (error instanceof Error) {
      if (
        error.message.includes("network") ||
        error.message.includes("fetch")
      ) {
        errorMessage = "Network error during verification. Please try again.";
        statusCode = 503;
      } else if (error.message.includes("Razorpay")) {
        errorMessage =
          "Payment service error. Please try again or contact support.";
        statusCode = 503;
      } else if (error.message.includes("signature")) {
        errorMessage = "Payment security verification failed";
        statusCode = 400;
      } else {
        errorMessage = error.message;
      }
    }

    if (error && typeof error === "object" && "statusCode" in error) {
      const errorWithStatus = error as any;
      statusCode =
        errorWithStatus.statusCode >= 400 && errorWithStatus.statusCode < 600
          ? errorWithStatus.statusCode
          : 500;
      errorMessage = errorWithStatus.error?.description || errorMessage;
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        meta: {
          processingTime,
          timestamp: new Date().toISOString(),
        },
      },
      { status: statusCode }
    );
  }
}
