"use client";

import BoltBadge from "./BoltBadge";
import { motion } from "framer-motion";
import { Twitter, Github, Instagram, Linkedin, Heart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const isAppRoute = pathname.startsWith("/app");

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

  const linkAnimation = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <motion.footer
      initial="hidden"
      whileInView="visible"
      variants={footerAnimation}
      viewport={{ once: true }}
      className="border-t bg-background/80 backdrop-blur-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!isAppRoute && (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="py-16"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
              <motion.div variants={linkAnimation} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-bold text-2xl">FoundrGPT</h3>
                  <p className="text-base text-muted-foreground leading-relaxed max-w-md">
                    AI-powered platform helping entrepreneurs validate, develop,
                    and launch successful business ideas with confidence.
                  </p>
                </div>

                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="font-medium">Made with</span>
                  <Heart
                    size={16}
                    className="text-red-500 fill-current animate-pulse"
                  />
                  <span className="font-medium">for founders worldwide</span>
                </div>
              </motion.div>

              <motion.div
                variants={linkAnimation}
                className="space-y-6 lg:flex lg:flex-col lg:items-end"
              >
                <div className="space-y-4 lg:text-right">
                  <h4 className="font-semibold text-lg text-foreground">
                    Let's Connect
                  </h4>
                  <p className="text-sm text-muted-foreground max-w-xs lg:ml-auto">
                    Follow our journey and connect with the creator behind
                    FoundrGPT
                  </p>
                </div>

                <div className="flex items-center gap-2 lg:justify-end">
                  <motion.a
                    href="https://twitter.com/zer0pse"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative text-muted-foreground hover:text-white transition-all duration-300 p-3 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 hover:from-blue-500 hover:to-blue-600 rounded-xl shadow-sm hover:shadow-md"
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Twitter"
                  >
                    <Twitter size={20} />
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      Twitter
                    </div>
                  </motion.a>

                  <motion.a
                    href="https://github.com/zeropse"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative text-muted-foreground hover:text-white transition-all duration-300 p-3 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 hover:from-gray-700 hover:to-gray-900 rounded-xl shadow-sm hover:shadow-md"
                    whileHover={{ scale: 1.05, rotate: -5 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="GitHub"
                  >
                    <Github size={20} />
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      GitHub
                    </div>
                  </motion.a>

                  <motion.a
                    href="https://linkedin.com/in/zeropse"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative text-muted-foreground hover:text-white transition-all duration-300 p-3 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 hover:from-blue-600 hover:to-blue-700 rounded-xl shadow-sm hover:shadow-md"
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="LinkedIn"
                  >
                    <Linkedin size={20} />
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      LinkedIn
                    </div>
                  </motion.a>

                  <motion.a
                    href="https://instagram.com/zeropse"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative text-muted-foreground hover:text-white transition-all duration-300 p-3 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 hover:from-pink-500 hover:to-purple-600 rounded-xl shadow-sm hover:shadow-md"
                    whileHover={{ scale: 1.05, rotate: -5 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Instagram"
                  >
                    <Instagram size={20} />
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      Instagram
                    </div>
                  </motion.a>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="py-6 border-t flex flex-col sm:flex-row justify-between items-center gap-4"
        >
          <div className="text-sm text-muted-foreground">
            © 2025 FoundrGPT. All rights reserved.
          </div>

          <div className="flex justify-center">
            <BoltBadge />
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link
              href="/privacy"
              className="hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}
