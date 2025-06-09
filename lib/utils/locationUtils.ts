import { CurrencyConfig } from '@/types';

// Currency configurations
export const CURRENCY_CONFIG: Record<string, CurrencyConfig> = {
  USD: {
    symbol: "$",
    code: "USD",
    multiplier: 100,
    minimumAmount: 0.5,
    premiumPrice: 5,
  },
  INR: {
    symbol: "₹",
    code: "INR",
    multiplier: 100,
    minimumAmount: 1,
    premiumPrice: 420,
  },
};

export const detectUserLocation = async (): Promise<string> => {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    if (
      timezone.includes("Kolkata") ||
      timezone.includes("Mumbai") ||
      timezone.includes("Chennai") ||
      timezone.includes("Delhi") ||
      timezone.includes("Asia/Kolkata") ||
      timezone.includes("Asia/Calcutta")
    ) {
      return "IN";
    }
  } catch (error) {
    console.warn("❌ Failed to detect location:", error);
  }

  console.log("🇺🇸 Falling back to US");
  return "US";
};

export const getCurrencyForCountry = (countryCode: string): CurrencyConfig => {
  switch (countryCode) {
    case "IN":
      return CURRENCY_CONFIG.INR;
    case "US":
    default:
      return CURRENCY_CONFIG.USD;
  }
};

export const formatCurrencyAmount = (amount: number, currencyConfig: CurrencyConfig): string => {
  const locale = currencyConfig.code === "INR" ? "en-IN" : "en-US";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyConfig.code,
    minimumFractionDigits: currencyConfig.code === "INR" ? 0 : 2,
    maximumFractionDigits: currencyConfig.code === "INR" ? 0 : 2,
  }).format(amount);
};

export const toSmallestCurrencyUnit = (amount: number, currencyConfig: CurrencyConfig): number => {
  return Math.round(amount * currencyConfig.multiplier);
};

export const fromSmallestCurrencyUnit = (amount: number, currencyConfig: CurrencyConfig): number => {
  return amount / currencyConfig.multiplier;
};

export const validatePaymentAmountByCurrency = (
  amount: number,
  currencyConfig: CurrencyConfig
): { isValid: boolean; error?: string } => {
  if (typeof amount !== "number" || isNaN(amount)) {
    return {
      isValid: false,
      error: "Amount must be a valid number",
    };
  }

  if (amount < currencyConfig.minimumAmount) {
    return {
      isValid: false,
      error: `Minimum amount is ${formatCurrencyAmount(
        currencyConfig.minimumAmount,
        currencyConfig
      )}`,
    };
  }

  const maxAmount = currencyConfig.code === "INR" ? 50000 : 10000;
  if (amount > maxAmount) {
    return {
      isValid: false,
      error: `Maximum amount is ${formatCurrencyAmount(
        maxAmount,
        currencyConfig
      )}`,
    };
  }

  return { isValid: true };
};