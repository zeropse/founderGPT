import { useEffect, useRef } from "react";
import { useUser } from "./useUser";
import { useUserData } from "../contexts/UserDataContext";

export const useUserSync = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const userData = useUserData();
  const initializationAttempted = useRef(false);

  // Initialize user data only once when user is loaded and signed in
  useEffect(() => {
    const initialize = async () => {
      if (
        !isLoaded ||
        !isSignedIn ||
        !user ||
        initializationAttempted.current ||
        userData.isInitialized
      ) {
        return;
      }

      initializationAttempted.current = true;
      await userData.initializeUserData(user);
    };

    initialize();
  }, [isLoaded, isSignedIn, user, userData, userData.isInitialized]);

  return {
    user,
    isLoaded,
    isSignedIn,
    ...userData,
  };
};

export default useUserSync;
