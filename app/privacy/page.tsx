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
import ScrollToTop from "@/components/ScrollToTop";

interface PrivacyPrinciple {
  icon: React.ReactElement;
  title: string;
  description: string;
}

interface ContentSection {
  type: string;
  heading?: string;
  text?: string;
  items?: string[];
  services?: ServiceItem[];
}

interface PrivacyContentItem {
  icon: React.ReactElement;
  title: string;
  content: ContentSection[];
}

interface ServiceItem {
  title: string;
  description: string;
}

interface ServicesSection extends ContentSection {
  services?: ServiceItem[];
}

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

  const heroContent = {
    title: "Your Privacy Matters",
    subtitle:
      "We're committed to protecting your privacy and being transparent about how we handle your data.",
    lastUpdated: "June 2025",
  };

  const privacyPrinciples: PrivacyPrinciple[] = [
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

  const privacyContent: PrivacyContentItem[] = [
    {
      icon: <UserCheck className="h-6 w-6 text-blue-500" />,
      title: "Information We Collect",
      content: [
        {
          type: "section",
          heading: "Personal Information",
          items: [
            "Email address for account creation and communication",
            "Name and profile information (if provided)",
            "Payment information",
          ],
        },
        {
          type: "section",
          heading: "Usage Data",
          items: [
            "Ideas and content you submit for validation",
            "Feature usage and interaction patterns",
          ],
        },
      ],
    },
    {
      icon: <Database className="h-6 w-6 text-green-500" />,
      title: "How We Use Your Information",
      content: [
        {
          type: "list",
          items: [
            "Provide AI-powered idea validation services",
            "Improve our platform and develop new features",
            "Communicate with you about your account and our services",
            "Process payments and manage subscriptions",
            "Ensure platform security and prevent fraud",
            "Comply with legal obligations",
          ],
        },
      ],
    },
    {
      icon: <Lock className="h-6 w-6 text-purple-500" />,
      title: "Data Security & Storage",
      content: [
        {
          type: "paragraph",
          text: "We implement industry-standard security measures to protect your data:",
        },
        {
          type: "list",
          items: [
            "End-to-end encryption for sensitive data",
            "Secure database storage with MongoDB Atlas",
            "Regular security audits and updates",
            "Limited access on a need-to-know basis",
          ],
        },
      ],
    },
    {
      icon: <Eye className="h-6 w-6 text-orange-500" />,
      title: "Your Rights & Choices",
      content: [
        {
          type: "paragraph",
          text: "You have the right to:",
        },
        {
          type: "list",
          items: [
            "Access your personal data we hold",
            "Request correction of inaccurate information",
            "Delete your account and associated data",
            "Object to certain data processing activities",
          ],
        },
      ],
    },
    {
      icon: <AlertCircle className="h-6 w-6 text-red-500" />,
      title: "Third-Party Services",
      content: [
        {
          type: "paragraph",
          text: "We work with trusted third-party services to provide our platform:",
        },
        {
          type: "services",
          services: [
            {
              title: "Authentication",
              description: "Clerk for secure user authentication",
            },
            {
              title: "Database",
              description: "MongoDB for data storage",
            },
          ],
        },
      ],
    },
  ];

  const renderContent = (
    contentItem: ContentSection | ServicesSection
  ): React.ReactElement | null => {
    switch (contentItem.type) {
      case "paragraph":
        return <p className="text-muted-foreground">{contentItem.text}</p>;
      case "list":
        return (
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            {contentItem.items?.map((item, index) => (
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
      case "services":
        const servicesContent = contentItem as ServicesSection;
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {servicesContent.services?.map((service, index) => (
              <div key={index}>
                <h4 className="font-semibold mb-1">{service.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {service.description}
                </p>
              </div>
            ))}
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

        {/* Privacy Principles */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
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
              {privacyContent.map((section, index) => (
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
      <ScrollToTop />
    </div>
  );
}
