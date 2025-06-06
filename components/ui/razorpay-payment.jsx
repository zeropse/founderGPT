"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Crown, CreditCard } from "lucide-react";
import { toast } from "sonner";

const RazorpayPayment = ({
  amount = 5,
  currency = "USD",
  currencySymbol = "$",
  onSuccess,
  onError,
  disabled = false,
  className = "",
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    try {
      setIsLoading(true);

      // Load Razorpay script
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error("Failed to load Razorpay SDK");
      }

      // Create order
      const orderResponse = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, currency }),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.error || "Failed to create payment order");
      }

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        throw new Error(orderData.error || "Failed to create payment order");
      }

      const options = {
        key: orderData.key,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "FoundrGPT",
        description: "Premium Plan - One-time Payment",
        order_id: orderData.order.id,
        handler: async (response) => {
          try {
            // Verify payment
            const verifyResponse = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              toast.success("Payment successful! You're now a Premium user!");
              onSuccess?.(verifyData);
            } else {
              throw new Error(
                verifyData.error || "Payment verification failed"
              );
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            toast.error("Payment verification failed. Please contact support.");
            onError?.(error);
          }
        },
        prefill: {
          name: "",
          email: "",
          contact: "",
        },
        notes: {
          address: "FoundrGPT Premium Upgrade",
        },
        theme: {
          color: "#7c3aed", // violet-600
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
            console.log("Payment modal closed");
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", (response) => {
        console.error("Payment failed:", response.error);
        toast.error("Payment failed. Please try again.");
        onError?.(new Error(response.error.description || "Payment failed"));
        setIsLoading(false);
      });

      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error.message || "Failed to initiate payment");
      onError?.(error);
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      className={`w-full bg-violet-600 hover:bg-violet-700 cursor-pointer ${className}`}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <LoadingSpinner size="sm" variant="white" />
          <span className="ml-2">Processing...</span>
        </div>
      ) : (
        <>
          <Crown className="mr-2 h-4 w-4" />
          Pay ${amount} - Upgrade to Premium
        </>
      )}
    </Button>
  );
};

export default RazorpayPayment;
