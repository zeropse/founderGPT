"use client";

import { motion } from "framer-motion";
import {
  Shield,
  Lock,
  Eye,
  Database,
  UserCheck,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPolicy() {
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

  const privacyPrinciples = [
    {
      icon: <Shield className="h-8 w-8 text-green-500" />,
      title: "Data Protection",
      description:
        "Your personal information is encrypted and stored securely using industry-standard protocols.",
    },
    {
      icon: <Lock className="h-8 w-8 text-blue-500" />,
      title: "Access Control",
      description:
        "Only authorized personnel can access user data, and all access is logged and monitored.",
    },
    {
      icon: <Eye className="h-8 w-8 text-purple-500" />,
      title: "Transparency",
      description:
        "We're clear about what data we collect, how we use it, and your rights regarding your information.",
    },
    {
      icon: <Database className="h-8 w-8 text-orange-500" />,
      title: "Data Minimization",
      description:
        "We only collect the data necessary to provide and improve our services.",
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
                Your Privacy Matters
              </h1>

              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                We're committed to protecting your privacy and being transparent
                about how we handle your data.
              </p>

              <div className="text-sm text-muted-foreground">
                Last updated: June 2025
              </div>
            </motion.div>
          </div>
        </section>

        {/* Privacy Principles */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {privacyPrinciples.map((principle, index) => (
                <motion.div key={index} variants={fadeInUp}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <div className="mb-4 flex justify-center">
                        {principle.icon}
                      </div>
                      <h3 className="font-semibold text-lg mb-2">
                        {principle.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {principle.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Privacy Policy Content */}
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
                      <UserCheck className="h-6 w-6 text-blue-500" />
                      Information We Collect
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">
                        Personal Information
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        <li>
                          Email address for account creation and communication
                        </li>
                        <li>Name and profile information (if provided)</li>
                        <li>Payment information</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Usage Data</h4>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        <li>Ideas and content you submit for validation</li>
                        <li>Feature usage and interaction patterns</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-6 w-6 text-green-500" />
                      How We Use Your Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>Provide AI-powered idea validation services</li>
                      <li>Improve our platform and develop new features</li>
                      <li>
                        Communicate with you about your account and our services
                      </li>
                      <li>Process payments and manage subscriptions</li>
                      <li>Ensure platform security and prevent fraud</li>
                      <li>Comply with legal obligations</li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="h-6 w-6 text-purple-500" />
                      Data Security & Storage
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      We implement industry-standard security measures to
                      protect your data:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>End-to-end encryption for sensitive data</li>
                      <li>Secure database storage with MongoDB Atlas</li>
                      <li>Regular security audits and updates</li>
                      <li>Limited access on a need-to-know basis</li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="h-6 w-6 text-orange-500" />
                      Your Rights & Choices
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      You have the right to:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Access your personal data we hold</li>
                      <li>Request correction of inaccurate information</li>
                      <li>Delete your account and associated data</li>
                      <li>Object to certain data processing activities</li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="h-6 w-6 text-red-500" />
                      Third-Party Services
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      We work with trusted third-party services to provide our
                      platform:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-1">Authentication</h4>
                        <p className="text-sm text-muted-foreground">
                          Clerk for secure user authentication
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Database</h4>
                        <p className="text-sm text-muted-foreground">
                          MongoDB Atlas for data storage
                        </p>
                      </div>
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
