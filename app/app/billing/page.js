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
  CheckCircle,
  CreditCard,
  Loader2,
  Sparkles,
  Check,
  X,
  Crown,
} from "lucide-react";
import { motion } from "framer-motion";
import { useUser } from "@/hooks/useUser";
import { useUserSync } from "@/hooks/useUserSync";

export default function BillingPage() {
  const { user } = useUser();
  const {
    isPremium,
    promptsUsed,
    promptsRemaining,
    dailyPromptsLimit,
    promptsResetDate,
    refreshUserData,
  } = useUserSync();
  const [isLoading, setIsLoading] = useState(false);
  const [plans, setPlans] = useState([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);
  const [currentPlanState, setCurrentPlanState] = useState(isPremium);

  useEffect(() => {
    setCurrentPlanState(isPremium);
  }, [isPremium]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setIsLoadingPlans(true);
        const response = await fetch("/api/billing/plans");

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.plans) {
            setPlans(data.plans);
          } else {
            console.error("Failed to fetch plans:", data.error);
            toast.error("Failed to load subscription plans");
          }
        } else {
          console.error("Failed to fetch plans:", response.statusText);
          toast.error("Failed to load subscription plans");
        }
      } catch (error) {
        console.error("Error fetching plans:", error);
        toast.error("Failed to load subscription plans");
      } finally {
        setIsLoadingPlans(false);
      }
    };

    fetchPlans();
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

      const response = await fetch("/api/user/plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isPremium: true }),
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentPlanState(true);
        localStorage.setItem("isPremium", "true");
        toast.success("Successfully upgraded to Premium!");

        await refreshUserData();
      } else {
        const error = await response.json();
        throw new Error(error.error || "Failed to upgrade");
      }
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

      const response = await fetch("/api/user/plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isPremium: false }),
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentPlanState(false);
        localStorage.setItem("isPremium", "false");
        toast.success(
          "Successfully cancelled Premium plan. You've been downgraded to the Free plan."
        );

        await refreshUserData();
      } else {
        const error = await response.json();
        throw new Error(error.error || "Failed to downgrade");
      }
    } catch (error) {
      console.error("Cancellation error:", error);
      toast.error("Failed to cancel subscription. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
        </motion.div>

        <div className="grid gap-6">
          {/* Current Plan Status */}
          <motion.div variants={itemAnimation}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Current Plan
                    </CardTitle>
                    <CardDescription>
                      Your current subscription plan and status
                    </CardDescription>
                  </div>
                  {currentPlanState ? (
                    <Badge
                      variant="outline"
                      className="text-violet-600 border-violet-200"
                    >
                      <Crown className="h-3 w-3 mr-1" />
                      Premium
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-gray-600">
                      Free
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900">
                      {currentPlanState ? (
                        <Crown className="h-5 w-5 text-violet-600" />
                      ) : (
                        <Sparkles className="h-5 w-5 text-gray-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">
                        {currentPlanState ? "Premium Plan" : "Free Plan"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {currentPlanState
                          ? "Everything you need to succeed"
                          : "Perfect for getting started"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold">
                      {currentPlanState ? "$5" : "$0"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {currentPlanState ? "per month" : "forever"}
                    </div>
                  </div>
                </div>

                {!currentPlanState && (
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Daily prompts used</span>
                      <span className="font-medium">
                        {promptsUsed} / {dailyPromptsLimit}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{
                          width: `${Math.min(
                            100,
                            (promptsUsed / dailyPromptsLimit) * 100
                          )}%`,
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {promptsRemaining} prompts remaining • Resets at{" "}
                      {promptsResetDate
                        ? new Date(promptsResetDate).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "midnight UTC"}
                    </p>
                  </div>
                )}

                {currentPlanState && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 rounded-lg border-2 border-violet-500/20"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-sm">
                        Premium features active - Full access enabled
                      </span>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Pricing Plans */}
          <motion.div variants={itemAnimation}>
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Choose Your Plan</h2>
              <p className="text-muted-foreground">
                Select the plan that best fits your startup journey
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {plans.map((plan) => (
                <motion.div
                  key={plan.id}
                  variants={itemAnimation}
                  className="relative"
                >
                  <Card
                    className={`h-full ${
                      plan.id === "premium" ? "border-violet-200 shadow-lg" : ""
                    } ${
                      (currentPlanState && plan.id === "premium") ||
                      (!currentPlanState && plan.id === "free")
                        ? "ring-2 ring-violet-500 ring-opacity-50"
                        : ""
                    }`}
                  >
                    {plan.badge && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-violet-600 hover:bg-violet-700 text-white px-3 py-1">
                          {plan.badge}
                        </Badge>
                      </div>
                    )}

                    <CardHeader className="text-center pb-4">
                      <div className="text-3xl mb-2">{plan.icon}</div>
                      <CardTitle className="text-xl">{plan.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {plan.tagline}
                      </CardDescription>
                      <div className="mt-4">
                        <div className="text-3xl font-bold">
                          {plan.price}
                          <span className="text-lg font-normal text-muted-foreground ml-1">
                            {plan.period}
                          </span>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                      <div className="space-y-3">
                        {plan.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-3">
                            {feature.included ? (
                              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                            ) : (
                              <X className="h-4 w-4 text-gray-400 flex-shrink-0" />
                            )}
                            <span
                              className={`text-sm ${
                                feature.included
                                  ? "text-foreground"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {feature.name}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-4">
                        {plan.id === "premium" ? (
                          !currentPlanState ? (
                            <Button
                              onClick={handleUpgrade}
                              className="w-full bg-violet-600 hover:bg-violet-700 cursor-pointer"
                              disabled={isLoading}
                            >
                              {isLoading ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <Crown className="mr-2 h-4 w-4" />
                                  Upgrade to Premium
                                </>
                              )}
                            </Button>
                          ) : (
                            <div className="space-y-3">
                              <Button
                                variant="secondary"
                                className="w-full border-green-200 text-green-700"
                                disabled
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Current Plan
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={handleCancel}
                                className="w-full cursor-pointer"
                                disabled={isLoading}
                                size="sm"
                              >
                                {isLoading ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                  </>
                                ) : (
                                  "Cancel Subscription"
                                )}
                              </Button>
                            </div>
                          )
                        ) : // Free plan button
                        currentPlanState ? (
                          <Button
                            variant="outline"
                            onClick={handleCancel}
                            className="w-full cursor-pointer"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              "Downgrade to Free"
                            )}
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            className="w-full border-green-200 text-green-700 cursor-default"
                            disabled
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Current Plan
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
