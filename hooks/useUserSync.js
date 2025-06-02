import { useEffect, useRef } from "react";
import { useUser } from "./useUser";

export const useUserSync = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const syncedRef = useRef(false);

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
  }, [isLoaded, isSignedIn, user]);

  return { user, isLoaded, isSignedIn };
};

export default useUserSync;
