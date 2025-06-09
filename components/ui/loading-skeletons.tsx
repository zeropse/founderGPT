"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingSpinner, LoadingDots } from "@/components/ui/loading-spinner";
import { Sparkles, Database, Brain, Zap } from "lucide-react";
import { motion } from "framer-motion";

interface LoadingMessage {
  icon: React.ReactElement;
  text: string;
  subtext: string;
}

interface DatabaseLoadingSkeletonProps {
  title?: string;
  subtitle?: string;
  showProgress?: boolean;
  currentStep?: number;
  steps?: LoadingMessage[];
}

const defaultLoadingMessages = [
  {
    icon: <Brain className="h-5 w-5" />,
    text: "Analyzing your idea with AI...",
    subtext: "Processing market trends and competition",
  },
  {
    icon: <Database className="h-5 w-5" />,
    text: "Fetching market data...",
    subtext: "Gathering industry insights and validation",
  },
  {
    icon: <Sparkles className="h-5 w-5" />,
    text: "Generating recommendations...",
    subtext: "Creating personalized insights for your startup",
  },
  {
    icon: <Zap className="h-5 w-5" />,
    text: "Finalizing your report...",
    subtext: "Compiling comprehensive validation results",
  },
];

export function DatabaseLoadingSkeleton({
  title = "Loading...",
  subtitle,
  showProgress = false,
  currentStep = 0,
  steps,
}: DatabaseLoadingSkeletonProps) {
  const loadingMessages = steps || defaultLoadingMessages;
  const currentMessage = loadingMessages[currentStep % loadingMessages.length];

  return (
    <Card className="border-border shadow-md">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full"
          >
            <LoadingSpinner size="lg" />
          </motion.div>
        </div>

        <div className="text-center space-y-2">
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl font-semibold text-primary"
          >
            {title}
          </motion.h3>

          {subtitle && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-sm text-muted-foreground"
            >
              {subtitle}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-2 text-muted-foreground"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {currentMessage.icon}
            </motion.div>
            <span className="text-sm font-medium">{currentMessage.text}</span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xs text-muted-foreground"
          >
            {currentMessage.subtext}
          </motion.p>
        </div>

        {showProgress && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="w-full bg-muted rounded-full h-2"
          >
            <motion.div
              className="bg-primary rounded-full h-2"
              initial={{ width: "0%" }}
              animate={{
                width: `${((currentStep + 1) / loadingMessages.length) * 100}%`,
              }}
              transition={{ duration: 0.5 }}
            />
          </motion.div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-20 w-full rounded-lg" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-20 w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <LoadingDots />
        </div>
      </CardContent>
    </Card>
  );
}

export function ChatHistoryLoadingSkeleton() {
  return (
    <div className="space-y-3 px-2">
      <div className="flex items-center justify-center py-6">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex items-center gap-2 text-primary"
        >
          <LoadingSpinner size="sm" />
          <span className="text-sm font-medium">Loading conversations...</span>
        </motion.div>
      </div>

      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="flex items-center gap-3 p-3 rounded-lg border"
        >
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-2/3" />
            <Skeleton className="h-2 w-1/3" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export function UserDataLoadingSkeleton() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-4"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mx-auto"
        >
          <LoadingSpinner size="lg" />
        </motion.div>

        <div className="space-y-2">
          <motion.h3
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-lg font-medium text-primary"
          >
            Loading your dashboard...
          </motion.h3>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-sm text-muted-foreground"
          >
            Syncing your account data and preferences
          </motion.p>
        </div>

        <LoadingDots />
      </motion.div>
    </div>
  );
}

export function PlanLoadingSkeleton() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {[...Array(2)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <Card className="h-full">
            <CardHeader className="text-center">
              <Skeleton className="h-12 w-12 rounded-full mx-auto mb-2" />
              <Skeleton className="h-6 w-24 mx-auto mb-2" />
              <Skeleton className="h-4 w-32 mx-auto mb-4" />
              <Skeleton className="h-8 w-20 mx-auto" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(4)].map((_, j) => (
                <div key={j} className="flex items-center gap-3">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 flex-1" />
                </div>
              ))}
              <Skeleton className="h-10 w-full mt-6" />
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
