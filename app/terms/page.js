"use client";

import { motion } from "framer-motion";
import {
  FileText,
  Scale,
  Users,
  AlertTriangle,
  CreditCard,
  Shield,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TermsOfService() {
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

  const heroContent = {
    title: "Terms of Service",
    subtitle:
      "Clear and fair terms for using FoundrGPT. We believe in transparency and mutual respect.",
    lastUpdated: "June 2025",
  };

  const keyTerms = [
    {
      icon: <Users className="h-8 w-8 text-blue-500" />,
      title: "User Responsibilities",
      description:
        "Use our platform responsibly and respect other users and our systems.",
    },
    {
      icon: <CreditCard className="h-8 w-8 text-green-500" />,
      title: "Billing & Payments",
      description: "Clear terms for subscriptions, payments, and refunds.",
    },
    {
      icon: <Shield className="h-8 w-8 text-purple-500" />,
      title: "Intellectual Property",
      description:
        "Your ideas remain yours. We respect your intellectual property rights.",
    },
    {
      icon: <AlertTriangle className="h-8 w-8 text-orange-500" />,
      title: "Service Limitations",
      description:
        "Understanding the scope and limitations of our AI-powered services.",
    },
  ];

  const termsContent = [
    {
      icon: <Scale className="h-6 w-6 text-blue-500" />,
      title: "Acceptance of Terms",
      content: [
        {
          type: "paragraph",
          text: 'By accessing and using FoundrGPT ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our service.',
        },
        {
          type: "paragraph",
          text: "These terms apply to all visitors, users, and others who access or use the service.",
        },
      ],
    },
    {
      icon: <FileText className="h-6 w-6 text-green-500" />,
      title: "Description of Service",
      content: [
        {
          type: "paragraph",
          text: "FoundrGPT is an AI-powered platform that helps entrepreneurs validate, develop, and launch business ideas. Our services include:",
        },
        {
          type: "list",
          items: [
            "AI-powered idea validation and enhancement",
            "Market analysis and competitive research",
            "MVP development guidance and tech stack recommendations",
            "Revenue strategy and monetization insights",
            "User persona and target market analysis",
            "Business plan generation and strategic guidance",
          ],
        },
        {
          type: "paragraph",
          text: "We reserve the right to modify, suspend, or discontinue the service at any time with reasonable notice.",
        },
      ],
    },
    {
      icon: <Users className="h-6 w-6 text-purple-500" />,
      title: "User Accounts & Responsibilities",
      content: [
        {
          type: "section",
          heading: "Account Registration",
          items: [
            "You must provide accurate and complete information",
            "You are responsible for maintaining account security",
            "You must be at least 15 years old to use the service",
          ],
        },
        {
          type: "section",
          heading: "Acceptable Use",
          items: [
            "Use the service only for lawful purposes",
            "Do not submit harmful, illegal, or inappropriate content",
            "Respect rate limits and usage quotas",
            "Do not attempt to reverse engineer or exploit the service",
            "Do not share account credentials with others",
          ],
        },
      ],
    },
    {
      icon: <Shield className="h-6 w-6 text-indigo-500" />,
      title: "Intellectual Property Rights",
      content: [
        {
          type: "section",
          heading: "Your Content",
          text: "You retain all rights to your business ideas, content, and intellectual property submitted to FoundrGPT. We do not claim ownership of your ideas.",
          items: [
            "Your business ideas remain your intellectual property",
            "We only use your content to provide our services",
            "We do not share your ideas with third parties",
            "You grant us a limited license to process and analyze your content",
          ],
        },
        {
          type: "section",
          heading: "Our Platform",
          text: "The FoundrGPT platform, including its design, features, and AI models, is our intellectual property and is protected by copyright and other laws.",
        },
      ],
    },
    {
      icon: <CreditCard className="h-6 w-6 text-green-500" />,
      title: "Billing & Payment Terms",
      content: [
        {
          type: "section",
          heading: "Subscription Plans",
          items: [
            "Free tier with limited features and usage",
            "Premium subscriptions with enhanced features",
            "Billing occurs monthly based on your plan",
            "Prices are subject to change with 30 days notice",
          ],
        },
        {
          type: "section",
          heading: "Payment & Refunds",
          items: [
            "Payments are processed securely",
            "You can cancel your subscription at any time",
            "Refunds are provided on a case-by-case basis",
            "No refunds for partial billing periods",
            "Failed payments may result in service suspension",
          ],
        },
      ],
    },
    {
      icon: <AlertTriangle className="h-6 w-6 text-red-500" />,
      title: "Service Limitations & Disclaimers",
      content: [
        {
          type: "section",
          heading: "AI-Generated Content",
          text: "Our AI-powered analysis and recommendations are for informational purposes only:",
          items: [
            "Results are not guaranteed and may contain inaccuracies",
            "You should conduct your own research and due diligence",
            "We are not responsible for business decisions based on our analysis",
            "Market conditions and business landscapes change rapidly",
          ],
        },
        {
          type: "section",
          heading: "Service Availability",
          items: [
            "We strive for 99.9% uptime but cannot guarantee continuous availability",
            "Maintenance and updates may require temporary service interruptions",
            "We are not liable for damages caused by service outages",
          ],
        },
      ],
    },
    {
      icon: <Scale className="h-6 w-6 text-blue-500" />,
      title: "Limitation of Liability",
      content: [
        {
          type: "paragraph",
          text: "To the maximum extent permitted by law, FoundrGPT shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.",
        },
        {
          type: "paragraph",
          text: "Our total liability for any claims arising from these terms or your use of the service shall not exceed the amount you paid us in the 12 months preceding the claim.",
        },
      ],
    },
    {
      icon: <FileText className="h-6 w-6 text-purple-500" />,
      title: "Termination",
      content: [
        {
          type: "paragraph",
          text: "Either party may terminate this agreement at any time:",
        },
        {
          type: "list",
          items: [
            "You can delete your account and stop using the service",
            "We may suspend or terminate accounts for violations of these terms",
            "Upon termination, your access to the service will cease",
            "We will retain your data according to our Privacy Policy",
            "Certain provisions will survive termination (payment obligations, intellectual property, etc.)",
          ],
        },
      ],
    },
    {
      icon: <RefreshCw className="h-6 w-6 text-yellow-500" />,
      title: "Changes to Terms",
      content: [
        {
          type: "section",
          heading: "Modifications",
          text: "We may update these terms from time to time. We will notify you of significant changes by:",
          items: [
            "Email notification to registered users",
            "Prominent notice on our website",
          ],
        },
      ],
    },
  ];

  const renderContent = (contentItem) => {
    switch (contentItem.type) {
      case "paragraph":
        return <p className="text-muted-foreground">{contentItem.text}</p>;
      case "list":
        return (
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            {contentItem.items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        );
      case "section":
        return (
          <div>
            <h4 className="font-semibold mb-2">{contentItem.heading}</h4>
            {contentItem.text && (
              <p className="text-muted-foreground mb-2">{contentItem.text}</p>
            )}
            {contentItem.items && (
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                {contentItem.items.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="space-y-6"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                {heroContent.title}
              </h1>

              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                {heroContent.subtitle}
              </p>

              <div className="text-sm text-muted-foreground">
                Last updated: {heroContent.lastUpdated}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Key Terms Overview */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {keyTerms.map((term, index) => (
                <motion.div key={index} variants={fadeInUp}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <div className="mb-4 flex justify-center">
                        {term.icon}
                      </div>
                      <h3 className="font-semibold text-lg mb-2">
                        {term.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {term.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Terms Content */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="space-y-8"
            >
              {termsContent.map((section, index) => (
                <motion.div key={index} variants={fadeInUp}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {section.icon}
                        {section.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {section.content.map((contentItem, contentIndex) => (
                        <div key={contentIndex}>
                          {renderContent(contentItem)}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
