"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { motion } from "framer-motion";
import { SignedIn, UserButton } from "@clerk/nextjs";

export default function AppNavbar(): JSX.Element {
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
      <div className="px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <SidebarTrigger className="h-8 w-8 hover:bg-accent/80 transition-colors cursor-pointer" />
            </motion.div>
            <div className="text-lg font-semibold text-foreground/80">
              FoundrGPT
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <ThemeToggle />
            </motion.div>

            <SignedIn>
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
            </SignedIn>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}