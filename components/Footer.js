"use client";

import BoltBadge from "./BoltBadge";
import { motion } from "framer-motion";

export default function Footer() {
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
      className="py-8 border-t bg-background/50 backdrop-blur-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-muted-foreground">
            © 2025 FoundrGPT. All rights reserved.
          </div>
          <BoltBadge />
          <div className="flex items-center gap-4">
            {[
              { name: "Twitter", url: "https://twitter.com/zer0pse" },
              { name: "GitHub", url: "https://github.com/zeropse" },
              { name: "Instagram", url: "https://instagram.com/zeropse" },
            ].map((social) => (
              <motion.a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {social.name}
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
