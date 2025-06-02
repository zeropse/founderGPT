import { useState, useEffect } from "react";
import { toast } from "sonner";

function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function useChatHistory() {
  const [chatHistories, setChatHistories] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);

  useEffect(() => {
    const storedChats = localStorage.getItem("chatHistories");
    if (storedChats) {
      try {
        setChatHistories(JSON.parse(storedChats));
      } catch (error) {
        console.error("Failed to parse stored chat histories:", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("chatHistories", JSON.stringify(chatHistories));
  }, [chatHistories]);

  const handleChatSelect = (chatId, onSelect) => {
    const selectedChat = chatHistories.find((chat) => chat.id === chatId);
    if (selectedChat && onSelect) {
      setCurrentChatId(chatId);
      onSelect(selectedChat);
      toast.success("Chat loaded successfully");
    }
  };

  const handleChatDelete = (chatId, onDelete) => {
    setChatHistories((prev) => prev.filter((chat) => chat.id !== chatId));
    if (currentChatId === chatId) {
      setCurrentChatId(null);
      if (onDelete) {
        onDelete();
      }
    }
    toast.success("Chat deleted successfully");
  };

  const saveChatHistory = (idea, results) => {
    if (results && idea && !currentChatId) {
      const newChat = {
        id: generateUUID(),
        title: idea.slice(0, 50) + (idea.length > 50 ? "..." : ""),
        idea,
        results,
        timestamp: new Date().toISOString(),
      };
      setChatHistories((prev) => [newChat, ...prev.slice(0, 19)]);
      setCurrentChatId(newChat.id);
      return newChat.id;
    }
    return null;
  };

  const resetCurrentChat = () => {
    setCurrentChatId(null);
  };

  return {
    chatHistories,
    currentChatId,
    handleChatSelect,
    handleChatDelete,
    saveChatHistory,
    resetCurrentChat,
  };
}
