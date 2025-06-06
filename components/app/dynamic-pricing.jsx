"use client";

import { useState, useEffect } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  detectUserLocation,
  getCurrencyForCountry,
  formatCurrencyAmount,
} from "@/lib/utils/locationUtils";

export function DynamicPricing({ type = "premium", className = "" }) {
  const [currencyConfig, setCurrencyConfig] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializePricing = async () => {
      try {
        setIsLoading(true);
        const location = await detectUserLocation();
        const currency = getCurrencyForCountry(location);

        setUserLocation(location);
        setCurrencyConfig(currency);
      } catch (error) {
        console.error("Failed to detect location for pricing:", error);
        const defaultCurrency = getCurrencyForCountry("US");
        setCurrencyConfig(defaultCurrency);
        setUserLocation("US");
      } finally {
        setIsLoading(false);
      }
    };

    initializePricing();
  }, []);

  if (isLoading || !currencyConfig) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <LoadingSpinner size="sm" />
        <span className="text-muted-foreground">Loading price...</span>
      </div>
    );
  }

  const price = type === "premium" ? currencyConfig.premiumPrice : 0;
  const formattedPrice =
    type === "premium"
      ? formatCurrencyAmount(price, currencyConfig)
      : formatCurrencyAmount(0, currencyConfig);

  return (
    <div className={className}>
      <span className="text-lg font-semibold">{formattedPrice}</span>
    </div>
  );
}

export function DynamicPricingLarge({
  type = "premium",
  className = "",
  showPeriod = true,
  period = "one-time",
}) {
  const [currencyConfig, setCurrencyConfig] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializePricing = async () => {
      try {
        setIsLoading(true);
        const location = await detectUserLocation();
        const currency = getCurrencyForCountry(location);

        setUserLocation(location);
        setCurrencyConfig(currency);
      } catch (error) {
        console.error("Failed to detect location for pricing:", error);
        const defaultCurrency = getCurrencyForCountry("US");
        setCurrencyConfig(defaultCurrency);
        setUserLocation("US");
      } finally {
        setIsLoading(false);
      }
    };

    initializePricing();
  }, []);

  if (isLoading || !currencyConfig) {
    return (
      <div
        className={`text-5xl font-bold flex items-center gap-2 ${className}`}
      >
        <LoadingSpinner size="sm" />
        <span className="text-lg text-muted-foreground">Loading...</span>
      </div>
    );
  }

  const price = type === "premium" ? currencyConfig.premiumPrice : 0;
  const formattedPrice =
    type === "premium"
      ? formatCurrencyAmount(price, currencyConfig)
      : formatCurrencyAmount(0, currencyConfig);

  return (
    <div className={className}>
      <div className="text-3xl font-bold">
        {formattedPrice}
        {showPeriod && (
          <span className="text-lg font-normal text-muted-foreground ml-1">
            {type === "premium" ? period : "forever"}
          </span>
        )}
      </div>
      {userLocation === "IN" && type === "premium" && (
        <div className="text-sm text-violet-600 font-medium mt-1">
          🇮🇳 Special pricing for India
        </div>
      )}
    </div>
  );
}
