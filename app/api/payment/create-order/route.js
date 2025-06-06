import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Razorpay from "razorpay";

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  throw new Error(
    "Missing Razorpay configuration. Please check your environment variables."
  );
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 401 }
      );
    }

    let requestData;
    try {
      requestData = await request.json();
    } catch (error) {
      return NextResponse.json(
        { success: false, error: "Invalid JSON payload" },
        { status: 400 }
      );
    }

    const { amount, currency = "USD", countryCode = "US" } = requestData;

    // Validate currency
    const supportedCurrencies = ["USD", "INR"];
    if (!supportedCurrencies.includes(currency)) {
      return NextResponse.json(
        {
          success: false,
          error: `Unsupported currency: ${currency}`,
        },
        { status: 400 }
      );
    }

    // Set minimum amount based on currency
    const minimumAmount = currency === "INR" ? 1 : 0.5;
    const currencySymbol = currency === "INR" ? "₹" : "$";

    if (!amount || typeof amount !== "number" || amount < minimumAmount) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid amount. Minimum ${currencySymbol}${minimumAmount}`,
        },
        { status: 400 }
      );
    }

    const amountInSmallestUnit = Math.round(amount * 100);

    const options = {
      amount: amountInSmallestUnit,
      currency: currency,
      receipt: `rcpt_${userId.slice(-8)}_${Date.now().toString().slice(-8)}`,
      notes: {
        userId: userId,
        planName: "Premium Plan",
        planType: "one-time",
        originalAmount: amount,
        currency: currency,
        countryCode: countryCode,
        timestamp: new Date().toISOString(),
      },
      payment_capture: 1,
    };

    console.log(
      `💳 Creating Razorpay order for user ${userId}: ${currencySymbol}${amount} (${currency})`
    );

    const order = await razorpay.orders.create(options);

    console.log(`✅ Razorpay order created successfully: ${order.id}`);

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        status: order.status,
      },
      key: process.env.RAZORPAY_KEY_ID,
      user: {
        id: userId,
      },
      metadata: {
        countryCode,
        originalCurrency: currency,
        displayAmount: `${currencySymbol}${amount}`,
      },
    });
  } catch (error) {
    console.error("❌ Error creating Razorpay order:", error);

    let errorMessage = "Failed to create payment order";
    let statusCode = 500;

    if (error.message.includes("network") || error.message.includes("fetch")) {
      errorMessage = "Network error. Please try again.";
      statusCode = 503;
    } else if (
      error.message.includes("unauthorized") ||
      error.message.includes("authentication")
    ) {
      errorMessage = "Payment service authentication failed";
      statusCode = 503;
    } else if (error.statusCode) {
      statusCode =
        error.statusCode >= 400 && error.statusCode < 600
          ? error.statusCode
          : 500;
      errorMessage = error.error?.description || error.message || errorMessage;
    }

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: statusCode }
    );
  }
}
