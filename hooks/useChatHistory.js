import { useState, useEffect } from "react";
import { toast } from "sonner";

export function useChatHistory() {
  const [chatHistories, setChatHistories] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);

  // Load chat histories from localStorage on mount
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

  // Save chat histories to localStorage whenever they change
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
        id: Date.now().toString(),
        title: idea.slice(0, 50) + (idea.length > 50 ? "..." : ""),
        idea,
        results,
        timestamp: new Date().toISOString(),
      };
      setChatHistories((prev) => [newChat, ...prev.slice(0, 19)]);
      setCurrentChatId(newChat.id);
    }
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
