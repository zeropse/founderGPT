"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import IdeaForm from "@/components/app/IdeaForm";
import PlanCard from "@/components/app/PlanCard";
import UsageDashboard from "@/components/app/UsageDashboard";
import {
  UserDataLoadingSkeleton,
  DatabaseLoadingSkeleton,
} from "@/components/ui/loading-skeletons";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useUserData } from "@/hooks/useUserData";
import { useSidebarContext } from "@/hooks/useSidebarContext";
import { ChatHistory } from "@/types";

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
  const [retryTimeout, setRetryTimeout] = useState<number | null>(null);
  const [enhancementStep, setEnhancementStep] = useState<number>(0);

  const handleChatSelect = useCallback(
    (selectedChat: ChatHistory) => {
      if (selectedChat) {
        router.push(`/app/c/${selectedChat.id}`);
      }
    },
    [router]
  );

  const handleChatDelete = useCallback(() => {
    setIdea("");
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
    setEnhancementStep(0);

    const progressSteps = [
      () => setEnhancementStep(1),
      () => setEnhancementStep(2),
      () => setEnhancementStep(3),
      () => setEnhancementStep(4),
      () => setEnhancementStep(5),
      () => setEnhancementStep(6),
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

      if (saveChatHistory) {
        try {
          const newChatId = await saveChatHistory(idea.trim(), data);

          if (newChatId) {
            toast.success("Idea validated successfully!");
            router.push(`/app/c/${newChatId}`);
            return;
          } else {
            return;
          }
        } catch (error) {
          console.error("Failed to save chat history:", error);
          toast.error("Failed to save your analysis. Please try again.");
          return;
        }
      }

      toast.error("Unable to save analysis. Please refresh and try again.");
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
              {isLoading ? (
                <DatabaseLoadingSkeleton
                  title="Analyzing Your Idea"
                  subtitle="Our AI is creating a comprehensive business analysis"
                  showProgress={true}
                  currentStep={enhancementStep}
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
                      icon: <Sparkles className="h-5 w-5 text-blue-500" />,
                    },
                    {
                      text: "Technical Analysis",
                      subtext:
                        "Evaluating technology stack and development requirements",
                      icon: <Sparkles className="h-5 w-5 text-green-500" />,
                    },
                    {
                      text: "Business Planning",
                      subtext:
                        "Creating monetization strategies and user personas",
                      icon: <Sparkles className="h-5 w-5 text-orange-500" />,
                    },
                    {
                      text: "Feature Development",
                      subtext: "Identifying core MVP features for your product",
                      icon: <Sparkles className="h-5 w-5 text-purple-500" />,
                    },
                    {
                      text: "Strategy Creation",
                      subtext:
                        "Building go-to-market and monetization strategies",
                      icon: <Sparkles className="h-5 w-5 text-pink-500" />,
                    },
                    {
                      text: "Finalizing Results",
                      subtext: "Compiling your comprehensive validation report",
                      icon: <Sparkles className="h-5 w-5 text-indigo-500" />,
                    },
                  ]}
                />
              ) : (
                <div className="h-full flex items-center justify-center rounded-xl border-2 border-dashed p-12 text-center bg-muted/30 min-h-[400px]">
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
                      Enter your idea in the form and hit "Validate Idea" to get
                      started. Our AI will analyze and provide insights.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
