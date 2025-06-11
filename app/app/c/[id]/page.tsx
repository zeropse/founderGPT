"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { ArrowLeft, Sparkles, Database, Brain, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import ResultsDisplay from "@/components/app/ResultsDisplay";
import { handleDownloadPDF as downloadPDF } from "@/lib/pdfDownloader";
import { useUserData } from "@/hooks/useUserData";
import { useSidebarContext } from "@/hooks/useSidebarContext";
import { cachedFetch } from "@/lib/apiCache";
import { DatabaseLoadingSkeleton } from "@/components/ui/loading-skeletons";
import { ChatHistory, LoadingMessage } from "@/types";

export default function ChatPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { user, isPremium } = useUserData();
  const { setChatSelectHandler, setChatDeleteHandler, resetCurrentChat } =
    useSidebarContext();
  const [chatData, setChatData] = useState<ChatHistory | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("validation");
  const [isDownloadingPDF, setIsDownloadingPDF] = useState<boolean>(false);
  const [isPolling, setIsPolling] = useState<boolean>(false);
  const loadingRef = useRef<boolean>(false);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const startPollingForResults = useCallback(async () => {
    if (!params.id || pollingRef.current) return;

    const pollForUpdates = async () => {
      try {
        const data = await cachedFetch(
          `/api/chats/${params.id}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          },
          0
        );

        if (data.success && data.chat.results) {
          setChatData(data.chat);
          setIsPolling(false);
          if (pollingRef.current) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
          }
        }
      } catch (error) {
        console.error("Error polling for results:", error);
      }
    };

    pollingRef.current = setInterval(pollForUpdates, 3000);
  }, [params.id]);

  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const loadChatData = async () => {
      if (!params.id) return;

      if (loadingRef.current) {
        return;
      }

      loadingRef.current = true;

      try {
        setIsLoading(true);
        const data = await cachedFetch(
          `/api/chats/${params.id}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          },
          300000
        );

        if (data.success) {
          setChatData(data.chat);

          if (!data.chat.results && !isPolling) {
            setIsPolling(true);
            startPollingForResults();
          }
        } else {
          toast.error("Chat not found");
          router.push("/app");
        }
      } catch (error) {
        console.error("Error loading chat data:", error);
        toast.error("Failed to load chat");
        router.push("/app");
      } finally {
        setIsLoading(false);
        loadingRef.current = false;
      }
    };

    loadChatData();
  }, [params.id, router, isPolling, startPollingForResults]);

  const handleChatSelect = useCallback(
    (selectedChat: ChatHistory) => {
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

  const handleDownloadPDF = async () => {
    if (!chatData?.results) {
      toast.error("No data available to download");
      return;
    }

    try {
      setIsDownloadingPDF(true);
      toast.loading("Generating PDF report...", { id: "pdf-download" });

      await new Promise((resolve) => setTimeout(resolve, 500));

      downloadPDF(chatData.results);

      toast.success("PDF downloaded successfully!", { id: "pdf-download" });
    } catch (error) {
      console.error("PDF download error:", error);
      toast.error("Failed to generate PDF. Please try again.", {
        id: "pdf-download",
      });
    } finally {
      setIsDownloadingPDF(false);
    }
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

  const loadingMessages: LoadingMessage[] = [
    {
      text: "Fetching chat data",
      subtext: "Retrieving conversation history",
      icon: <Database className="h-5 w-5" />,
    },
    {
      text: "Loading conversation history",
      subtext: "Processing chat data",
      icon: <Brain className="h-5 w-5" />,
    },
    {
      text: "Preparing results display",
      subtext: "Formatting analysis results",
      icon: <Sparkles className="h-5 w-5" />,
    },
    {
      text: "Almost ready!",
      subtext: "Final preparations",
      icon: <Zap className="h-5 w-5" />,
    },
  ];

  if (isLoading) {
    return (
      <div className="flex-1 p-4">
        <div className="max-w-6xl mx-auto">
          <DatabaseLoadingSkeleton
            title="Loading your chat..."
            subtitle="Retrieving conversation history and results"
            steps={loadingMessages}
          />
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
              {!chatData.results ? (
                <DatabaseLoadingSkeleton
                  title="Analyzing Your Idea"
                  subtitle="Our AI is creating a comprehensive business analysis"
                  showProgress={true}
                  currentStep={0}
                  steps={[
                    {
                      text: "Enhancing Your Idea",
                      subtext:
                        "AI is analyzing your concept for clarity and market fit",
                      icon: <Sparkles className="h-5 w-5 text-violet-500" />,
                    },
                    {
                      text: "Market Research",
                      subtext:
                        "Gathering competitive intelligence and market trends",
                      icon: <Brain className="h-5 w-5 text-blue-500" />,
                    },
                    {
                      text: "Technical Analysis",
                      subtext:
                        "Evaluating technology stack and development requirements",
                      icon: <Database className="h-5 w-5 text-green-500" />,
                    },
                    {
                      text: "Business Planning",
                      subtext:
                        "Creating monetization strategies and user personas",
                      icon: <Zap className="h-5 w-5 text-orange-500" />,
                    },
                  ]}
                />
              ) : (
                <ResultsDisplay
                  results={chatData.results}
                  isPremium={isPremium}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  handleDownloadPDF={handleDownloadPDF}
                  isLoading={false}
                  isDownloadingPDF={isDownloadingPDF}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}
