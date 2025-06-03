"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useUser } from "./useUser";
import { cachedFetch, apiCache } from "@/lib/apiCache";

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
  const fetchingRef = useRef(false);
  const lastFetchRef = useRef(0);

  const fetchUserData = useCallback(
    async (forceRefresh = false) => {
      if (!isLoaded || !isSignedIn || !user) return;

      const now = Date.now();

      if (fetchingRef.current && now - lastFetchRef.current < 1000) {
        return;
      }

      fetchingRef.current = true;
      lastFetchRef.current = now;

      try {
        const maxAge = forceRefresh ? 0 : 30000;
        const result = await cachedFetch(
          "/api/user/sync",
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          },
          maxAge
        );

        if (result.user) {
          const {
            planId,
            promptsUsed,
            promptsRemaining,
            dailyPromptsLimit,
            promptsResetDate,
          } = result.user;

          const newUserData = {
            isPremium: planId === "premium",
            promptsUsed: promptsUsed || 0,
            promptsRemaining: promptsRemaining || 2,
            dailyPromptsLimit: dailyPromptsLimit || 2,
            promptsResetDate: promptsResetDate || null,
            isInitialized: true,
          };

          setUserData(newUserData);
        }
      } catch (error) {
        console.error("❌ Error fetching user data:", error);
      } finally {
        fetchingRef.current = false;
      }
    },
    [isLoaded, isSignedIn, user]
  );

  const initializeUserData = useCallback(async () => {
    if (!user) return;

    try {
      const response = await fetch("/api/user/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        await fetchUserData(true);
      }
    } catch (error) {
      console.error("❌ Error initializing user data:", error);
    }
  }, [user, fetchUserData]);

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
          apiCache.clear("/api/user/sync");
          await fetchUserData(true);
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
    refreshUserData: () => fetchUserData(true),
    updatePlanStatus,
    validateIdea,
  };
};

export default useUserData;
