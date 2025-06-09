"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useUser } from "./useUser";
import { cachedFetch, apiCache } from "@/lib/apiCache";
import { UserData, ValidationResults, Order } from "@/types";

interface UseUserDataReturn extends UserData {
  user: any;
  isLoaded: boolean;
  isSignedIn: boolean;
  refreshUserData: () => Promise<void>;
  updatePlanStatus: (isPremium: boolean) => Promise<boolean>;
  validateIdea: (idea: string) => Promise<ValidationResults>;
  fetchOrderHistory: () => Promise<Order[]>;
}

export const useUserData = (): UseUserDataReturn => {
  const { user, isLoaded, isSignedIn } = useUser();
  const [userData, setUserData] = useState<UserData>({
    isPremium: false,
    promptsUsed: 0,
    promptsRemaining: 1,
    dailyPromptsLimit: 1,
    promptsResetDate: null,
    weeklyPromptsUsed: 0,
    weeklyPromptsLimit: 4,
    weeklyPromptsResetDate: null,
    isInitialized: false,
  });
  const fetchingRef = useRef(false);
  const lastFetchRef = useRef(0);

  const fetchUserData = useCallback(
    async (forceRefresh: boolean = false): Promise<void> => {
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
            weeklyPromptsUsed,
            weeklyPromptsLimit,
            weeklyPromptsResetDate,
          } = result.user;

          const isPremiumUser = planId === "premium";
          const newUserData: UserData = {
            isPremium: isPremiumUser,
            promptsUsed: promptsUsed || 0,
            promptsRemaining: promptsRemaining || (isPremiumUser ? 3 : 1),
            dailyPromptsLimit: dailyPromptsLimit || (isPremiumUser ? 3 : 1),
            promptsResetDate: promptsResetDate || null,
            weeklyPromptsUsed: weeklyPromptsUsed || 0,
            weeklyPromptsLimit: weeklyPromptsLimit || (isPremiumUser ? 10 : 4),
            weeklyPromptsResetDate: weeklyPromptsResetDate || null,
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

  const initializeUserData = useCallback(async (): Promise<void> => {
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
    async (isPremium: boolean): Promise<boolean> => {
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
    async (idea: string): Promise<ValidationResults> => {
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

  const fetchOrderHistory = useCallback(async (): Promise<Order[]> => {
    try {
      const response = await fetch("/api/user/orders", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const data = await response.json();
        return data.orders || [];
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch order history");
      }
    } catch (error) {
      console.error("❌ Error fetching order history:", error);
      throw error;
    }
  }, []);

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
    fetchOrderHistory,
  };
};

export default useUserData;