"use client";

import BoltBadge from "./BoltBadge";
import { motion } from "framer-motion";

export default function AppFooter() {
  const footerAnimation = {
    hidden: { y: 20, opacity: 0 },
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
    <motion.footer
      initial="hidden"
      whileInView="visible"
      variants={footerAnimation}
      viewport={{ once: true }}
      className="py-6 border-t bg-background/50 backdrop-blur-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground">
            © 2025 FoundrGPT. All rights reserved.
          </p>
          <BoltBadge />
        </div>
      </div>
    </motion.footer>
  );
}
