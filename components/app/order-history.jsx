"use client";

import { useState } from "react";
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
  CreditCard,
  Receipt,
  Calendar,
  Package,
  Trash2,
  Crown,
} from "lucide-react";
import { motion } from "framer-motion";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function OrderHistory({
  fetchOrderHistory,
  className = "",
  title = "Order History",
  description = "View your past subscription orders and transactions",
  showClearButton = true,
  maxOrdersThreshold = 10,
}) {
  const [orders, setOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [showOrders, setShowOrders] = useState(false);

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

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const refreshOrders = async () => {
    if (showOrders) {
      try {
        const orderHistory = await fetchOrderHistory();
        setOrders(orderHistory);
      } catch (error) {
        console.warn("Failed to refresh orders:", error);
      }
    }
  };

  OrderHistory.refreshOrders = refreshOrders;

  return (
    <motion.div variants={itemAnimation} className={className}>
      <Card>
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
                                  ? "destructive"
                                  : "default"
                              }
                              className={`text-xs ${
                                order.status === "completed"
                                  ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-300"
                                  : order.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300"
                                  : order.status === "cancelled"
                                  ? "bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-300"
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
                          {formatAmount(order.amount)}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          USD
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {showClearButton && orders.length > maxOrdersThreshold && (
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
  );
}

// Add a ref method to allow parent components to refresh orders
export const useOrderHistoryRef = () => {
  const refreshOrders = (orderHistoryRef) => {
    if (orderHistoryRef?.current?.refreshOrders) {
      orderHistoryRef.current.refreshOrders();
    }
  };

  return { refreshOrders };
};
