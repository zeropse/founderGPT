"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  AlertCircle,
  CheckCircle,
  CreditCard,
  Loader2,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { AppSidebar } from "@/components/app-sidebar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useUser } from "@/hooks/useUser";

export default function BillingPage() {
  const { user } = useUser();
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Chat history state for sidebar
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

  // Load isPremium from localStorage on mount
  useEffect(() => {
    const storedPremium = localStorage.getItem("isPremium");
    if (storedPremium === "true") {
      setIsPremium(true);
    }
  }, []);

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

  const handleUpgrade = async () => {
    try {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsPremium(true);
      localStorage.setItem("isPremium", "true");
      toast.success("Successfully upgraded to Premium!");
    } catch (error) {
      console.error("Upgrade error:", error);
      toast.error("Failed to upgrade. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    try {
      setIsLoading(true);
      // Simulate API call - in production, this would cancel the subscription
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsPremium(false);
      localStorage.setItem("isPremium", "false");
      toast.success(
        "Successfully cancelled Premium plan. Changes will take effect at the end of your billing period."
      );
    } catch (error) {
      console.error("Cancellation error:", error);
      toast.error("Failed to cancel subscription. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Chat history management functions
  const handleChatSelect = (chatId) => {
    // Navigate to main app page with selected chat
    window.location.href = "/app";
  };

  const handleChatDelete = (chatId) => {
    setChatHistories((prev) => prev.filter((chat) => chat.id !== chatId));
    if (currentChatId === chatId) {
      setCurrentChatId(null);
    }
    toast.success("Chat deleted successfully");
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
            <div className="max-w-5xl mx-auto">
              <motion.div
                variants={itemAnimation}
                className="flex justify-between items-center mb-8"
              >
                <div>
                  <h1 className="text-3xl font-bold">Billing</h1>
                  <p className="text-muted-foreground mt-1">
                    Manage your subscription and usage
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-primary/5 rounded-full px-4 py-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Billing Settings</span>
                </div>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Free Plan */}
                <motion.div variants={itemAnimation}>
                  <Card
                    className={`border-2 ${
                      !isPremium ? "border-primary" : ""
                    } transition-all hover:shadow-lg`}
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>Free Plan</CardTitle>
                          <CardDescription>Limited features</CardDescription>
                        </div>
                        {!isPremium && (
                          <Badge className="border-0">CURRENT PLAN</Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold mb-6">$0</div>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>2 prompts per day</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Idea enhancement</span>
                        </li>
                        <li className="flex items-center gap-2 text-muted-foreground">
                          <span className="h-4 w-4">×</span>
                          <span>Market validation</span>
                        </li>
                        <li className="flex items-center gap-2 text-muted-foreground">
                          <span className="h-4 w-4">×</span>
                          <span>MVP feature breakdown</span>
                        </li>
                      </ul>

                      {isPremium && (
                        <Button
                          variant="outline"
                          className="w-full mt-6 border-2"
                          onClick={handleCancel}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            "Switch to Free Plan"
                          )}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Premium Plan */}
                <motion.div variants={itemAnimation}>
                  <Card
                    className={`border-2 ${
                      isPremium ? "border-violet-500" : ""
                    } transition-all hover:shadow-lg`}
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>Premium Plan</CardTitle>
                          <CardDescription>
                            Full access to all features
                          </CardDescription>
                        </div>
                        {isPremium && (
                          <Badge className="border-0">CURRENT PLAN</Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold mb-6">
                        $5<span className="text-base font-normal">/month</span>
                      </div>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>5 prompts per day (max 20/week)</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>All free features</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Market validation</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>MVP features breakdown</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Tech stack suggestions</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>PDF download</span>
                        </li>
                      </ul>

                      {!isPremium ? (
                        <Button
                          className="w-full mt-6 cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={handleUpgrade}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Upgrading...
                            </>
                          ) : (
                            <>
                              <CreditCard className="mr-2 h-4 w-4" />
                              Upgrade Now
                            </>
                          )}
                        </Button>
                      ) : (
                        <Button
                          variant="destructive"
                          className="w-full mt-6"
                          onClick={handleCancel}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            "Cancel Plan"
                          )}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Usage Overview */}
                <motion.div variants={itemAnimation} className="md:col-span-2">
                  <Card className="border-2">
                    <CardHeader>
                      <CardTitle>Usage Overview</CardTitle>
                      <CardDescription>
                        Your current usage and limits
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-4 bg-muted/50 rounded-lg border-2 transition-all hover:border-violet-500/50 cursor-pointer">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">Daily Prompts</span>
                            <Badge variant="outline" className="bg-primary/5">
                              {isPremium ? "5" : "2"} per day
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Resets daily at midnight UTC
                          </div>
                        </div>

                        <div className="p-4 bg-muted/50 rounded-lg border-2 transition-all hover:border-violet-500/50 cursor-pointer">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">Weekly Limit</span>
                            <Badge variant="outline" className="bg-primary/5">
                              {isPremium ? "20" : "10"} per week
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Resets weekly on Sunday at midnight UTC
                          </div>
                        </div>
                      </div>

                      {isPremium && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-4 p-4 rounded-lg border-2 border-violet-500/20 cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <span>
                              Premium features active - Full access enabled
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
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
