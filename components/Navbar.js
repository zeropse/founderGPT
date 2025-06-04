"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Laptop } from "lucide-react";
import { motion } from "framer-motion";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Navbar() {
  const pathname = usePathname();
  const isAppRoute = pathname.startsWith("/app");

  const navAnimation = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={navAnimation}
      className="border-b border-border/40 sticky top-0 z-50 bg-background/95 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group"
            >
              <Link href="/" className="flex items-center group">
                <div className="relative">
                  <Laptop className="h-8 w-8 text-violet-600 mr-3 group-hover:text-violet-700 transition-colors duration-200" />
                  <div className="absolute -inset-1 bg-violet-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  FoundrGPT
                </span>
              </Link>
            </motion.div>
          </div>

          <div className="flex items-center space-x-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <ThemeToggle />
            </motion.div>

            <SignedOut>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative group"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg blur opacity-20 group-hover:opacity-40 transition-opacity duration-200"></div>
                <Button
                  className="relative hover:opacity-90 text-white transition-all duration-200 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-lg hover:shadow-xl border-0 px-6 py-2 rounded-lg font-medium"
                  asChild
                >
                  <Link href="/get-started">Get Started</Link>
                </Button>
              </motion.div>
            </SignedOut>

            <SignedIn>
              {!isAppRoute && (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative group"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg blur opacity-20 group-hover:opacity-40 transition-opacity duration-200"></div>
                  <Button
                    className="relative hover:opacity-90 text-white transition-all duration-200 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-lg hover:shadow-xl border-0 px-6 py-2 rounded-lg font-medium"
                    asChild
                  >
                    <Link href="/app">Continue to App</Link>
                  </Button>
                </motion.div>
              )}
              {isAppRoute && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox:
                          "w-8 h-8 rounded-lg hover:shadow-lg transition-shadow duration-200",
                      },
                    }}
                  />
                </motion.div>
              )}
            </SignedIn>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
