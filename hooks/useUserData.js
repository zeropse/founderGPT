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
    isLoading: true,
  });

  const fetchUserData = useCallback(async () => {
    if (!isLoaded || !isSignedIn || !user) {
      setUserData((prev) => ({ ...prev, isLoading: false }));
      return;
    }

    try {
      const response = await fetch("/api/user/sync", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
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
            isLoading: false,
          });
        }
      } else {
        console.error("Failed to fetch user data");
        setUserData((prev) => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error("❌ Error fetching user data:", error.message);
      setUserData((prev) => ({ ...prev, isLoading: false }));
    }
  }, [isLoaded, isSignedIn, user]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const refreshUserData = useCallback(() => {
    return fetchUserData();
  }, [fetchUserData]);

  return {
    ...userData,
    refreshUserData,
  };
};

export default useUserData;
