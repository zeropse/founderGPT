"use client";

import { useState, useRef, forwardRef, useImperativeHandle } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  CreditCard,
  Receipt,
  Calendar,
  Package,
  Trash2,
  Crown,
} from "lucide-react";
import { motion, Variants } from "framer-motion";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Order } from "@/types";

// Define the component props interface
interface OrderHistoryProps {
  fetchOrderHistory: () => Promise<Order[]>;
  className?: string;
  title?: string;
  description?: string;
  showClearButton?: boolean;
  maxOrdersThreshold?: number;
}

// Define the ref interface for external control
export interface OrderHistoryRef {
  refreshOrders: () => Promise<void>;
}

export const OrderHistory = forwardRef<OrderHistoryRef, OrderHistoryProps>(
  (
    {
      fetchOrderHistory,
      className = "",
      title = "Order History",
      description = "View your past subscription orders and transactions",
      showClearButton = true,
      maxOrdersThreshold = 10,
    },
    ref
  ) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoadingOrders, setIsLoadingOrders] = useState<boolean>(false);
    const [showOrders, setShowOrders] = useState<boolean>(false);
    const [isClearingHistory, setIsClearingHistory] = useState<boolean>(false);

    const itemAnimation: Variants = {
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

    const handleFetchOrders = async (): Promise<void> => {
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

    const handleClearOrderHistory = async (): Promise<void> => {
      setIsClearingHistory(true);
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
      } finally {
        setIsClearingHistory(false);
      }
    };

    const formatDate = (dateString: string): string => {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    };

    const formatAmount = (amount: number, currency: string = "USD"): string => {
      const currencyCode = currency || "USD";
      const locale = currencyCode === "INR" ? "en-IN" : "en-US";

      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currencyCode,
        minimumFractionDigits: currencyCode === "INR" ? 0 : 2,
        maximumFractionDigits: currencyCode === "INR" ? 0 : 2,
      }).format(amount);
    };

    const refreshOrders = async (): Promise<void> => {
      if (showOrders) {
        try {
          const orderHistory = await fetchOrderHistory();
          setOrders(orderHistory);
        } catch (error) {
          console.warn("Failed to refresh orders:", error);
        }
      }
    };

    // Expose refreshOrders method to parent components via ref
    useImperativeHandle(ref, () => ({
      refreshOrders,
    }));

    const getStatusBadgeClasses = (status: Order["status"]): string => {
      switch (status) {
        case "completed":
          return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-700";
        case "pending":
          return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-700";
        case "cancelled":
        case "refunded":
        default:
          return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700";
      }
    };

    const getStatusBarColor = (status: Order["status"]): string => {
      switch (status) {
        case "completed":
          return "bg-green-500";
        case "pending":
          return "bg-yellow-500";
        case "cancelled":
        case "refunded":
        default:
          return "bg-red-500";
      }
    };

    return (
      <motion.div variants={itemAnimation} className={className}>
        <Card className="mt-5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 mb-2">
                  <Receipt className="h-5 w-5" />
                  {title}
                </CardTitle>
                <CardDescription>{description}</CardDescription>
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
                    When you upgrade to Premium or make purchases, your order
                    history will appear here.
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
                        className={`absolute left-0 top-0 h-full w-1 ${getStatusBarColor(
                          order.status
                        )}`}
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
                              {order.status !== "cancelled" && (
                                <Badge
                                  variant="outline"
                                  className={`text-xs border ${getStatusBadgeClasses(
                                    order.status
                                  )}`}
                                >
                                  {order.status.charAt(0).toUpperCase() +
                                    order.status.slice(1)}
                                </Badge>
                              )}
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

                        <div className="text-right">
                          {order.status === "cancelled" ? (
                            <div className="text-xl font-bold text-red-600 dark:text-red-400">
                              Cancelled
                            </div>
                          ) : (
                            <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
                              {formatAmount(order.amount, order.currency)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {showClearButton && orders.length >= maxOrdersThreshold && (
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
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="cursor-pointer"
                              disabled={isClearingHistory}
                            >
                              {isClearingHistory ? (
                                <div className="flex items-center">
                                  <LoadingSpinner size="sm" />
                                  <span className="ml-2">Clearing...</span>
                                </div>
                              ) : (
                                <>
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Clear History
                                </>
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Clear Order History
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to clear all order
                                history? This action cannot be undone and will
                                permanently delete all {orders.length} orders
                                from your history.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="cursor-pointer">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={handleClearOrderHistory}
                                className="bg-red-600 hover:bg-red-700 focus:ring-red-600 cursor-pointer"
                              >
                                Clear All Orders
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          )}
        </Card>
      </motion.div>
    );
  }
);

OrderHistory.displayName = "OrderHistory";

// Hook for using the OrderHistory ref
export const useOrderHistoryRef = () => {
  const orderHistoryRef = useRef<OrderHistoryRef>(null);

  const refreshOrders = (): void => {
    if (orderHistoryRef.current?.refreshOrders) {
      orderHistoryRef.current.refreshOrders();
    }
  };

  return { orderHistoryRef, refreshOrders };
};
