"use client";

import { useCallback } from "react";

export function useUserActions() {
  const validateIdea = useCallback(async (idea) => {
    try {
      console.log("🚀 Starting idea validation...");

      const response = await fetch("/api/validate-idea", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idea }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to validate idea");
      }

      const data = await response.json();
      console.log("✅ Idea validation completed successfully");

      return data;
    } catch (error) {
      console.error("❌ Idea validation failed:", error);
      throw error;
    }
  }, []);

  return { validateIdea };
}
