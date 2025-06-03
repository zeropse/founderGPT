import { auth } from "@clerk/nextjs/server";
import UserService from "@/lib/services/UserService";

export async function GET(request, { params }) {
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
  } catch (error) {
    console.error("❌ Error fetching chat:", error.message);

    if (
      error.message === "Chat not found" ||
      error.message === "User not found"
    ) {
      return Response.json({ error: error.message }, { status: 404 });
    }

    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
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
  } catch (error) {
    console.error("❌ Error deleting chat:", error.message);

    if (
      error.message === "Chat not found" ||
      error.message === "User not found"
    ) {
      return Response.json({ error: error.message }, { status: 404 });
    }

    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
