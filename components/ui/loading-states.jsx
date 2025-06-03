"use client";

import { motion } from "framer-motion";
import { LoadingSpinner, LoadingDots } from "./loading-spinner";
import {
  Sparkles,
  TrendingUp,
  Code,
  DollarSign,
  Globe,
  Users,
  CheckCircle,
  Clock,
  Zap,
  Target,
} from "lucide-react";

// Enhanced API Request Loading Component
export const APIRequestLoading = ({
  message = "Processing your request...",
  submessage = "This may take a few seconds",
  variant = "default",
}) => {
  const variants = {
    default: "from-blue-500/10 to-violet-500/10",
    success: "from-green-500/10 to-emerald-500/10",
    warning: "from-yellow-500/10 to-orange-500/10",
    error: "from-red-500/10 to-pink-500/10",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`flex flex-col items-center justify-center p-8 rounded-lg bg-gradient-to-br ${variants[variant]} border border-border/50`}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="mb-4"
      >
        <LoadingSpinner size="lg" />
      </motion.div>
      <h3 className="text-lg font-medium mb-2">{message}</h3>
      <p className="text-sm text-muted-foreground text-center max-w-sm">
        {submessage}
      </p>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4"
      >
        <LoadingDots />
      </motion.div>
    </motion.div>
  );
};

// Progressive Loading Component for Multi-step Processes
export const ProgressiveLoading = ({
  steps = [],
  currentStep = 0,
  title = "Processing...",
  subtitle = "Please wait while we complete your request",
}) => {
  const defaultSteps = [
    { label: "Initializing", icon: <Zap className="h-4 w-4" /> },
    { label: "Processing", icon: <Target className="h-4 w-4" /> },
    { label: "Finalizing", icon: <CheckCircle className="h-4 w-4" /> },
  ];

  const loadingSteps = steps.length > 0 ? steps : defaultSteps;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center p-8 bg-card rounded-lg border shadow-sm"
    >
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{subtitle}</p>
      </div>

      <div className="w-full max-w-md space-y-4">
        {loadingSteps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0.3 }}
            animate={{
              opacity: index <= currentStep ? 1 : 0.3,
              scale: index === currentStep ? 1.05 : 1,
            }}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
              index === currentStep
                ? "bg-violet-50 dark:bg-violet-950/20 border border-violet-200 dark:border-violet-800"
                : index < currentStep
                ? "bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800"
                : "bg-muted/30 border border-border/50"
            }`}
          >
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                index === currentStep
                  ? "bg-violet-500 text-white"
                  : index < currentStep
                  ? "bg-green-500 text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {index < currentStep ? (
                <CheckCircle className="h-4 w-4" />
              ) : index === currentStep ? (
                <LoadingSpinner size="sm" variant="white" />
              ) : (
                step.icon || <Clock className="h-4 w-4" />
              )}
            </div>
            <span
              className={`font-medium ${
                index <= currentStep
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {step.label}
            </span>
            {index === currentStep && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="ml-auto"
              >
                <LoadingDots />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
        <LoadingSpinner size="sm" />
        <span>
          Step {currentStep + 1} of {loadingSteps.length}
        </span>
      </div>
    </motion.div>
  );
};

// Feature-specific Loading Components
export const IdeaAnalysisLoading = ({ currentPhase = 0 }) => {
  const phases = [
    {
      label: "Enhancing Your Idea",
      description: "AI is refining your concept for clarity and impact",
      icon: <Sparkles className="h-6 w-6 text-violet-500" />,
    },
    {
      label: "Market Research",
      description: "Analyzing competition and market opportunities",
      icon: <TrendingUp className="h-6 w-6 text-blue-500" />,
    },
    {
      label: "Technical Planning",
      description: "Recommending optimal tech stack and MVP features",
      icon: <Code className="h-6 w-6 text-green-500" />,
    },
    {
      label: "Business Strategy",
      description: "Developing monetization and user personas",
      icon: <DollarSign className="h-6 w-6 text-yellow-500" />,
    },
    {
      label: "Final Validation",
      description: "Compiling comprehensive analysis report",
      icon: <CheckCircle className="h-6 w-6 text-emerald-500" />,
    },
  ];

  return (
    <ProgressiveLoading
      steps={phases}
      currentStep={currentPhase}
      title="Validating Your Idea"
      subtitle="Our AI is performing comprehensive analysis to help validate your startup concept"
    />
  );
};

export const PDFGenerationLoading = () => {
  const steps = [
    { label: "Gathering Data", icon: <Globe className="h-4 w-4" /> },
    { label: "Formatting Content", icon: <Code className="h-4 w-4" /> },
    { label: "Generating PDF", icon: <Sparkles className="h-4 w-4" /> },
    { label: "Preparing Download", icon: <CheckCircle className="h-4 w-4" /> },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div className="bg-card rounded-lg border shadow-lg p-6 max-w-md w-full">
        <div className="text-center mb-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="inline-block mb-4"
          >
            <LoadingSpinner size="lg" />
          </motion.div>
          <h3 className="text-lg font-semibold mb-2">Generating PDF Report</h3>
          <p className="text-sm text-muted-foreground">
            Creating your comprehensive idea validation report
          </p>
        </div>

        <div className="space-y-3">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.5 }}
              className="flex items-center gap-3 p-2 rounded-lg bg-muted/30"
            >
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-violet-500 text-white">
                {step.icon}
              </div>
              <span className="text-sm font-medium">{step.label}</span>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <LoadingDots />
        </div>
      </div>
    </motion.div>
  );
};

export const ChatLoadingAnimation = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg"
    >
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <Users className="h-5 w-5 text-violet-500" />
      </motion.div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <div className="h-2 bg-muted-foreground/20 rounded-full w-16"></div>
          <div className="h-2 bg-muted-foreground/20 rounded-full w-24"></div>
        </div>
        <div className="h-2 bg-muted-foreground/20 rounded-full w-32"></div>
      </div>
      <LoadingDots />
    </motion.div>
  );
};

// Export all components
export default {
  APIRequestLoading,
  ProgressiveLoading,
  IdeaAnalysisLoading,
  PDFGenerationLoading,
  ChatLoadingAnimation,
};
