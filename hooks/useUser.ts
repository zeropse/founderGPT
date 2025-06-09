import { useUser as useClerkUser } from "@clerk/nextjs";
import { User } from "@/types";

interface UseUserReturn {
  user: User | null;
  isLoaded: boolean;
  isSignedIn: boolean;
}

export const useUser = (): UseUserReturn => {
  const { user, isLoaded, isSignedIn } = useClerkUser();

  return {
    user: user
      ? {
          firstName: user.firstName || undefined,
          lastName: user.lastName || undefined,
          fullName: user.fullName || undefined,
          name:
            user.fullName ||
            `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
            "User",
          email: user.primaryEmailAddress?.emailAddress || "",
          imageUrl: user.imageUrl,
          avatar: user.imageUrl,
          hasImage: user.hasImage,
          id: user.id,
        }
      : null,
    isLoaded,
    isSignedIn: isSignedIn || false,
  };
};