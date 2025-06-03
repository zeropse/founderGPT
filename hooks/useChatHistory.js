import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { cachedFetch, apiCache } from "@/lib/apiCache";

export function useChatHistory() {
  const [chatHistories, setChatHistories] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fetchingRef = useRef(false);

  const fetchChats = async (forceRefresh = false) => {
    if (fetchingRef.current) {
      return;
    }

    fetchingRef.current = true;

    try {
      setIsLoading(true);
      const maxAge = forceRefresh ? 0 : 60000;
      const data = await cachedFetch(
        "/api/chats",
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        },
        maxAge
      );

      if (data.success) {
        const chats = data.chats || [];
        setChatHistories(chats);
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
    } finally {
      setIsLoading(false);
      fetchingRef.current = false;
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  const handleChatSelect = (chatId, onSelect) => {
    const selectedChat = chatHistories.find((chat) => chat.id === chatId);
    if (selectedChat && onSelect) {
      setCurrentChatId(chatId);
      onSelect(selectedChat);
      toast.success("Chat loaded successfully");
    }
  };

  const handleChatDelete = async (chatId, onDelete) => {
    try {
      const response = await fetch(`/api/chats/${chatId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const updatedChats = chatHistories.filter((chat) => chat.id !== chatId);
        setChatHistories(updatedChats);

        apiCache.clear("/api/chats");

        if (currentChatId === chatId) {
          setCurrentChatId(null);
          if (onDelete) {
            onDelete();
          }
        }

        toast.success("Chat deleted successfully");
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to delete chat");
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
      toast.error("Failed to delete chat");
    }
  };

  const saveChatHistory = async (idea, results) => {
    if (results && idea && !currentChatId) {
      try {
        const response = await fetch("/api/chats", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idea, results }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          const newChat = data.chat;
          const updatedChats = [newChat, ...chatHistories];

          setChatHistories(updatedChats);
          setCurrentChatId(newChat.id);

          apiCache.clear("/api/chats");

          return newChat.id;
        } else {
          if (data.maxLimitReached) {
            toast.error(
              "Maximum chat limit reached (10 chats). Please delete some chats before creating new ones."
            );
          } else {
            toast.error(data.error || "Failed to save chat");
          }
        }
      } catch (error) {
        console.error("Error saving chat:", error);
        toast.error("Failed to save chat");
      }
    }
    return null;
  };

  const resetCurrentChat = () => {
    setCurrentChatId(null);
  };

  return {
    chatHistories,
    currentChatId,
    isLoading,
    handleChatSelect,
    handleChatDelete,
    saveChatHistory,
    resetCurrentChat,
    refetchChats: () => fetchChats(true),
  };
}
