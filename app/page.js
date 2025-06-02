"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle,
  LightbulbIcon,
  LineChart,
  ArrowRight,
  Sparkles,
  Code,
  Target,
  Users,
  ChevronRight,
  Play,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Home() {
  const router = useRouter();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const scrolltoHowItWorks = () => {
    document
      .getElementById("how-it-works")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const handleGetStarted = () => {
    router.push("/get-started");
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.25, 0.25, 0.75],
      },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const scaleIn = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.6,
      },
    },
  };

  const slideInLeft = {
    hidden: { x: -100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const slideInRight = {
    hidden: { x: 100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const features = [
    {
      icon: <LightbulbIcon className="h-10 w-10 text-yellow-500" />,
      title: "Smart Idea Enhancement",
      description:
        "Transform raw concepts into clear, impactful product ideas with AI-powered refinement.",
    },
    {
      icon: <Target className="h-10 w-10 text-blue-500" />,
      title: "Market Validation",
      description:
        "Get deep insights into market fit, competition, and your unique value proposition.",
      premium: true,
    },
    {
      icon: <Code className="h-10 w-10 text-emerald-500" />,
      title: "MVP Blueprint",
      description:
        "Receive a detailed breakdown of essential features for your minimum viable product.",
      premium: true,
    },
    {
      icon: <LineChart className="h-10 w-10 text-purple-500" />,
      title: "Revenue Strategy",
      description:
        "Get actionable monetization strategies tailored for bootstrapped founders.",
      premium: true,
    },
    {
      icon: <Sparkles className="h-10 w-10 text-indigo-500" />,
      title: "Tech Stack Guide",
      description:
        "Get expert recommendations for your tech stack, from frontend to deployment.",
      premium: true,
    },
    {
      icon: <Users className="h-10 w-10 text-rose-500" />,
      title: "User Insights",
      description:
        "Understand your target users with detailed personas and pain point analysis.",
      premium: true,
    },
  ];

  const processSteps = [
    {
      step: "01",
      title: "Describe Your Idea",
      description:
        "Share your concept, no matter how rough or incomplete it might be.",
      icon: <LightbulbIcon className="h-8 w-8" />,
    },
    {
      step: "02",
      title: "AI Analysis",
      description:
        "Our AI analyzes market trends, competition, and validates your concept.",
      icon: <Sparkles className="h-8 w-8" />,
    },
    {
      step: "03",
      title: "Get Insights",
      description:
        "Receive detailed reports with actionable recommendations and next steps.",
      icon: <Target className="h-8 w-8" />,
    },
    {
      step: "04",
      title: "Build Your MVP",
      description:
        "Use our blueprint to build a focused, market-ready minimum viable product.",
      icon: <Code className="h-8 w-8" />,
    },
  ];

  const faqs = [
    {
      question: "What is FoundrGPT?",
      answer:
        "FoundrGPT is an AI-powered platform that helps developers, startups, and indie hackers validate and refine their product ideas. It provides detailed analysis, market validation, and actionable insights to turn your concept into a viable MVP.",
    },
    {
      question: "How does the free plan work?",
      answer:
        "The free plan gives you access to basic idea enhancement features with 2 prompts per day. You can test the platform and get initial feedback on your ideas before committing to the premium plan.",
    },
    {
      question: "What additional features do I get with the premium plan?",
      answer:
        "Premium users get 5 prompts per day (max 25 per week), plus access to market validation, MVP feature breakdown, tech stack suggestions, monetization strategies, and detailed user personas. You also get PDF export functionality.",
    },
    {
      question: "How accurate is the AI validation?",
      answer:
        "Our AI uses industry-standard frameworks and real-world market data to provide accurate, actionable insights. While no validation is 100% guaranteed, our system helps identify potential opportunities and challenges in your idea.",
    },
    {
      question: "Can I upgrade or downgrade my plan later?",
      answer:
        "Yes, you can upgrade to premium at any time. The premium plan is $5/month, giving you immediate access to all premium features.",
    },
    {
      question: "How do you handle my data?",
      answer:
        "We take data privacy seriously. Your ideas and information are encrypted and never shared with third parties. We only use your data to provide and improve our services.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-violet-500/10 to-indigo-500/10 rounded-full blur-3xl"
          animate={{
            x: mousePosition.x * 0.02,
            y: mousePosition.y * 0.02,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
        />
        <motion.div
          className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-full blur-3xl"
          animate={{
            x: mousePosition.x * -0.02,
            y: mousePosition.y * -0.02,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
        />
      </div>

      {/* Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="relative py-30 md:py-40 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500/10 to-indigo-500/10 border border-violet-500/20 rounded-full px-6 py-3 mb-8"
            >
              <Sparkles className="h-5 w-5 text-violet-500" />
              <Badge className="text-sm font-medium bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent cursor-pointer">
                AI-Powered Idea Validation Platform
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent"
            >
              Transform Your Idea Into A{" "}
              <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                Validated MVP
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed"
            >
              FoundrGPT helps developers, startups, and indie hackers refine raw
              ideas into actionable MVPs using industry-aligned standards and
              AI-powered insights.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row justify-center gap-6 mb-12"
            >
              <Button
                size="lg"
                className="gap-3 px-8 py-6 dark:text-white text-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
                onClick={handleGetStarted}
              >
                Get Started Free
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="gap-3 px-8 py-6 text-lg border-2 hover:bg-muted/50 cursor-pointer group"
                onClick={scrolltoHowItWorks}
              >
                <Play className="h-5 w-5" />
                See How It Works
              </Button>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="flex items-center justify-center gap-8 text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>2 free prompts daily</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Instant results</span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              How It{" "}
              <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                Works
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our AI-powered process transforms your raw idea into a validated,
              actionable business plan in minutes
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {processSteps.map((step, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="relative group"
              >
                <Card className="h-full border-2 hover:border-violet-200 dark:hover:border-violet-800 transition-all duration-300 hover:shadow-lg">
                  <CardContent className="p-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                      <div className="text-white">{step.icon}</div>
                    </div>
                    <div className="text-sm font-bold text-violet-600 mb-2">
                      {step.step}
                    </div>
                    <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ChevronRight className="h-8 w-8 text-violet-300" />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Powerful{" "}
              <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                Features
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to validate, refine, and launch your next big
              idea with confidence
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, i) => (
              <motion.div
                key={i}
                variants={scaleIn}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group bg-card rounded-2xl p-8 shadow-lg border-2 hover:border-violet-200 dark:hover:border-violet-800 transition-all duration-300 hover:shadow-xl cursor-pointer"
              >
                <div className="mb-6 transform transition-transform duration-300 group-hover:scale-110">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 flex items-center gap-3">
                  {feature.title}
                  {feature.premium && (
                    <Badge className="bg-gradient-to-r from-violet-500 to-indigo-500 text-white border-0">
                      Premium
                    </Badge>
                  )}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-950/20 dark:to-indigo-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Simple,{" "}
              <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                Transparent
              </span>{" "}
              Pricing
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Start with our free plan or upgrade for more features and higher
              usage limits
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto cursor-pointer"
          >
            {/* Free Plan */}
            <motion.div
              variants={slideInLeft}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-card rounded-2xl p-8 shadow-lg border-2 transition-all duration-300 hover:shadow-xl flex flex-col"
            >
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">Free Plan</h3>
                <div className="text-5xl font-bold mb-2">$0</div>
                <p className="text-muted-foreground">
                  Perfect for getting started
                </p>
              </div>
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>2 prompts per day</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>Basic idea enhancement</span>
                </li>
              </ul>
            </motion.div>

            {/* Premium Plan */}
            <motion.div
              variants={slideInRight}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-card rounded-2xl p-8 shadow-xl border-2 border-violet-500 relative flex flex-col"
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-violet-500 to-indigo-500 text-white border-0 px-4 py-2 text-sm">
                  MOST POPULAR
                </Badge>
              </div>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">Premium Plan</h3>
                <div className="text-5xl font-bold mb-2">
                  $5
                  <span className="text-xl font-normal text-muted-foreground">
                    /month
                  </span>
                </div>
                <p className="text-muted-foreground">
                  Everything you need to succeed
                </p>
              </div>
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>5 prompts per day (max 20/week)</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>All free features included</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>Advanced market validation</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>Detailed MVP features breakdown</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>Tech stack recommendations</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>PDF export & priority support</span>
                </li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Frequently Asked{" "}
              <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                Questions
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to know about FoundrGPT
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="bg-card rounded-2xl shadow-lg border-2 p-8"
          >
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border-b border-muted"
                >
                  <AccordionTrigger className="text-left cursor-pointer hover:text-violet-600 transition-colors py-6">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              Ready to Validate Your Next Big Idea?
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl mb-8 opacity-90 max-w-2xl mx-auto"
            >
              Join thousands of successful founders who've turned their ideas
              into thriving businesses with FoundrGPT.
            </motion.p>
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <Button
                size="lg"
                className="gap-3 px-8 py-6 text-lg dark:text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
                onClick={handleGetStarted}
              >
                Get Started Free
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
