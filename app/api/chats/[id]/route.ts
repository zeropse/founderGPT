import { auth } from "@clerk/nextjs/server";
import UserService from "@/lib/services/UserService";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: chatId } = await params;

    const chat = await UserService.getChatById(userId, chatId);

    return Response.json({
      success: true,
      chat,
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("❌ Error fetching chat:", errorMessage);

    if (
      error instanceof Error &&
      (error.message === "Chat not found" || error.message === "User not found")
    ) {
      return Response.json({ error: error.message }, { status: 404 });
    }

    return Response.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: chatId } = await params;

    await UserService.deleteChatHistory(userId, chatId);

    return Response.json({
      success: true,
      message: "Chat deleted successfully",
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("❌ Error deleting chat:", errorMessage);

    if (
      error instanceof Error &&
      (error.message === "Chat not found" || error.message === "User not found")
    ) {
      return Response.json({ error: error.message }, { status: 404 });
    }

    return Response.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
