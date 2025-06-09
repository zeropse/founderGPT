import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import UserService from "../../../../lib/services/UserService";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { isPremium } = await request.json();

    if (typeof isPremium !== "boolean") {
      return Response.json(
        { error: "Invalid request. isPremium boolean required" },
        { status: 400 }
      );
    }

    const user = await UserService.updatePlanStatus(userId, isPremium);

    return Response.json({
      success: true,
      message: `Plan updated to ${isPremium ? "Premium" : "Free"} successfully`,
      user: {
        id: user._id,
        clerkId: user.clerkId,
        planId: user.planId,
        promptsUsed: user.promptsUsed,
        promptsRemaining: user.promptsRemaining,
        dailyPromptsLimit: user.dailyPromptsLimit,
        weeklyPromptsUsed: user.weeklyPromptsUsed,
        weeklyPromptsLimit: user.weeklyPromptsLimit,
        weeklyPromptsResetDate: user.weeklyPromptsResetDate,
        isPremium: user.planId === "premium",
      },
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("❌ Error updating user plan:", errorMessage);

    return Response.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
