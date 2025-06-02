import { auth } from "@clerk/nextjs/server";
import UserService from "../../../../lib/services/UserService";

export async function POST(request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userData = await request.json();

    if (userData.id !== userId) {
      return Response.json({ error: "User ID mismatch" }, { status: 403 });
    }

    console.log("🔄 Storing user data in database...");

    const user = await UserService.upsertUser(userData);

    return Response.json({
      success: true,
      message: "User data stored successfully",
      user: {
        id: user._id,
        clerkId: user.clerkId,
        email: user.email,
        lastActive: user.lastActive,
        planId: user.planId,
        promptsUsed: user.promptsUsed,
        promptsRemaining: user.promptsRemaining,
        dailyPromptsLimit: user.dailyPromptsLimit,
        promptsResetDate: user.promptsResetDate,
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

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await UserService.getUserByClerkId(userId);

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json({
      success: true,
      user: {
        id: user._id,
        clerkId: user.clerkId,
        email: user.email,
        planId: user.planId,
        promptsUsed: user.promptsUsed,
        promptsRemaining: user.promptsRemaining,
        dailyPromptsLimit: user.dailyPromptsLimit,
        promptsResetDate: user.promptsResetDate,
        isPremium: user.planId === "premium",
      },
    });
  } catch (error) {
    console.error("❌ Error in get user API:", error.message);

    return Response.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
