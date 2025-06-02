"use client";

import { useCallback } from "react";
import { useUserData } from "@/contexts/UserDataContext";

export function useUserActions() {
  const { updateLocalUserData } = useUserData();

  const validateIdea = useCallback(
    async (idea) => {
      try {
        console.log("🚀 Starting idea validation...");

        // Get current values from localStorage
        const currentRemaining = parseInt(
          localStorage.getItem("promptsRemaining") || "2"
        );
        const currentUsed = parseInt(
          localStorage.getItem("promptsUsed") || "0"
        );

        // Optimistically update local state
        updateLocalUserData({
          promptsRemaining: Math.max(0, currentRemaining - 1),
          promptsUsed: currentUsed + 1,
        });

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

        // Revert optimistic update
        const storedRemaining = parseInt(
          localStorage.getItem("promptsRemaining") || "2"
        );
        const storedUsed = parseInt(localStorage.getItem("promptsUsed") || "0");

        updateLocalUserData({
          promptsRemaining: storedRemaining,
          promptsUsed: storedUsed,
        });

        throw error;
      }
    },
    [updateLocalUserData]
  );

  return { validateIdea };
}
