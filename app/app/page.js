"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import IdeaForm from "@/components/app/IdeaForm";
import PlanCard from "@/components/app/PlanCard";
import ResultsDisplay from "@/components/app/ResultsDisplay";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function AppPage() {
  const router = useRouter();
  const [idea, setIdea] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [promptsRemaining, setPromptsRemaining] = useState(2);
  const [isPremium, setIsPremium] = useState(false);
  const [activeTab, setActiveTab] = useState("validation");
  const [retryTimeout, setRetryTimeout] = useState(null);
  const [enhancementStep, setEnhancementStep] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem("promptsRemaining");
    const lastReset = localStorage.getItem("lastPromptReset");
    const today = new Date().toDateString();

    if (lastReset !== today) {
      setPromptsRemaining(isPremium ? 5 : 2);
      localStorage.setItem("promptsRemaining", isPremium ? "5" : "2");
      localStorage.setItem("lastPromptReset", today);
    } else if (stored) {
      setPromptsRemaining(Number.parseInt(stored, 10));
    }
  }, [isPremium]);

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
      const response = await fetch("/api/validate-idea", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idea: idea.trim(),
          isPremium,
        }),
      });

      const data = await response.json();

      if (response.status === 429) {
        const timeout = setTimeout(() => {
          setRetryTimeout(null);
        }, 30000);
        setRetryTimeout(timeout);
        throw new Error(
          "Rate limit exceeded. Please wait 30 seconds before trying again."
        );
      }

      if (!response.ok) {
        throw new Error(data.error || `Server error: ${response.status}`);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setResults(data);
      const newCount = promptsRemaining - 1;
      setPromptsRemaining(newCount);
      localStorage.setItem("promptsRemaining", newCount.toString());

      toast.success("Idea validated successfully!");
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
    router.push("app/billing");
  };

  const handleDownloadPDF = () => {
    if (!results) return;
    toast.success("PDF download feature coming soon!");
  };

  const resetForm = () => {
    setIdea("");
    setResults(null);
    setActiveTab("validation");
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
      className="max-w-6xl mx-auto px-4 py-8"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left sidebar */}
        <motion.div variants={itemAnimation} className="lg:col-span-1">
          <IdeaForm
            idea={idea}
            setIdea={setIdea}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            promptsRemaining={promptsRemaining}
            isPremium={isPremium}
            handleUpgrade={handleUpgrade}
            retryTimeout={retryTimeout}
            results={results}
            resetForm={resetForm}
          />
          <PlanCard isPremium={isPremium} handleUpgrade={handleUpgrade} />
        </motion.div>

        {/* Main content */}
        <motion.div variants={itemAnimation} className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {!results && !isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-full flex items-center justify-center rounded-xl border-2 border-dashed p-12 text-center bg-muted/30"
              >
                <div className="space-y-3">
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  >
                    <Sparkles className="h-12 w-12 text-primary mx-auto" />
                  </motion.div>
                  <h3 className="text-2xl font-semibold">Validate Your Idea</h3>
                  <p className="text-muted-foreground max-w-sm mx-auto">
                    Enter your idea in the form and hit "Validate Idea" to get
                    started. Our AI will analyze and provide insights.
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
    </motion.div>
  );
}
