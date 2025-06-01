"use client";

import { Button } from "@/components/ui/button";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function GetStartedPage() {
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
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center relative overflow-hidden">
      <motion.div
        className="absolute inset-0"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      <div className="max-w-md w-full px-4 relative z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerAnimation}
          className="text-center space-y-8"
        >
          <motion.div variants={itemAnimation} className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-primary/5 rounded-full px-4 py-2 mb-4">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Welcome to FoundrGPT</span>
            </div>
            <h1 className="text-4xl font-bold">Get Started with FoundrGPT</h1>
            <p className="text-muted-foreground">
              Join thousands of founders validating their ideas with AI
            </p>
          </motion.div>

          <motion.div variants={itemAnimation} className="space-y-4">
            <Button
              className="w-full text-lg h-12 hover:opacity-90 transition-opacity"
              size="lg"
              asChild
            >
              <Link href="/app">
                Sign in to FoundrGPT
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full text-lg h-12 border-2"
              size="lg"
              asChild
            >
              <Link href="/">Back to Home</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
