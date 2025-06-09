"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import IdeaForm from "@/components/app/IdeaForm";
import PlanCard from "@/components/app/PlanCard";
import UsageDashboard from "@/components/app/UsageDashboard";
import ResultsDisplay from "@/components/app/ResultsDisplay";
import { UserDataLoadingSkeleton } from "@/components/ui/loading-skeletons";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { handleDownloadPDF as downloadPDF } from "@/lib/pdfDownloader";
import { useUserData } from "@/hooks/useUserData";
import { useSidebarContext } from "@/hooks/useSidebarContext";
import { ValidationResults, ChatHistory } from "@/types";

export default function AppPage() {
  const router = useRouter();

  const {
    isPremium,
    promptsUsed,
    promptsRemaining,
    dailyPromptsLimit,
    promptsResetDate,
    weeklyPromptsUsed,
    weeklyPromptsLimit,
    weeklyPromptsResetDate,
    isInitialized,
    validateIdea,
  } = useUserData();

  const {
    saveChatHistory,
    resetCurrentChat,
    setChatSelectHandler,
    setChatDeleteHandler,
  } = useSidebarContext();
  const [idea, setIdea] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [results, setResults] = useState<ValidationResults | null>(null);
  const [retryTimeout, setRetryTimeout] = useState<number | null>(null);
  const [enhancementStep, setEnhancementStep] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string>("validation");
  const [isDownloadingPDF, setIsDownloadingPDF] = useState<boolean>(false);

  const handleChatSelect = useCallback((selectedChat: ChatHistory) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
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

    // Check weekly limit for free users
    if (!isPremium && (weeklyPromptsUsed || 0) >= (weeklyPromptsLimit || 0)) {
      toast.error(
        "You've reached your weekly limit. Please upgrade or wait for your weekly reset."
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

    // Progressive loading steps
    const progressSteps = [
      () => setEnhancementStep(1), // Enhancing concept
      () => setEnhancementStep(2), // Researching market
      () => setEnhancementStep(3), // Generating features
      () => setEnhancementStep(4), // Building tech stack
      () => setEnhancementStep(5), // Creating strategies
      () => setEnhancementStep(6), // Finalizing results
    ];

    let stepIndex = 0;
    const progressInterval = setInterval(() => {
      if (stepIndex < progressSteps.length) {
        progressSteps[stepIndex]();
        stepIndex++;
      }
    }, 2000);

    try {
      const data = await validateIdea(idea);
      setResults(data);

      let newChatId = null;
      if (saveChatHistory) {
        try {
          newChatId = await saveChatHistory(idea.trim(), data);

          if (newChatId) {
            toast.success("Idea validated successfully!");
            router.push(`/app/c/${newChatId}`);
          } else {
            toast.success("Idea validated! Results displayed below.");
          }
        } catch (error) {
          console.error("Failed to save chat history:", error);
          toast.success("Idea validated! Results displayed below.");
        }
      } else {
        toast.success("Idea validated! Results displayed below.");
      }
    } catch (error) {
      console.error("Validation error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to validate idea. Please try again.";
      toast.error(errorMessage);
    } finally {
      clearInterval(progressInterval);
      setIsLoading(false);
      setEnhancementStep(0);
    }
  };

  const handleUpgrade = () => {
    router.push("/app/billing");
  };

  const handleDownloadPDF = async () => {
    if (!results) {
      toast.error("No data available to download");
      return;
    }

    try {
      setIsDownloadingPDF(true);
      toast.loading("Generating PDF report...", { id: "pdf-download" });

      // Add a small delay to show loading state
      await new Promise((resolve) => setTimeout(resolve, 500));

      downloadPDF(results);

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
          <UserDataLoadingSkeleton />
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
                  weeklyPromptsUsed={weeklyPromptsUsed}
                  weeklyPromptsLimit={weeklyPromptsLimit}
                  retryTimeout={retryTimeout}
                  enhancementStep={enhancementStep}
                />
                <UsageDashboard
                  isPremium={isPremium}
                  promptsUsed={promptsUsed}
                  dailyPromptsLimit={dailyPromptsLimit}
                  promptsResetDate={promptsResetDate || undefined}
                  weeklyPromptsUsed={weeklyPromptsUsed}
                  weeklyPromptsLimit={weeklyPromptsLimit}
                  weeklyPromptsResetDate={weeklyPromptsResetDate || undefined}
                />
                <PlanCard
                  isPremium={isPremium}
                  dailyPromptsLimit={dailyPromptsLimit}
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
                      results={results || undefined}
                      isPremium={isPremium}
                      activeTab={activeTab}
                      setActiveTab={setActiveTab}
                      handleDownloadPDF={handleDownloadPDF}
                      isLoading={isLoading}
                      enhancementStep={enhancementStep}
                      isDownloadingPDF={isDownloadingPDF}
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
