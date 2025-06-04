"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Zap, Lightbulb } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

export default function GetStartedPage() {
  const containerAnimation = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.15,
      },
    },
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const floatingAnimation = {
    initial: { y: 0 },
    animate: {
      y: [-5, 5, -5],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-background via-background to-background/90">
        {/* Enhanced Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-r from-violet-500/15 to-purple-500/15 blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.4, 0.7, 0.4],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-r from-blue-500/15 to-cyan-500/15 blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.6, 0.3],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-gradient-to-r from-emerald-500/10 to-teal-500/10 blur-3xl"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerAnimation}
            className="text-center space-y-16"
          >
            {/* Hero Section */}
            <motion.div variants={itemAnimation} className="space-y-8">
              <motion.div
                variants={floatingAnimation}
                initial="initial"
                animate="animate"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-lg rounded-full px-8 py-4 mb-8 border border-violet-200/20 dark:border-violet-800/30 shadow-lg"
              >
                <Sparkles className="h-6 w-6 text-violet-500" />
                <span className="text-base font-semibold bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Welcome to FoundrGPT
                </span>
              </motion.div>

              <div className="space-y-6">
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 dark:from-white dark:via-gray-100 dark:to-gray-300 bg-clip-text text-transparent leading-[0.9] tracking-tight">
                  Validate Your
                  <span className="block bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mt-2">
                    Startup Idea
                  </span>
                </h1>

                <motion.div variants={itemAnimation} className="inline-block">
                  <p className="text-2xl md:text-3xl font-medium text-muted-foreground/80">
                    in Minutes, Not Months
                  </p>
                </motion.div>
              </div>
            </motion.div>

            {/* Enhanced CTA Section */}
            <motion.div
              variants={itemAnimation}
              className="space-y-8 max-w-lg mx-auto"
            >
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="relative group"
              >
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>

                <Button
                  className="relative w-full text-xl h-16 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 hover:from-violet-700 hover:via-purple-700 hover:to-pink-700 shadow-2xl border-0 rounded-2xl font-semibold text-white"
                  size="lg"
                  asChild
                >
                  <Link
                    href="/app"
                    className="flex items-center justify-center gap-4"
                  >
                    <Zap className="h-6 w-6" />
                    Start Validating Your Idea
                    <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </motion.div>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gradient-to-r from-transparent via-border to-transparent opacity-50"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-background/80 backdrop-blur-sm px-6 py-2 text-sm font-medium text-muted-foreground rounded-full border">
                    Or explore first
                  </span>
                </div>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="outline"
                  className="w-full text-lg h-14 border-2 hover:bg-accent/30 transition-all duration-300 rounded-xl bg-background/50 backdrop-blur-sm hover:border-violet-300 dark:hover:border-violet-700"
                  size="lg"
                  asChild
                >
                  <Link
                    href="/"
                    className="flex items-center justify-center gap-3"
                  >
                    <Lightbulb className="h-5 w-5" />
                    Go Back Home
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
      <Footer />
      <ScrollToTop />
    </>
  );
}
