import { useEffect, useRef, useState } from "react";
import { useUser } from "./useUser";

export const useUserSync = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const syncedRef = useRef(false);
  const [planData, setPlanData] = useState({
    isPremium: false,
    promptsUsed: 0,
    promptsRemaining: 2,
    dailyPromptsLimit: 2,
    promptsResetDate: null,
  });

  useEffect(() => {
    const syncUserData = async () => {
      if (!isLoaded || !isSignedIn || !user || syncedRef.current) {
        return;
      }

      try {
        console.log("🔄 Syncing user data with database...");

        const response = await fetch("/api/user/sync", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        });

        if (response.ok) {
          const result = await response.json();
          console.log("✅ User data synced successfully:", result.message);

          if (result.user) {
            const {
              planId,
              promptsUsed,
              promptsRemaining,
              dailyPromptsLimit,
              promptsResetDate,
            } = result.user;
            setPlanData({
              isPremium: planId === "premium",
              promptsUsed: promptsUsed || 0,
              promptsRemaining: promptsRemaining || 2,
              dailyPromptsLimit: dailyPromptsLimit || 2,
              promptsResetDate: promptsResetDate || null,
            });

            localStorage.setItem(
              "isPremium",
              planId === "premium" ? "true" : "false"
            );
            localStorage.setItem(
              "promptsRemaining",
              promptsRemaining?.toString() || "2"
            );
          }

          syncedRef.current = true;
        } else {
          const error = await response.json();
          console.error("❌ Failed to sync user data:", error.error);
        }
      } catch (error) {
        console.error("❌ Error syncing user data:", error.message);
      }
    };

    syncUserData();

    const fetchUserData = async () => {
      if (!isLoaded || !isSignedIn || !user) {
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
            setPlanData({
              isPremium: planId === "premium",
              promptsUsed: promptsUsed || 0,
              promptsRemaining: promptsRemaining || 2,
              dailyPromptsLimit: dailyPromptsLimit || 2,
              promptsResetDate: promptsResetDate || null,
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
          }
        }
      } catch (error) {
        console.error("❌ Error fetching user data:", error.message);
      }
    };

    fetchUserData();
  }, [isLoaded, isSignedIn, user]);

  return { user, isLoaded, isSignedIn, ...planData };
};

export default useUserSync;
