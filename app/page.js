"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  Zap, 
  LightbulbIcon, 
  LineChart, 
  ArrowRight,
  Laptop,
  Sparkles,
  Code,
  Target,
  Users
} from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Home() {
  const router = useRouter();
  const { scrollYProgress } = useScroll();
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const scrollToFeatures = () => {
    document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
  };

  const handleGetStarted = () => {
    router.push('/get-started');
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const staggerChildren = {
    visible: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const scaleUp = {
    hidden: { 
      scale: 0.95, 
      opacity: 0,
      y: 20
    },
    visible: { 
      scale: 1, 
      opacity: 1,
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 100,
        duration: 0.5
      }
    }
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

  const faqs = [
    {
      question: "What is FoundrGPT?",
      answer: "FoundrGPT is an AI-powered platform that helps developers, startups, and indie hackers validate and refine their product ideas. It provides detailed analysis, market validation, and actionable insights to turn your concept into a viable MVP."
    },
    {
      question: "How does the free plan work?",
      answer: "The free plan gives you access to basic idea enhancement features with 2 prompts per day. You can test the platform and get initial feedback on your ideas before committing to the premium plan."
    },
    {
      question: "What additional features do I get with the premium plan?",
      answer: "Premium users get 5 prompts per day (max 25 per week), plus access to market validation, MVP feature breakdown, tech stack suggestions, monetization strategies, and detailed user personas. You also get PDF export functionality."
    },
    {
      question: "How accurate is the AI validation?",
      answer: "Our AI uses industry-standard frameworks and real-world market data to provide accurate, actionable insights. While no validation is 100% guaranteed, our system helps identify potential opportunities and challenges in your idea."
    },
    {
      question: "Can I upgrade or downgrade my plan later?",
      answer: "Yes, you can upgrade to premium at any time. The premium plan is $5/month, giving you immediate access to all premium features."
    },
    {
      question: "How do you handle my data?",
      answer: "We take data privacy seriously. Your ideas and information are encrypted and never shared with third parties. We only use your data to provide and improve our services."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <motion.section 
        initial="hidden"
        animate="visible"
        variants={staggerChildren}
        className="relative py-20 md:py-32 overflow-hidden"
      >
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-violet-500/10"
          style={{ y: backgroundY }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div 
              variants={fadeIn}
              className="inline-flex items-center gap-2 bg-primary/5 rounded-full px-4 py-2 mb-6"
            >
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">AI-Powered Idea Validation</span>
            </motion.div>
            <motion.h1 
              variants={fadeIn}
              className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-violet-500 to-indigo-500"
            >
              Transform Your Idea Into A Validated MVP
            </motion.h1>
            <motion.p 
              variants={fadeIn}
              className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            >
              FoundrGPT helps developers, startups, and indie hackers refine raw 
              ideas into actionable MVPs using industry-aligned standards.
            </motion.p>
            <motion.div 
              variants={fadeIn}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <Button 
                size="lg" 
                className="gap-2 bg-gradient-to-r from-primary to-violet-500 hover:opacity-90 transition-opacity"
                onClick={handleGetStarted}
              >
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="gap-2 border-2" 
                onClick={scrollToFeatures}
              >
                See How It Works
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-violet-500">
              How FoundrGPT Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We use AI to turn your raw concept into a fully validated idea
              with actionable insights
            </p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerChildren}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, i) => (
              <motion.div
                key={i}
                variants={scaleUp}
                className="group bg-card rounded-xl p-6 shadow-lg border transition-all hover:shadow-xl hover:-translate-y-1 duration-300"
                whileHover={{ scale: 1.02 }}
              >
                <div className="mb-4 transform transition-transform duration-300 group-hover:scale-110">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                  {feature.title}
                  {feature.premium && (
                    <Badge variant="secondary\" className="bg-violet-500/10 text-violet-500 border-violet-500/20">
                      Premium
                    </Badge>
                  )}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 relative overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-violet-500/10 opacity-50"
          style={{ y: backgroundY }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-violet-500">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Start with our free plan or upgrade for more features and higher usage limits
            </p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerChildren}
            className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
          >
            {/* Free Plan */}
            <motion.div 
              variants={scaleUp}
              whileHover={{ y: -5 }}
              className="bg-card rounded-xl p-8 shadow-lg border transition-all hover:shadow-xl flex flex-col"
            >
              <h3 className="text-2xl font-bold mb-2">Free Plan</h3>
              <div className="text-4xl font-bold mb-6">$0</div>
              <ul className="space-y-3 mb-8 flex-grow">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>2 prompts per day</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Idea enhancement</span>
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <span className="h-5 w-5">×</span>
                  <span>Market validation</span>
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <span className="h-5 w-5">×</span>
                  <span>MVP features breakdown</span>
                </li>
              </ul>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={handleGetStarted}
                className="border-2"
              >
                Get Started
              </Button>
            </motion.div>

            {/* Premium Plan */}
            <motion.div 
              variants={scaleUp}
              whileHover={{ y: -5 }}
              className="bg-card rounded-xl p-8 shadow-xl border-2 border-violet-500 relative flex flex-col"
            >
              <div className="absolute -top-4 right-4">
                <Badge className="bg-gradient-to-r from-violet-500 to-indigo-500 text-white border-0 px-3 py-1">
                  RECOMMENDED
                </Badge>
              </div>
              <h3 className="text-2xl font-bold mb-2">Premium Plan</h3>
              <div className="text-4xl font-bold mb-6">$5<span className="text-lg font-normal">/month</span></div>
              <ul className="space-y-3 mb-8 flex-grow">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>5 prompts per day (max 25/week)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>All free features</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Market validation</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>MVP features breakdown</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Tech stack suggestions</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>PDF download</span>
                </li>
              </ul>
              <Button 
                size="lg" 
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-violet-500 to-indigo-500 hover:opacity-90 transition-opacity"
              >
                Get Started
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-violet-500">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to know about FoundrGPT
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="bg-card rounded-xl shadow-lg border p-6"
          >
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left hover:text-violet-500 transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}