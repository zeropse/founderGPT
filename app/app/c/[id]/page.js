"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import ResultsDisplay from "@/components/app/ResultsDisplay";
import { handleDownloadPDF as downloadPDF } from "@/lib/pdfDownloader";
import { useUser } from "@/hooks/useUser";
import { useSidebarContext } from "@/hooks/useSidebarContext";

export default function ChatPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useUser();
  const { setChatSelectHandler, setChatDeleteHandler, resetCurrentChat } =
    useSidebarContext();
  const [chatData, setChatData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [activeTab, setActiveTab] = useState("validation");

  useEffect(() => {
    const loadChatData = () => {
      try {
        const storedChats = localStorage.getItem("chatHistories");
        if (storedChats) {
          const chatHistories = JSON.parse(storedChats);
          const chat = chatHistories.find((c) => c.id === params.id);

          if (chat) {
            setChatData(chat);
            toast.success("Chat loaded successfully");
          } else {
            toast.error("Chat not found");
            router.push("/app");
          }
        } else {
          toast.error("No chat history found");
          router.push("/app");
        }
      } catch (error) {
        console.error("Error loading chat data:", error);
        toast.error("Failed to load chat");
        router.push("/app");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      loadChatData();
    }
  }, [params.id, router]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user/sync", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const result = await response.json();
          if (result.user) {
            setIsPremium(result.user.planId === "premium");
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user]);

  const handleChatSelect = useCallback(
    (selectedChat) => {
      if (selectedChat && selectedChat.id !== params.id) {
        router.push(`/app/c/${selectedChat.id}`);
      }
    },
    [params.id, router]
  );

  const handleChatDelete = useCallback(() => {
    router.push("/app");
    if (resetCurrentChat) {
      resetCurrentChat();
    }
  }, [router, resetCurrentChat]);

  useEffect(() => {
    setChatSelectHandler(handleChatSelect);
    setChatDeleteHandler(handleChatDelete);
  }, [
    setChatSelectHandler,
    setChatDeleteHandler,
    handleChatSelect,
    handleChatDelete,
  ]);

  const handleBackToApp = () => {
    router.push("/app");
  };

  const handleDownloadPDF = () => {
    if (!chatData?.results) {
      toast.error("No data available to download");
      return;
    }
    downloadPDF(chatData.results);
  };

  const containerAnimation = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.2,
      },
    },
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  if (isLoading) {
    return (
      <div className="flex-1 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center mb-4">
                <Sparkles className="h-12 w-12 text-primary animate-pulse" />
              </div>
              <h3 className="text-xl font-medium text-primary">
                Loading chat...
              </h3>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!chatData) {
    return (
      <div className="flex-1 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-medium">Chat not found</h3>
              <Button onClick={handleBackToApp} className="cursor-pointer">
                Back to App
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerAnimation}
      className="flex-1 p-4"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div variants={itemAnimation} className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToApp}
              className="cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to App
            </Button>
          </div>

          <div className="bg-card rounded-lg p-6 border">
            <h1 className="text-2xl font-bold mb-2">{chatData.title}</h1>
            <p className="text-muted-foreground mb-4">{chatData.idea}</p>
            {chatData.timestamp && (
              <p className="text-sm text-muted-foreground">
                Created on{" "}
                {new Date(chatData.timestamp).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            )}
          </div>
        </motion.div>

        {/* Results */}
        <motion.div variants={itemAnimation}>
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-card rounded-xl border shadow-sm"
            >
              <ResultsDisplay
                results={chatData.results}
                isPremium={isPremium}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                handleDownloadPDF={handleDownloadPDF}
                isLoading={false}
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}
