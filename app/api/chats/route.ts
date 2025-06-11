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

    const { idea, results, action = "create" } = await request.json();

    if (!idea) {
      return Response.json({ error: "Idea is required" }, { status: 400 });
    }

    try {
      if (action === "create") {
        const newChat = await UserService.saveChatHistory(
          userId,
          idea,
          results
        );

        return Response.json({
          success: true,
          chat: newChat,
          message: "Chat created successfully",
        });
      } else if (action === "update") {
        const { chatId } = await request.json();
        if (!chatId || !results) {
          return Response.json(
            { error: "Chat ID and results are required for update" },
            { status: 400 }
          );
        }

        const updatedChat = await UserService.updateChatWithResults(
          userId,
          chatId,
          results
        );

        return Response.json({
          success: true,
          chat: updatedChat,
          message: "Chat updated successfully",
        });
      } else {
        return Response.json(
          { error: "Invalid action. Use 'create' or 'update'" },
          { status: 400 }
        );
      }
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
    console.error("❌ Error processing chat request:", errorMessage);

    return Response.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
