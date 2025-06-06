import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Using a free exchange rate API to get USD to INR conversion
    const response = await fetch(
      "https://api.exchangerate-api.com/v4/latest/USD"
    );

    if (!response.ok) {
      throw new Error("Failed to fetch exchange rate");
    }

    const data = await response.json();
    const usdToInr = data.rates.INR;

    // Base amount in USD is $5
    const baseAmountUSD = 5;
    const convertedINR = Math.round(baseAmountUSD * usdToInr);

    return NextResponse.json({
      success: true,
      rates: {
        USD: baseAmountUSD,
        INR: convertedINR,
      },
      exchangeRate: usdToInr,
      lastUpdated: data.date,
    });
  } catch (error) {
    console.error("❌ Error fetching exchange rate:", error);

    // Fallback exchange rate if API fails
    const fallbackRate = 83; // Approximate USD to INR rate
    const baseAmountUSD = 5;
    const fallbackINR = Math.round(baseAmountUSD * fallbackRate);

    return NextResponse.json({
      success: true,
      rates: {
        USD: baseAmountUSD,
        INR: fallbackINR,
      },
      exchangeRate: fallbackRate,
      lastUpdated: new Date().toISOString().split("T")[0],
      fallback: true,
    });
  }
}
