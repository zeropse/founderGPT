"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "./useUser";

export const useUserData = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const [userData, setUserData] = useState({
    isPremium: false,
    promptsUsed: 0,
    promptsRemaining: 2,
    dailyPromptsLimit: 2,
    promptsResetDate: null,
    isInitialized: false,
  });

  const fetchUserData = useCallback(async () => {
    if (!isLoaded || !isSignedIn || !user) return;

    try {
      const response = await fetch("/api/user/sync", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.user) {
          const {
            planId,
            promptsUsed,
            promptsRemaining,
            dailyPromptsLimit,
            promptsResetDate,
          } = result.user;
          setUserData({
            isPremium: planId === "premium",
            promptsUsed: promptsUsed || 0,
            promptsRemaining: promptsRemaining || 2,
            dailyPromptsLimit: dailyPromptsLimit || 2,
            promptsResetDate: promptsResetDate || null,
            isInitialized: true,
          });
        }
      }
    } catch (error) {
      console.error("❌ Error fetching user data:", error);
    }
  }, [isLoaded, isSignedIn, user]);

  const initializeUserData = useCallback(async () => {
    if (!user) return;

    try {
      const response = await fetch("/api/user/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        await fetchUserData();
      }
    } catch (error) {
      console.error("❌ Error initializing user data:", error);
    }
  }, [user, fetchUserData]);

  // Update plan status
  const updatePlanStatus = useCallback(
    async (isPremium) => {
      try {
        const response = await fetch("/api/user/plan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isPremium }),
        });

        if (response.ok) {
          await fetchUserData();
          return true;
        }
        return false;
      } catch (error) {
        console.error("❌ Error updating plan:", error);
        return false;
      }
    },
    [fetchUserData]
  );

  const validateIdea = useCallback(
    async (idea) => {
      try {
        const response = await fetch("/api/validate-idea", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idea }),
        });

        if (response.ok) {
          const data = await response.json();
          await fetchUserData();
          return data;
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to validate idea");
        }
      } catch (error) {
        console.error("❌ Idea validation failed:", error);
        throw error;
      }
    },
    [fetchUserData]
  );

  useEffect(() => {
    if (isLoaded && isSignedIn && user && !userData.isInitialized) {
      initializeUserData();
    }
  }, [isLoaded, isSignedIn, user, userData.isInitialized, initializeUserData]);

  return {
    ...userData,
    user,
    isLoaded,
    isSignedIn,
    refreshUserData: fetchUserData,
    updatePlanStatus,
    validateIdea,
  };
};

export default useUserData;
