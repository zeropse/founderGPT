import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import crypto from "crypto";
import UserService from "@/lib/services/UserService";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "No signature found" },
        { status: 400 }
      );
    }

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("RAZORPAY_WEBHOOK_SECRET is not configured");
      return NextResponse.json(
        { error: "Webhook configuration error" },
        { status: 500 }
      );
    }

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(body)
      .digest("hex");

    if (signature !== expectedSignature) {
      console.error("Webhook signature verification failed");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(body);

    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;
      const order = event.payload.order?.entity;

      if (payment.notes && payment.notes.userId) {
        const userId = payment.notes.userId;

        try {
          await UserService.updatePlanStatus(userId, true);

          // Get currency from payment or order, default to USD for backwards compatibility
          const currency = payment.currency || order?.currency || "USD";

          const orderData = {
            orderId: payment.id,
            planName: payment.notes.planName || "Premium Plan",
            amount: Number(payment.amount) / 100,
            currency: currency,
            status: "completed",
            paymentMethod: "razorpay",
            razorpayOrderId: order?.id,
            razorpayPaymentId: payment.id,
          };

          await fetch(
            `${
              process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
            }/api/user/orders`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userId}`,
              },
              body: JSON.stringify(orderData),
            }
          );

          console.log(`✅ Payment processed successfully for user ${userId}`);
        } catch (error) {
          console.error("❌ Error processing webhook payment:", error);
          return NextResponse.json(
            { error: "Failed to process payment" },
            { status: 500 }
          );
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
