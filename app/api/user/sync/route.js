import { auth } from "@clerk/nextjs/server";
import UserService from "../../../../lib/services/UserService";

export async function POST(request) {
  try {
    // Get the authenticated user from Clerk
    const { userId } = await auth();

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user data from the request body
    const userData = await request.json();

    // Validate that the user ID matches
    if (userData.id !== userId) {
      return Response.json({ error: "User ID mismatch" }, { status: 403 });
    }

    console.log("🔄 Storing user data in database...");

    // Store user data in MongoDB
    const user = await UserService.upsertUser(userData);

    return Response.json({
      success: true,
      message: "User data stored successfully",
      user: {
        id: user._id,
        clerkId: user.clerkId,
        email: user.email,
        lastActive: user.lastActive,
      },
    });
  } catch (error) {
    console.error("❌ Error in user sync API:", error.message);

    return Response.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
