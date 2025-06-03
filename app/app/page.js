"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import IdeaForm from "@/components/app/IdeaForm";
import PlanCard from "@/components/app/PlanCard";
import UsageDashboard from "@/components/app/UsageDashboard";
import ResultsDisplay from "@/components/app/ResultsDisplay";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { handleDownloadPDF as downloadPDF } from "@/lib/pdfDownloader";
import { useUserData } from "@/hooks/useUserData";
import { useSidebarContext } from "@/hooks/useSidebarContext";

export default function AppPage() {
  const router = useRouter();

  const {
    isPremium,
    promptsUsed,
    promptsRemaining,
    dailyPromptsLimit,
    promptsResetDate,
    isInitialized,
    validateIdea,
  } = useUserData();

  const {
    saveChatHistory,
    resetCurrentChat,
    setChatSelectHandler,
    setChatDeleteHandler,
  } = useSidebarContext();
  const [idea, setIdea] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [retryTimeout, setRetryTimeout] = useState(null);
  const [enhancementStep, setEnhancementStep] = useState(0);
  const [activeTab, setActiveTab] = useState("validation");

  const handleChatSelect = useCallback((selectedChat) => {
    if (selectedChat) {
      setIdea(selectedChat.idea);
      setResults(selectedChat.results);
      setActiveTab("validation");
      toast.success("Chat loaded successfully");
    }
  }, []);

  const handleChatDelete = useCallback(() => {
    setIdea("");
    setResults(null);
    setActiveTab("validation");
    if (resetCurrentChat) {
      resetCurrentChat();
    }
  }, [resetCurrentChat]);

  useEffect(() => {
    if (setChatSelectHandler && setChatDeleteHandler) {
      setChatSelectHandler(handleChatSelect);
      setChatDeleteHandler(handleChatDelete);
    }
  }, [
    setChatSelectHandler,
    setChatDeleteHandler,
    handleChatSelect,
    handleChatDelete,
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!idea.trim()) {
      toast.error("Please enter your idea first");
      return;
    }

    if (idea.trim().length < 10) {
      toast.error(
        "Please provide a more detailed idea (at least 10 characters)"
      );
      return;
    }

    if (promptsRemaining <= 0) {
      toast.error(
        "You've reached your daily limit. Please upgrade or try again tomorrow."
      );
      return;
    }

    if (retryTimeout) {
      toast.error("Please wait before trying again");
      return;
    }

    setIsLoading(true);
    setResults(null);
    setEnhancementStep(0);

    try {
      const data = await validateIdea(idea);
      setResults(data);

      let newChatId = null;
      if (saveChatHistory) {
        newChatId = await saveChatHistory(idea.trim(), data);
      }

      toast.success("Idea validated successfully!");

      if (newChatId) {
        router.push(`/app/c/${newChatId}`);
      }
    } catch (error) {
      console.error("Validation error:", error);
      toast.error(
        error.message || "Failed to validate idea. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgrade = () => {
    router.push("/app/billing");
  };

  const handleDownloadPDF = () => {
    if (!results) {
      alert("No data available to download");
      return;
    }

    downloadPDF(results);
  };

  const resetForm = useCallback(() => {
    setIdea("");
    setResults(null);
    setActiveTab("validation");
    if (resetCurrentChat) {
      resetCurrentChat();
    }
  }, [resetCurrentChat]);

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

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerAnimation}
      className="flex-1 p-4"
    >
      <div className="max-w-6xl mx-auto">
        {!isInitialized ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground">Loading your dashboard...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div variants={itemAnimation} className="lg:col-span-1">
              <div className="space-y-6">
                <IdeaForm
                  idea={idea}
                  setIdea={setIdea}
                  handleSubmit={handleSubmit}
                  isLoading={isLoading}
                  promptsRemaining={promptsRemaining}
                  promptsUsed={promptsUsed}
                  dailyPromptsLimit={dailyPromptsLimit}
                  promptsResetDate={promptsResetDate}
                  isPremium={isPremium}
                  handleUpgrade={handleUpgrade}
                  retryTimeout={retryTimeout}
                  results={results}
                  resetForm={resetForm}
                />
                <UsageDashboard
                  isPremium={isPremium}
                  promptsUsed={promptsUsed}
                  promptsRemaining={promptsRemaining}
                  dailyPromptsLimit={dailyPromptsLimit}
                  promptsResetDate={promptsResetDate}
                />
                <PlanCard
                  isPremium={isPremium}
                  promptsUsed={promptsUsed}
                  promptsRemaining={promptsRemaining}
                  dailyPromptsLimit={dailyPromptsLimit}
                  promptsResetDate={promptsResetDate}
                />
              </div>
            </motion.div>

            <motion.div variants={itemAnimation} className="lg:col-span-2">
              <AnimatePresence mode="wait">
                {!results && !isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="h-full flex items-center justify-center rounded-xl border-2 border-dashed p-12 text-center bg-muted/30 min-h-[400px]"
                  >
                    <div className="space-y-3">
                      <motion.div
                        animate={{
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          repeatType: "reverse",
                        }}
                      >
                        <Sparkles className="h-12 w-12 text-primary mx-auto" />
                      </motion.div>
                      <h3 className="text-2xl font-semibold">
                        Validate Your Idea
                      </h3>
                      <p className="text-muted-foreground max-w-sm mx-auto">
                        Enter your idea in the form and hit "Validate Idea" to
                        get started. Our AI will analyze and provide insights.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence mode="wait">
                {(results || isLoading) && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <ResultsDisplay
                      results={results}
                      isPremium={isPremium}
                      activeTab={activeTab}
                      setActiveTab={setActiveTab}
                      handleDownloadPDF={handleDownloadPDF}
                      isLoading={isLoading}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
