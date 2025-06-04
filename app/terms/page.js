"use client";

import { motion } from "framer-motion";
import {
  FileText,
  Scale,
  Users,
  AlertTriangle,
  CreditCard,
  Shield,
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
                Terms of Service
              </h1>

              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Clear and fair terms for using FoundrGPT. We believe in
                transparency and mutual respect.
              </p>

              <div className="text-sm text-muted-foreground">
                Last updated: June 2025
              </div>
            </motion.div>
          </div>
        </section>

        {/* Key Terms Overview */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
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
              <motion.div variants={fadeInUp}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Scale className="h-6 w-6 text-blue-500" />
                      Acceptance of Terms
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      By accessing and using FoundrGPT ("the Service"), you
                      accept and agree to be bound by the terms and provision of
                      this agreement. If you do not agree to these terms, please
                      do not use our service.
                    </p>
                    <p className="text-muted-foreground">
                      These terms apply to all visitors, users, and others who
                      access or use the service.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-6 w-6 text-green-500" />
                      Description of Service
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      FoundrGPT is an AI-powered platform that helps
                      entrepreneurs validate, develop, and launch business
                      ideas. Our services include:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>AI-powered idea validation and enhancement</li>
                      <li>Market analysis and competitive research</li>
                      <li>
                        MVP development guidance and tech stack recommendations
                      </li>
                      <li>Revenue strategy and monetization insights</li>
                      <li>User persona and target market analysis</li>
                      <li>Business plan generation and strategic guidance</li>
                    </ul>
                    <p className="text-muted-foreground">
                      We reserve the right to modify, suspend, or discontinue
                      the service at any time with reasonable notice.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-6 w-6 text-purple-500" />
                      User Accounts & Responsibilities
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">
                        Account Registration
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        <li>
                          You must provide accurate and complete information
                        </li>
                        <li>
                          You are responsible for maintaining account security
                        </li>
                        <li>
                          You must be at least 15 years old to use the service
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Acceptable Use</h4>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        <li>Use the service only for lawful purposes</li>
                        <li>
                          Do not submit harmful, illegal, or inappropriate
                          content
                        </li>
                        <li>Respect rate limits and usage quotas</li>
                        <li>
                          Do not attempt to reverse engineer or exploit the
                          service
                        </li>
                        <li>Do not share account credentials with others</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-6 w-6 text-indigo-500" />
                      Intellectual Property Rights
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Your Content</h4>
                      <p className="text-muted-foreground mb-2">
                        You retain all rights to your business ideas, content,
                        and intellectual property submitted to FoundrGPT. We do
                        not claim ownership of your ideas.
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        <li>
                          Your business ideas remain your intellectual property
                        </li>
                        <li>
                          We only use your content to provide our services
                        </li>
                        <li>We do not share your ideas with third parties</li>
                        <li>
                          You grant us a limited license to process and analyze
                          your content
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Our Platform</h4>
                      <p className="text-muted-foreground">
                        The FoundrGPT platform, including its design, features,
                        and AI models, is our intellectual property and is
                        protected by copyright and other laws.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-6 w-6 text-green-500" />
                      Billing & Payment Terms
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Subscription Plans</h4>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        <li>Free tier with limited features and usage</li>
                        <li>Premium subscriptions with enhanced features</li>
                        <li>Billing occurs monthly based on your plan</li>
                        <li>
                          Prices are subject to change with 30 days notice
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Payment & Refunds</h4>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        <li>Payments are processed securely</li>
                        <li>You can cancel your subscription at any time</li>
                        <li>Refunds are provided on a case-by-case basis</li>
                        <li>No refunds for partial billing periods</li>
                        <li>
                          Failed payments may result in service suspension
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-6 w-6 text-red-500" />
                      Service Limitations & Disclaimers
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">
                        AI-Generated Content
                      </h4>
                      <p className="text-muted-foreground mb-2">
                        Our AI-powered analysis and recommendations are for
                        informational purposes only:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        <li>
                          Results are not guaranteed and may contain
                          inaccuracies
                        </li>
                        <li>
                          You should conduct your own research and due diligence
                        </li>
                        <li>
                          We are not responsible for business decisions based on
                          our analysis
                        </li>
                        <li>
                          Market conditions and business landscapes change
                          rapidly
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">
                        Service Availability
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        <li>
                          We strive for 99.9% uptime but cannot guarantee
                          continuous availability
                        </li>
                        <li>
                          Maintenance and updates may require temporary service
                          interruptions
                        </li>
                        <li>
                          We are not liable for damages caused by service
                          outages
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Scale className="h-6 w-6 text-blue-500" />
                      Limitation of Liability
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      To the maximum extent permitted by law, FoundrGPT shall
                      not be liable for any indirect, incidental, special,
                      consequential, or punitive damages, including without
                      limitation, loss of profits, data, use, goodwill, or other
                      intangible losses.
                    </p>
                    <p className="text-muted-foreground">
                      Our total liability for any claims arising from these
                      terms or your use of the service shall not exceed the
                      amount you paid us in the 12 months preceding the claim.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-6 w-6 text-purple-500" />
                      Termination
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      Either party may terminate this agreement at any time:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>
                        You can delete your account and stop using the service
                      </li>
                      <li>
                        We may suspend or terminate accounts for violations of
                        these terms
                      </li>
                      <li>
                        Upon termination, your access to the service will cease
                      </li>
                      <li>
                        We will retain your data according to our Privacy Policy
                      </li>
                      <li>
                        Certain provisions will survive termination (payment
                        obligations, intellectual property, etc.)
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card>
                  <CardHeader>
                    <CardTitle>Changes to Terms & Contact</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Modifications</h4>
                      <p className="text-muted-foreground mb-2">
                        We may update these terms from time to time. We will
                        notify you of significant changes by:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        <li>Email notification to registered users</li>
                        <li>Prominent notice on our website</li>
                        <li>In-app notifications</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
