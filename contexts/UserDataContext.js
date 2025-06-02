"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";

const UserDataContext = createContext();

export function UserDataProvider({ children }) {
  const [userData, setUserData] = useState({
    isPremium: false,
    promptsUsed: 0,
    promptsRemaining: 2,
    dailyPromptsLimit: 2,
    promptsResetDate: null,
    isInitialized: false,
  });

  const initializationRef = useRef(false);

  // Initialize user data only once when explicitly called
  const initializeUserData = useCallback(async (user) => {
    if (initializationRef.current || !user) {
      return;
    }

    try {
      console.log("🔄 Initializing user data...");

      // Load cached data immediately for better UX
      const cachedPremium = localStorage.getItem("isPremium");
      const cachedPrompts = localStorage.getItem("promptsRemaining");

      if (cachedPremium && cachedPrompts) {
        setUserData((prev) => ({
          ...prev,
          isPremium: cachedPremium === "true",
          promptsRemaining: parseInt(cachedPrompts) || 2,
          isInitialized: true,
        }));
      }

      // Sync with database once
      const response = await fetch("/api/user/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
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

          // Update localStorage
          localStorage.setItem(
            "isPremium",
            planId === "premium" ? "true" : "false"
          );
          localStorage.setItem(
            "promptsRemaining",
            promptsRemaining?.toString() || "2"
          );

          initializationRef.current = true;
          console.log("✅ User data initialized successfully");
        }
      }
    } catch (error) {
      console.error("❌ Error initializing user data:", error.message);
    }
  }, []);

  // Refresh user data from database (called after actions)
  const refreshUserData = useCallback(async () => {
    try {
      console.log("🔄 Refreshing user data from database...");

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
            isInitialized: true,
          });

          // Update localStorage
          localStorage.setItem(
            "isPremium",
            planId === "premium" ? "true" : "false"
          );
          localStorage.setItem(
            "promptsRemaining",
            promptsRemaining?.toString() || "2"
          );

          console.log("✅ User data refreshed successfully");
        }
      }
    } catch (error) {
      console.error("❌ Error refreshing user data:", error.message);
    }
  }, []);

  // Update local state without database call (for immediate UI updates)
  const updateLocalUserData = useCallback((updates) => {
    setUserData((prev) => ({
      ...prev,
      ...updates,
    }));
  }, []);

  const value = {
    ...userData,
    initializeUserData,
    refreshUserData,
    updateLocalUserData,
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
}

export const useUserData = () => {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error("useUserData must be used within a UserDataProvider");
  }
  return context;
};
