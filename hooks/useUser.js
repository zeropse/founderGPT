import { useUser as useClerkUser } from "@clerk/nextjs";

export const useUser = () => {
  const { user, isLoaded, isSignedIn } = useClerkUser();

  return {
    user: user
      ? {
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: user.fullName,
          name:
            user.fullName ||
            `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
            "User",
          email: user.primaryEmailAddress?.emailAddress,
          imageUrl: user.imageUrl,
          avatar: user.imageUrl,
          hasImage: user.hasImage,
          id: user.id,
        }
      : null,
    isLoaded,
    isSignedIn,
  };
};
