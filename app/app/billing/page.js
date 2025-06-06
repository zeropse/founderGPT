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
  Sparkles,
  Check,
  X,
  Crown,
} from "lucide-react";
import { motion } from "framer-motion";
import { useUserData } from "@/hooks/useUserData";
import { PlanLoadingSkeleton } from "@/components/ui/loading-skeletons";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import RazorpayPayment from "@/components/app/razorpay-payment";
import { CancellationDialog } from "@/components/app/cancellation-dialog";
import { OrderHistory } from "@/components/app/order-history";
import {
  DynamicPricing,
  DynamicPricingLarge,
} from "@/components/app/dynamic-pricing";
import {
  detectUserLocation,
  getCurrencyForCountry,
} from "@/lib/utils/locationUtils";

export default function BillingPage() {
  const { isPremium, updatePlanStatus, fetchOrderHistory } = useUserData();
  const [isLoading, setIsLoading] = useState(false);
  const [plans, setPlans] = useState([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);
  const [currentPlanState, setCurrentPlanState] = useState(isPremium);
  const [showCancellationDialog, setShowCancellationDialog] = useState(false);

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

  const handlePaymentSuccess = async (paymentData) => {
    setIsLoading(false);
    setCurrentPlanState(true);
  };

  const handlePaymentError = (error) => {
    setIsLoading(false);
    console.error("Payment error:", error);
  };

  const handleCancel = async () => {
    setShowCancellationDialog(true);
  };

  const handleConfirmCancel = async () => {
    setShowCancellationDialog(false);

    setIsLoading(true);
    try {
      const success = await updatePlanStatus(false);

      if (success) {
        setCurrentPlanState(false);
        toast.success(
          "Premium plan cancelled. You've been downgraded to the Free plan and will need to repurchase to access Premium features again."
        ); // Detect user location and currency for cancellation order
        try {
          const userLocation = await detectUserLocation();
          const currencyConfig = getCurrencyForCountry(userLocation);

          await fetch("/api/user/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: `cancel_${Date.now()}_${Math.random()
                .toString(36)
                .substr(2, 9)}`,
              planName: "Premium Plan Cancelled",
              amount: currencyConfig.premiumPrice,
              status: "cancelled",
              currency: currencyConfig.code,
              paymentMethod: "cancellation",
            }),
          });
        } catch (orderError) {
          console.warn("Failed to record cancellation order:", orderError);
        }
      } else {
        toast.error("Failed to cancel subscription. Please try again.");
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
                    <Badge className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white border-0">
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
                          ? "One-time purchase - All premium features unlocked"
                          : "Perfect for getting started"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <DynamicPricing
                      type={currentPlanState ? "premium" : "free"}
                      showLocationIndicator={true}
                    />
                    <div className="text-sm text-muted-foreground">
                      {currentPlanState ? "one-time" : "forever"}
                    </div>
                  </div>
                </div>
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
              {isLoadingPlans ? (
                <PlanLoadingSkeleton />
              ) : (
                plans.map((plan) => (
                  <motion.div
                    key={plan.id}
                    variants={itemAnimation}
                    className="relative"
                  >
                    <Card
                      className={`h-full ${
                        plan.id === "premium" ? "shadow-lg" : ""
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
                          <DynamicPricingLarge
                            type={plan.id === "premium" ? "premium" : "free"}
                            period={plan.period}
                          />
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-6">
                        <div className="space-y-3">
                          {plan.features.map((feature, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-3"
                            >
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
                              <div className="space-y-4">
                                <RazorpayPayment
                                  onSuccess={handlePaymentSuccess}
                                  onError={handlePaymentError}
                                  disabled={isLoading}
                                />
                              </div>
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
                                  className="w-full cursor-pointer hover:bg-red-600"
                                  disabled={isLoading}
                                  size="sm"
                                >
                                  {isLoading ? (
                                    <div className="flex items-center justify-center">
                                      <LoadingSpinner
                                        size="sm"
                                        variant="destructive"
                                      />
                                      <span className="ml-2">
                                        Processing...
                                      </span>
                                    </div>
                                  ) : (
                                    "Cancel Premium"
                                  )}
                                </Button>
                              </div>
                            )
                          ) : !currentPlanState ? (
                            <Button
                              variant="secondary"
                              className="w-full bg-green-50 hover:bg-green-50 border-green-200 text-green-700 cursor-default"
                              disabled
                            >
                              <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                              Current Plan
                            </Button>
                          ) : null}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>

          <OrderHistory fetchOrderHistory={fetchOrderHistory} />
        </div>
      </div>

      <CancellationDialog
        open={showCancellationDialog}
        onOpenChange={setShowCancellationDialog}
        onConfirm={handleConfirmCancel}
        isLoading={isLoading}
      />
    </motion.div>
  );
}
