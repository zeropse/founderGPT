"use client";

import BoltBadge from "./BoltBadge";
import { motion } from "framer-motion";
import {
  Twitter,
  Github,
  Instagram,
  Linkedin,
  Heart,
  Laptop,
} from "lucide-react";
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
      className="border-t border-border/40 bg-gradient-to-b from-background/95 to-background backdrop-blur-lg"
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20">
              <motion.div variants={linkAnimation} className="space-y-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-lg">
                      <Laptop className="h-6 w-6 text-violet-600" />
                    </div>
                    <h3 className="font-bold text-3xl bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                      FoundrGPT
                    </h3>
                  </div>
                  <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                    AI-powered platform helping entrepreneurs validate, develop,
                    and launch successful business ideas with confidence and
                    precision.
                  </p>
                </div>

                <motion.div
                  className="flex items-center gap-3 text-base text-muted-foreground p-2"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="font-medium">Made with</span>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Heart size={18} className="text-red-500 fill-current" />
                  </motion.div>
                  <span className="font-medium">for founders worldwide</span>
                </motion.div>
              </motion.div>

              <motion.div
                variants={linkAnimation}
                className="space-y-8 lg:flex lg:flex-col lg:items-end"
              >
                <div className="space-y-6 lg:text-right">
                  <h4 className="font-bold text-2xl text-foreground">
                    Let's Connect
                  </h4>
                  <p className="text-base text-muted-foreground max-w-sm lg:ml-auto">
                    Follow our journey and connect with the creator behind
                    FoundrGPT. Join the community of innovative founders.
                  </p>
                </div>

                <div className="flex items-center gap-4 lg:justify-end">
                  <motion.a
                    href="https://twitter.com/zer0pse"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative text-muted-foreground hover:text-white transition-all duration-300 p-4 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 hover:from-blue-500 hover:to-blue-600 rounded-2xl shadow-lg hover:shadow-xl"
                    whileHover={{ scale: 1.1, rotate: -3 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Twitter"
                  >
                    <Twitter size={22} />
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      Twitter
                    </div>
                  </motion.a>

                  <motion.a
                    href="https://github.com/zeropse"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative text-muted-foreground hover:text-white transition-all duration-300 p-4 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 hover:from-gray-700 hover:to-gray-900 rounded-2xl shadow-lg hover:shadow-xl"
                    whileHover={{ scale: 1.1, rotate: 3 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="GitHub"
                  >
                    <Github size={22} />
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      GitHub
                    </div>
                  </motion.a>

                  <motion.a
                    href="https://linkedin.com/in/zeropse"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative text-muted-foreground hover:text-white transition-all duration-300 p-4 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 hover:from-blue-600 hover:to-blue-700 rounded-2xl shadow-lg hover:shadow-xl"
                    whileHover={{ scale: 1.1, rotate: -3 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="LinkedIn"
                  >
                    <Linkedin size={22} />
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      LinkedIn
                    </div>
                  </motion.a>

                  <motion.a
                    href="https://instagram.com/zeropse"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative text-muted-foreground hover:text-white transition-all duration-300 p-4 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 hover:from-pink-500 hover:to-purple-600 rounded-2xl shadow-lg hover:shadow-xl"
                    whileHover={{ scale: 1.1, rotate: 3 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Instagram"
                  >
                    <Instagram size={22} />
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
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
          className="py-8 border-t border-border/40 flex flex-col sm:flex-row justify-between items-center gap-6"
        >
          <div className="text-sm text-muted-foreground font-medium">
            © 2025 FoundrGPT. All rights reserved.
          </div>

          <div className="flex justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <BoltBadge />
            </motion.div>
          </div>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link
              href="/privacy"
              className="hover:text-foreground transition-colors duration-200 font-medium"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-foreground transition-colors duration-200 font-medium"
            >
              Terms of Service
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}
