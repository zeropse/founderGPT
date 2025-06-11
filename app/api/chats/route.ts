import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import UserService from "@/lib/services/UserService";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const chats = await UserService.getChatHistory(userId);

    return Response.json({
      success: true,
      chats,
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("❌ Error fetching chats:", errorMessage);
    return Response.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { idea, results } = await request.json();

    if (!idea || !results) {
      return Response.json(
        { error: "Idea and results are required" },
        { status: 400 }
      );
    }

    try {
      const newChat = await UserService.saveChatHistory(userId, idea, results);

      return Response.json({
        success: true,
        chat: newChat,
        message: "Chat saved successfully",
      });
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        error.message.includes("Maximum chat limit reached")
      ) {
        return Response.json(
          {
            success: false,
            error: error.message,
            maxLimitReached: true,
          },
          { status: 400 }
        );
      }
      throw error;
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("❌ Error saving chat:", errorMessage);
    return Response.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
