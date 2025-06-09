"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Crown, Shield, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@/hooks/useUser";
import { getRazorpayErrorMessage } from "@/lib/utils/paymentUtils";
import {
  detectUserLocation,
  getCurrencyForCountry,
  formatCurrencyAmount,
  validatePaymentAmountByCurrency,
} from "@/lib/utils/locationUtils";
import { CurrencyConfig } from "@/types";

// Razorpay type definitions
interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayError {
  code: string;
  description: string;
  field?: string;
  step?: string;
  reason?: string;
  metadata?: any;
}

interface RazorpayFailureResponse {
  error: RazorpayError;
}

interface RazorpayInstance {
  open(): void;
  on(event: string, handler: (response: any) => void): void;
}

interface RazorpayPaymentProps {
  amount?: number;
  onSuccess: (data: any) => void;
  onError: (error: any) => void;
  disabled?: boolean;
  className?: string;
  buttonText?: string;
  showSecurityBadge?: boolean;
}

type PaymentState =
  | "idle"
  | "loading"
  | "processing"
  | "verifying"
  | "success"
  | "error";

const RazorpayPayment = ({
  amount = 5,
  onSuccess,
  onError,
  disabled = false,
  className = "",
  buttonText,
  showSecurityBadge = true,
}: RazorpayPaymentProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentState, setPaymentState] = useState<PaymentState>("idle");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<string | null>(null);
  const [currencyConfig, setCurrencyConfig] = useState<CurrencyConfig | null>(
    null
  );
  const [localizedAmount, setLocalizedAmount] = useState(amount);
  const [isDetectingLocation, setIsDetectingLocation] = useState(true);
  const { user } = useUser();
  const razorpayRef = useRef<RazorpayInstance | null>(null);
  const retryCountRef = useRef(0);
  const maxRetries = 3;

  useEffect(() => {
    const initializeLocation = async () => {
      try {
        setIsDetectingLocation(true);
        const location = await detectUserLocation();
        const currency = getCurrencyForCountry(location);

        setUserLocation(location);
        setCurrencyConfig(currency);
        setLocalizedAmount(currency.premiumPrice);

        console.log(
          `🌍 Detected location: ${location}, Currency: ${currency.code}, Amount: ${currency.premiumPrice}`
        );
      } catch (error) {
        console.error("Failed to detect location:", error);
        // Fallback to USD
        const defaultCurrency = getCurrencyForCountry("US");
        setCurrencyConfig(defaultCurrency);
        setLocalizedAmount(defaultCurrency.premiumPrice);
      } finally {
        setIsDetectingLocation(false);
      }
    };

    initializeLocation();
  }, []);

  useEffect(() => {
    if (currencyConfig) {
      const validation = validatePaymentAmountByCurrency(
        localizedAmount,
        currencyConfig
      );
      if (!validation.isValid) {
        setValidationError(validation.error || null);
      } else {
        setValidationError(null);
      }
    }
  }, [localizedAmount, currencyConfig]);

  const loadRazorpayScript = useCallback(() => {
    return new Promise((resolve) => {
      if (window.Razorpay && typeof window.Razorpay === "function") {
        resolve(true);
        return;
      }

      const existingScript = document.querySelector(
        'script[src*="checkout.razorpay.com"]'
      ) as HTMLScriptElement;
      if (existingScript) {
        existingScript.onload = () => resolve(true);
        existingScript.onerror = () => resolve(false);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => {
        if (window.Razorpay) {
          resolve(true);
        } else {
          resolve(false);
        }
      };
      script.onerror = () => resolve(false);

      const timeout = setTimeout(() => {
        resolve(false);
      }, 10000);

      script.onload = () => {
        clearTimeout(timeout);
        resolve(window.Razorpay ? true : false);
      };

      document.head.appendChild(script);
    });
  }, []);

  const createOrder = useCallback(async () => {
    const response = await fetch("/api/payment/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        amount: localizedAmount,
        currency: currencyConfig?.code || "USD",
        countryCode: userLocation || "US",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `HTTP ${response.status}: ${response.statusText}`
      );
    }

    const orderData = await response.json();

    if (!orderData.success) {
      throw new Error(orderData.error || "Failed to create payment order");
    }

    return orderData;
  }, [localizedAmount, currencyConfig, userLocation]);

  const verifyPayment = useCallback(
    async (paymentResponse: RazorpayResponse) => {
      const verifyResponse = await fetch("/api/payment/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_signature: paymentResponse.razorpay_signature,
        }),
      });

      if (!verifyResponse.ok) {
        const errorData = await verifyResponse.json().catch(() => ({}));
        throw new Error(
          errorData.error ||
            `Verification failed: HTTP ${verifyResponse.status}`
        );
      }

      const verifyData = await verifyResponse.json();

      if (!verifyData.success) {
        throw new Error(verifyData.error || "Payment verification failed");
      }

      return verifyData;
    },
    []
  );

  const handlePayment = async () => {
    if (isLoading || paymentState === "processing" || !currencyConfig) {
      return;
    }

    try {
      setIsLoading(true);
      setPaymentState("loading");
      retryCountRef.current = 0;

      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error(
          "Failed to load Razorpay SDK. Please check your internet connection and try again."
        );
      }

      let orderData;
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          orderData = await createOrder();
          break;
        } catch (error) {
          if (attempt === maxRetries) {
            const errorMessage =
              error instanceof Error ? error.message : "Unknown error";
            throw new Error(
              `Failed to create payment order after ${maxRetries} attempts: ${errorMessage}`
            );
          }
          await new Promise((resolve) =>
            setTimeout(resolve, Math.pow(2, attempt) * 1000)
          );
        }
      }

      setPaymentState("processing");

      const prefillData = {
        name: user?.name || user?.fullName || "",
        email: user?.email || "",
      };

      const options = {
        key: orderData.key,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "FoundrGPT",
        description: "Premium Plan - One-time Payment",
        image: "/favicon.png",
        order_id: orderData.order.id,
        handler: async (response: RazorpayResponse) => {
          try {
            setPaymentState("processing");
            toast.loading("Verifying payment...", { id: "payment-verify" });

            const verifyData = await verifyPayment(response);

            toast.dismiss("payment-verify");
            toast.success("🎉 Payment successful! You're now a Premium user!", {
              duration: 5000,
            });

            setPaymentState("success");
            onSuccess?.(verifyData);
          } catch (error) {
            console.error("Payment verification error:", error);
            toast.dismiss("payment-verify");
            toast.error(
              "Payment verification failed. Please contact support if the amount was deducted.",
              {
                duration: 8000,
              }
            );
            setPaymentState("error");
            onError?.(error);
          } finally {
            setIsLoading(false);
          }
        },
        prefill: prefillData,
        notes: {
          address: "FoundrGPT Premium Upgrade",
          userId: user?.id || "",
          userEmail: user?.email || "",
        },
        theme: {
          color: "#7c3aed",
          backdrop_color: "rgba(0, 0, 0, 0.6)",
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
            setPaymentState("idle");
            toast.info("Payment cancelled", { duration: 3000 });

            if (razorpayRef.current) {
              razorpayRef.current = null;
            }
          },
          confirm_close: true,
          escape: true,
        },
        retry: {
          enabled: true,
          max_count: 3,
        },
        timeout: 300,
        remember_customer: false,
      };

      if (window.Razorpay) {
        razorpayRef.current = new window.Razorpay(options);
      } else {
        throw new Error("Razorpay SDK not loaded");
      }

      if (razorpayRef.current) {
        razorpayRef.current.on(
          "payment.failed",
          (response: RazorpayFailureResponse) => {
            console.error("Payment failed:", response.error);

            const userFriendlyMessage = getRazorpayErrorMessage(response.error);
            toast.error(userFriendlyMessage, { duration: 6000 });
            setPaymentState("error");
            onError?.(
              new Error(response.error.description || "Payment failed")
            );
            setIsLoading(false);
          }
        );

        razorpayRef.current.open();
      }
    } catch (error) {
      console.error("Payment initialization error:", error);

      let errorMessage = "Failed to initiate payment";
      if (error instanceof Error) {
        if (
          error.message.includes("network") ||
          error.message.includes("fetch")
        ) {
          errorMessage =
            "Network error. Please check your connection and try again.";
        } else if (error.message.includes("SDK")) {
          errorMessage = "Payment system unavailable. Please try again later.";
        } else {
          errorMessage = error.message || errorMessage;
        }
      }

      toast.error(errorMessage, { duration: 6000 });
      setPaymentState("error");
      onError?.(error instanceof Error ? error : new Error("Unknown error"));
      setIsLoading(false);
    }
  };

  const getButtonContent = () => {
    if (isLoading) {
      const loadingTexts: Record<PaymentState, string> = {
        idle: "Processing...",
        loading: "Loading payment...",
        processing: "Processing payment...",
        verifying: "Verifying payment...",
        success: "Payment successful!",
        error: "Payment failed",
      };

      return (
        <div className="flex items-center justify-center">
          <LoadingSpinner size="sm" variant="white" />
          <span className="ml-2">
            {loadingTexts[paymentState] || "Processing..."}
          </span>
        </div>
      );
    }

    if (buttonText) {
      return (
        <>
          <Crown className="mr-2 h-4 w-4" />
          {buttonText}
        </>
      );
    }

    if (currencyConfig && localizedAmount) {
      return (
        <>
          <Crown className="mr-2 h-4 w-4" />
          Pay {formatCurrencyAmount(localizedAmount, currencyConfig)} - Upgrade
          to Premium
        </>
      );
    }

    return (
      <>
        <Crown className="mr-2 h-4 w-4" />
        Upgrade to Premium
      </>
    );
  };

  return (
    <div className="space-y-3">
      {validationError && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      <Button
        onClick={handlePayment}
        className={`w-full bg-violet-600 hover:bg-violet-700 transition-all duration-200 cursor-pointer dark:text-white ${className}`}
        disabled={
          disabled ||
          isLoading ||
          !!validationError ||
          isDetectingLocation ||
          !currencyConfig
        }
        size="lg"
      >
        {isDetectingLocation ? (
          <div className="flex items-center justify-center">
            <LoadingSpinner size="sm" variant="white" />
            <span className="ml-2">Detecting location...</span>
          </div>
        ) : (
          getButtonContent()
        )}
      </Button>

      {showSecurityBadge && (
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Shield className="h-3 w-3 text-green-600" />
          <span>Secured by Razorpay • SSL Encrypted</span>
        </div>
      )}
    </div>
  );
};

export default RazorpayPayment;
