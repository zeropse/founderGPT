"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Laptop } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
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
      className="border-b sticky top-0 z-50 bg-background/80 backdrop-blur-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <motion.div
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/" className="flex items-center group">
              <Laptop className="h-8 w-8 text-primary mr-2" />
              <span className="text-xl font-bold">FoundrGPT</span>
            </Link>
          </motion.div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button
              className="hover:opacity-70 dark:text-white transition-opacity bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg hover:shadow-xl duration-300 cursor-pointer"
              asChild
            >
              <Link href="/get-started">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
