export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function toSmallestUnit(amount: number): number {
  return Math.round(amount * 100);
}

export function fromSmallestUnit(amount: number): number {
  return amount / 100;
}

export function validatePaymentAmount(amount: number): { isValid: boolean; error?: string } {
  if (typeof amount !== "number" || isNaN(amount)) {
    return {
      isValid: false,
      error: "Amount must be a valid number",
    };
  }

  if (amount < 0.5) {
    return {
      isValid: false,
      error: "Minimum amount is $0.50",
    };
  }

  const maxAmount = 10000;
  if (amount > maxAmount) {
    return {
      isValid: false,
      error: `Maximum amount is ${formatCurrency(maxAmount)}`,
    };
  }

  return { isValid: true };
}

export function generateReceiptId(userId?: string, prefix: string = "rcpt"): string {
  const timestamp = Date.now().toString().slice(-8);
  const userSuffix = userId ? userId.slice(-8) : "unknown";
  return `${prefix}_${userSuffix}_${timestamp}`;
}

interface RazorpayError {
  code?: string;
  description?: string;
  message?: string;
  error?: {
    code?: string;
    description?: string;
  };
}

export function getRazorpayErrorMessage(error: RazorpayError): string {
  if (!error) return "Unknown payment error";

  const errorCode = error.code || error.error?.code;
  const errorDescription =
    error.description || error.error?.description || error.message;

  switch (errorCode) {
    case "BAD_REQUEST_ERROR":
      return "Invalid payment details. Please check and try again.";
    case "GATEWAY_ERROR":
      return "Payment gateway error. Please try again or use a different payment method.";
    case "NETWORK_ERROR":
      return "Network error. Please check your internet connection and try again.";
    case "SERVER_ERROR":
      return "Server error. Please try again in a few moments.";
    case "PAYMENT_FAILED":
      return "Payment was declined. Please check your payment method and try again.";
    case "PAYMENT_CANCELLED":
      return "Payment was cancelled by user.";
    case "PAYMENT_TIMEOUT":
      return "Payment timed out. Please try again.";
    default:
      return errorDescription || "Payment failed. Please try again.";
  }
}

export function validateRazorpayId(id: string, type: 'order' | 'payment' | 'refund'): boolean {
  if (!id || typeof id !== "string") return false;

  const patterns = {
    order: /^order_[A-Za-z0-9]{14}$/,
    payment: /^pay_[A-Za-z0-9]{14}$/,
    refund: /^rfnd_[A-Za-z0-9]{14}$/,
  };

  const pattern = patterns[type];
  return pattern ? pattern.test(id) : false;
}

export function sanitizePaymentData(paymentData: Record<string, any>): Record<string, any> {
  const sensitive = ["razorpay_signature", "card", "bank", "upi"];
  const sanitized = { ...paymentData };

  sensitive.forEach((key) => {
    if (sanitized[key]) {
      sanitized[key] = "[REDACTED]";
    }
  });

  return sanitized;
}

interface ProcessingFee {
  baseAmount: number;
  percentageFee: number;
  fixedFee: number;
  totalFee: number;
  netAmount: number;
}

export function calculateProcessingFee(amount: number): ProcessingFee {
  const feePercentage = 0.029; // 2.9%
  const fixedFee = 0.3; // $0.30 USD

  const percentageFee = amount * feePercentage;
  const totalFee = percentageFee + fixedFee;

  return {
    baseAmount: amount,
    percentageFee: Math.round(percentageFee * 100) / 100,
    fixedFee,
    totalFee: Math.round(totalFee * 100) / 100,
    netAmount: Math.round((amount - totalFee) * 100) / 100,
  };
}