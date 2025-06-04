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
  Receipt,
  Calendar,
  Package,
  Trash2,
} from "lucide-react";
import { motion } from "framer-motion";
import { useUserData } from "@/hooks/useUserData";
import { PlanLoadingSkeleton } from "@/components/ui/loading-skeletons";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function BillingPage() {
  const { isPremium, updatePlanStatus, fetchOrderHistory } = useUserData();
  const [isLoading, setIsLoading] = useState(false);
  const [plans, setPlans] = useState([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);
  const [currentPlanState, setCurrentPlanState] = useState(isPremium);
  const [orders, setOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [showOrders, setShowOrders] = useState(false);

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
    setIsLoading(true);
    try {
      const success = await updatePlanStatus(true);

      if (success) {
        setCurrentPlanState(true);
        toast.success("Successfully upgraded to Premium!");

        // Record the order
        try {
          await fetch("/api/user/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: `order_${Date.now()}_${Math.random()
                .toString(36)
                .substr(2, 9)}`,
              planName: "Premium Plan",
              amount: 5.0,
              currency: "USD",
              status: "completed",
              paymentMethod: "subscription",
            }),
          });

          // Refresh orders if they are currently being shown
          if (showOrders) {
            const orderHistory = await fetchOrderHistory();
            setOrders(orderHistory);
          }
        } catch (orderError) {
          console.warn("Failed to record order:", orderError);
        }
      } else {
        toast.error("Failed to upgrade. Please try again.");
      }
    } catch (error) {
      console.error("Upgrade error:", error);
      toast.error("Failed to upgrade. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    setIsLoading(true);
    try {
      const success = await updatePlanStatus(false);

      if (success) {
        setCurrentPlanState(false);
        toast.success(
          "Successfully cancelled Premium plan. You've been downgraded to the Free plan."
        );

        // Record the cancellation order
        try {
          await fetch("/api/user/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: `cancel_${Date.now()}_${Math.random()
                .toString(36)
                .substr(2, 9)}`,
              planName: "Premium Plan Cancellation",
              amount: 0.0,
              currency: "USD",
              status: "cancelled",
              paymentMethod: "subscription",
            }),
          });

          // Refresh orders if they are currently being shown
          if (showOrders) {
            const orderHistory = await fetchOrderHistory();
            setOrders(orderHistory);
          }
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

  const handleFetchOrders = async () => {
    if (showOrders) {
      setShowOrders(false);
      return;
    }

    setIsLoadingOrders(true);
    try {
      const orderHistory = await fetchOrderHistory();
      setOrders(orderHistory);
      setShowOrders(true);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load order history");
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const handleClearOrderHistory = async () => {
    try {
      const response = await fetch("/api/user/orders", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        setOrders([]);
        toast.success("Order history cleared successfully");
      } else {
        toast.error("Failed to clear order history");
      }
    } catch (error) {
      console.error("Error clearing order history:", error);
      toast.error("Failed to clear order history");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatAmount = (amount, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
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
                              <Button
                                onClick={handleUpgrade}
                                className="w-full bg-violet-600 hover:bg-violet-700 cursor-pointer"
                                disabled={isLoading}
                              >
                                {isLoading ? (
                                  <div className="flex items-center justify-center">
                                    <LoadingSpinner size="sm" variant="white" />
                                    <span className="ml-2">Processing...</span>
                                  </div>
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
                                    "Cancel Subscription"
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

          <motion.div variants={itemAnimation}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Receipt className="h-5 w-5" />
                      Order History
                    </CardTitle>
                    <CardDescription>
                      View your past subscription orders and transactions
                    </CardDescription>
                  </div>
                  <Button
                    onClick={handleFetchOrders}
                    variant="outline"
                    disabled={isLoadingOrders}
                    className="cursor-pointer"
                  >
                    {isLoadingOrders ? (
                      <div className="flex items-center">
                        <LoadingSpinner size="sm" />
                        <span className="ml-2">Loading...</span>
                      </div>
                    ) : showOrders ? (
                      "Hide Orders"
                    ) : (
                      "View Past Orders"
                    )}
                  </Button>
                </div>
              </CardHeader>

              {showOrders && (
                <CardContent className="pt-6">
                  {orders.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                        <Package className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                        No orders yet
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                        When you upgrade to Premium or make purchases, your
                        order history will appear here.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {orders.map((order, index) => (
                        <div
                          key={order.orderId || index}
                          className="group relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 transition-all hover:shadow-md hover:border-violet-200 dark:hover:border-violet-700"
                        >
                          <div
                            className={`absolute left-0 top-0 h-full w-1 ${
                              order.status === "completed"
                                ? "bg-green-500"
                                : order.status === "pending"
                                ? "bg-yellow-500"
                                : order.status === "cancelled"
                                ? "bg-gray-400"
                                : "bg-red-500"
                            }`}
                          />

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-violet-100 to-violet-200 dark:from-violet-900 dark:to-violet-800">
                                <Crown className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                                    {order.planName}
                                  </h4>
                                  <Badge
                                    variant={
                                      order.status === "completed"
                                        ? "default"
                                        : order.status === "pending"
                                        ? "secondary"
                                        : order.status === "cancelled"
                                        ? "outline"
                                        : "destructive"
                                    }
                                    className={`text-xs ${
                                      order.status === "completed"
                                        ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-300"
                                        : order.status === "pending"
                                        ? "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300"
                                        : order.status === "cancelled"
                                        ? "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300"
                                        : ""
                                    }`}
                                  >
                                    {order.status.charAt(0).toUpperCase() +
                                      order.status.slice(1)}
                                  </Badge>
                                </div>

                                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                  <div className="flex items-center gap-1.5">
                                    <Receipt className="h-3.5 w-3.5" />
                                    <span className="font-mono text-xs">
                                      {order.orderId}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <Calendar className="h-3.5 w-3.5" />
                                    <span>{formatDate(order.timestamp)}</span>
                                  </div>
                                  {order.paymentMethod && (
                                    <div className="flex items-center gap-1.5">
                                      <CreditCard className="h-3.5 w-3.5" />
                                      <span className="capitalize">
                                        {order.paymentMethod}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Price */}
                            <div className="text-right">
                              <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                {formatAmount(order.amount, order.currency)}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {order.currency?.toUpperCase() || "USD"}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      {orders.length > 20 && (
                        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                You have {orders.length} orders in your history
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-500">
                                Clear old orders to keep your history manageable
                              </p>
                            </div>
                            <Button
                              onClick={handleClearOrderHistory}
                              variant="destructive"
                              size="sm"
                              className="cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Clear History
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
