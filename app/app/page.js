"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import IdeaForm from "@/components/app/IdeaForm";
import PlanCard from "@/components/app/PlanCard";
import ResultsDisplay from "@/components/app/ResultsDisplay";
import { AppSidebar } from "@/components/app-sidebar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { handleDownloadPDF as downloadPDF } from "@/lib/pdfDownloader";
import { useUser } from "@/hooks/useUser";

export default function AppPage() {
  const router = useRouter();
  const { user } = useUser();
  const [idea, setIdea] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [promptsRemaining, setPromptsRemaining] = useState(2);
  const [isPremium, setIsPremium] = useState(false);
  const [activeTab, setActiveTab] = useState("validation");
  const [retryTimeout, setRetryTimeout] = useState(null);
  const [enhancementStep, setEnhancementStep] = useState(0);

  // Chat history state
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

  // Load isPremium from localStorage on mount
  useEffect(() => {
    const storedPremium = localStorage.getItem("isPremium");
    if (storedPremium === "true") {
      setIsPremium(true);
    }
  }, []);

  // Save isPremium to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("isPremium", isPremium.toString());
  }, [isPremium]);

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

  useEffect(() => {
    const storedPremium = localStorage.getItem("isPremium");
    if (storedPremium === "true") {
      setIsPremium(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("isPremium", isPremium.toString());
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
    router.push("/app/billing");
  };

  const handleDownloadPDF = () => {
    if (!results) {
      alert("No data available to download");
      return;
    }

    downloadPDF(results);
  };

  const resetForm = () => {
    setIdea("");
    setResults(null);
    setActiveTab("validation");
    setCurrentChatId(null);
  };

  // Chat history management functions
  const handleChatSelect = (chatId) => {
    const selectedChat = chatHistories.find((chat) => chat.id === chatId);
    if (selectedChat) {
      setCurrentChatId(chatId);
      setIdea(selectedChat.idea);
      setResults(selectedChat.results);
      setActiveTab("validation");
      toast.success("Chat loaded successfully");
    }
  };

  const handleChatDelete = (chatId) => {
    setChatHistories((prev) => prev.filter((chat) => chat.id !== chatId));
    if (currentChatId === chatId) {
      setCurrentChatId(null);
      // Reset form when deleting current chat
      resetForm();
    }
    toast.success("Chat deleted successfully");
  };

  const saveChatHistory = () => {
    if (results && idea && !currentChatId) {
      const newChat = {
        id: Date.now().toString(),
        title: idea.slice(0, 50) + (idea.length > 50 ? "..." : ""),
        idea,
        results,
        timestamp: new Date().toISOString(),
      };
      setChatHistories((prev) => [newChat, ...prev.slice(0, 19)]); // Keep only latest 20 chats
      setCurrentChatId(newChat.id);
    }
  };

  // Save chat when results are generated
  useEffect(() => {
    if (results && idea) {
      saveChatHistory();
    }
  }, [results, idea]);

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
    <div className="min-h-screen flex flex-col">
      <SidebarProvider>
        <AppSidebar
          chatHistories={chatHistories}
          onChatSelect={handleChatSelect}
          onChatDelete={handleChatDelete}
          currentChatId={currentChatId}
          user={user}
        />
        <SidebarInset className="flex flex-col">
          <header className="shrink-0">
            <Navbar />
          </header>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerAnimation}
            className="flex-1 p-4"
          >
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left sidebar */}
                <motion.div variants={itemAnimation} className="lg:col-span-1">
                  <div className="space-y-6">
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
                    <PlanCard isPremium={isPremium} />
                  </div>
                </motion.div>

                {/* Main content */}
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
                            Enter your idea in the form and hit "Validate Idea"
                            to get started. Our AI will analyze and provide
                            insights.
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
            </div>
          </motion.div>

          <Footer />
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
