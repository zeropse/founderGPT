"use client";

import {
  Download,
  Lock,
  Sparkles,
  Code,
  Users,
  DollarSign,
  Globe,
  Lightbulb,
  TrendingUp,
  Server,
  LinkIcon,
  Folder,
  RefreshCw,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

const PremiumLock = ({ feature }) => (
  <div className="bg-muted/50 rounded-lg p-6 text-center">
    <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
    <h3 className="font-medium text-lg mb-2">Premium Feature</h3>
    <p className="text-muted-foreground mb-4 max-w-md mx-auto">
      Upgrade to Premium to unlock {feature} for your idea.
    </p>
    <Link href="/app/billing">
      <Button variant="default" className="cursor-pointer">
        Upgrade for $5/month
      </Button>
    </Link>
  </div>
);

const LoadingSkeleton = () => (
  <div className="space-y-8 animate-pulse">
    <div className="flex items-center justify-center py-12">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center mb-4">
          <Sparkles className="h-12 w-12 text-primary animate-pulse" />
        </div>
        <h3 className="text-xl font-medium text-primary">
          Analyzing your idea...
        </h3>
        <div className="flex justify-center gap-2">
          <span
            className="w-2 h-2 rounded-full bg-primary animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <span
            className="w-2 h-2 rounded-full bg-primary animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <span
            className="w-2 h-2 rounded-full bg-primary animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    </div>
  </div>
);

const cleanMarkdownContent = (content) => {
  if (!content) return content;

  let cleaned = content;
  if (typeof content === "string") {
    // Remove standalone asterisks that are used as bullet points
    cleaned = content
      .replace(/^\*\s+/gm, "• ") // Replace asterisk bullets with bullet points
      .replace(/\*([^*]+)\*:/g, "**$1:**") // Fix bold formatting for headers
      .replace(/\*\s*$/gm, "") // Remove trailing asterisks
      .replace(/\*{2,}/g, "**"); // Normalize multiple asterisks to double
  }
  return cleaned;
};

const MarkdownContent = ({ content }) => {
  if (!content)
    return <p className="text-muted-foreground">No data available</p>;

  let formattedContent = content;
  if (Array.isArray(content)) {
    formattedContent = content.join("\n\n");
  } else if (typeof content !== "string") {
    formattedContent = JSON.stringify(content, null, 2);
  }

  const cleanedContent = cleanMarkdownContent(formattedContent);

  return (
    <div className="prose prose-sm dark:prose-invert max-w-none">
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="text-xl font-bold mb-4 text-foreground border-b border-border pb-2">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-semibold mb-3 text-foreground mt-6">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-medium mb-2 text-foreground mt-4">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="mb-3 text-foreground leading-relaxed">{children}</p>
          ),
          strong: ({ children }) => {
            const cleanText =
              typeof children === "string"
                ? children.replace(/^\*+|\*+$/g, "")
                : children;
            return (
              <span className="font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded-md">
                {cleanText}
              </span>
            );
          },
          em: ({ children }) => (
            <em className="italic text-foreground">{children}</em>
          ),
          ul: ({ children }) => <ul className="space-y-2 mb-4">{children}</ul>,
          ol: ({ children }) => <ol className="space-y-2 mb-4">{children}</ol>,
          li: ({ children }) => (
            <li className="text-foreground flex items-start gap-3">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2.5 flex-shrink-0"></span>
              <span className="flex-1">{children}</span>
            </li>
          ),
          code: ({ children }) => (
            <code className="bg-muted px-2 py-1 rounded text-sm font-mono text-foreground border">
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4 border">
              {children}
            </pre>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground mb-4 bg-muted/30 py-3 rounded-r">
              {children}
            </blockquote>
          ),
        }}
      >
        {cleanedContent}
      </ReactMarkdown>
    </div>
  );
};

const TechStackDisplay = ({ techStack }) => {
  if (!techStack)
    return (
      <p className="text-muted-foreground">No tech stack data available</p>
    );

  if (typeof techStack === "string") {
    return <MarkdownContent content={techStack} />;
  }

  if (typeof techStack === "object" && !Array.isArray(techStack)) {
    const techIcons = {
      frontend: <Globe className="h-5 w-5" />,
      backend: <Code className="h-5 w-5" />,
      database: <TrendingUp className="h-5 w-5" />,
      hosting: <Lightbulb className="h-5 w-5" />,
      infrastructure: <Server className="h-5 w-5" />,
      authentication: <Lock className="h-5 w-5" />,
      apis: <LinkIcon className="h-5 w-5" />,
      storage: <Folder className="h-5 w-5" />,
      cicd: <RefreshCw className="h-5 w-5" />,
      monitoring: <Activity className="h-5 w-5" />,
      ai: <Sparkles className="h-5 w-5" />,
    };

    return (
      <div className="space-y-4">
        {Object.entries(techStack).map(([category, technology], index) => (
          <div
            key={index}
            className="p-4 bg-gradient-to-r from-muted/50 to-muted/30 rounded-lg border"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                {techIcons[category.toLowerCase()] || (
                  <Code className="h-5 w-5" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-foreground capitalize text-lg">
                  {category.replace(/([A-Z])/g, " $1").trim()}
                </h3>
                <Badge variant="outline" className="mt-1">
                  Recommended
                </Badge>
              </div>
            </div>
            <div className="ml-14">
              {typeof technology === "string" ? (
                <p className="text-foreground font-medium">
                  {technology.replace(/^\*\*|\*\*$/g, "")}
                </p>
              ) : (
                <MarkdownContent content={technology} />
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return <MarkdownContent content={techStack} />;
};

const PersonaCard = ({ persona, index }) => {
  const personaIcons = [
    <Users key="users-icon" className="h-5 w-5" />,
    <TrendingUp key="trending-icon" className="h-5 w-5" />,
    <DollarSign key="dollar-icon" className="h-5 w-5" />,
  ];

  // Clean the persona name from markdown formatting
  const cleanName =
    typeof persona.name === "string"
      ? persona.name.replace(/^\*\*|\*\*$/g, "")
      : persona.name;

  return (
    <Card className="border-2 hover:shadow-lg transition-all duration-200 h-full cursor-pointer">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-lg">
            {personaIcons[index % personaIcons.length]}
          </div>
          <div>
            <span className="font-bold text-foreground">{cleanName}</span>
            <Badge variant="secondary" className="ml-2">
              Persona {index + 1}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-red-500/5 rounded-lg border border-red-500/20">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="font-semibold text-red-600 dark:text-red-400 text-sm uppercase tracking-wide">
              Pain Points
            </span>
          </div>
          <MarkdownContent content={persona.painPoints} />
        </div>

        <div className="p-4 bg-blue-500/5 rounded-lg border border-blue-500/20">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="font-semibold text-blue-600 dark:text-blue-400 text-sm uppercase tracking-wide">
              Goals
            </span>
          </div>
          <MarkdownContent content={persona.goals} />
        </div>

        <div className="p-4 bg-emerald-500/5 rounded-lg border border-emerald-500/20">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-sm uppercase tracking-wide">
              Solution
            </span>
          </div>
          <MarkdownContent content={persona.solution} />
        </div>
      </CardContent>
    </Card>
  );
};

export default function ResultsDisplay({
  results,
  isPremium,
  activeTab,
  setActiveTab,
  handleDownloadPDF,
  isLoading,
}) {
  if (isLoading) {
    return (
      <Card className="border-border shadow-md">
        <CardHeader>
          <CardTitle>Enhancing Your Idea</CardTitle>
          <CardDescription>
            Please wait while we process your request
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoadingSkeleton />
        </CardContent>
      </Card>
    );
  }

  if (!results) return null;

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card className="overflow-hidden border-border shadow-md">
        <CardHeader className="bg-gradient-to-r from-violet-500/5 to-violet-500/10">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-violet-500" />
            Enhanced Idea
          </CardTitle>
          <CardDescription>
            Your raw idea refined for clarity and impact
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <ScrollArea className="h-[400px] sm:h-[500px] lg:h-[600px] p-6">
            <MarkdownContent content={results.enhancedIdea} />
          </ScrollArea>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 w-full">
          <TabsTrigger value="validation" className="cursor-pointer">
            Market
          </TabsTrigger>
          <TabsTrigger value="features" className="cursor-pointer">
            Features
          </TabsTrigger>
          <TabsTrigger value="tech" className="cursor-pointer">
            Tech Stack
          </TabsTrigger>
          <TabsTrigger value="monetization" className="cursor-pointer">
            Revenue
          </TabsTrigger>
          <TabsTrigger value="landing" className="cursor-pointer">
            Landing
          </TabsTrigger>
          <TabsTrigger value="personas" className="cursor-pointer">
            Personas
          </TabsTrigger>
        </TabsList>

        {/* Market Validation Tab */}
        <TabsContent value="validation">
          <Card className="overflow-hidden border-border shadow-md">
            <CardHeader className="bg-gradient-to-r from-blue-500/5 to-blue-500/10">
              <CardTitle>Market Validation</CardTitle>
              <CardDescription>
                Analysis of market fit and competition
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              {isPremium ? (
                <ScrollArea className="h-[400px] sm:h-[500px] lg:h-[600px] p-6">
                  <MarkdownContent content={results.marketValidation} />
                </ScrollArea>
              ) : (
                <div className="p-6">
                  <PremiumLock feature="market validation insights" />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Features Tab */}
        <TabsContent value="features">
          <Card className="overflow-hidden border-border shadow-md">
            <CardHeader className="bg-gradient-to-r from-emerald-500/5 to-emerald-500/10">
              <CardTitle>MVP Features</CardTitle>
              <CardDescription>
                Core features for your minimum viable product
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              {isPremium ? (
                <ScrollArea className="h-[400px] sm:h-[500px] lg:h-[600px] p-6">
                  <MarkdownContent content={results.mvpFeatures} />
                </ScrollArea>
              ) : (
                <div className="p-6">
                  <PremiumLock feature="MVP feature recommendations" />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tech Stack Tab */}
        <TabsContent value="tech">
          <Card className="overflow-hidden border-border shadow-md">
            <CardHeader className="bg-gradient-to-r from-violet-500/5 to-violet-500/10">
              <CardTitle>Tech Stack</CardTitle>
              <CardDescription>
                Recommended technologies for your project
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              {isPremium ? (
                <ScrollArea className="h-[400px] sm:h-[500px] lg:h-[600px] p-6">
                  <TechStackDisplay techStack={results.techStack} />
                </ScrollArea>
              ) : (
                <div className="p-6">
                  <PremiumLock feature="tech stack recommendations" />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Monetization Tab */}
        <TabsContent value="monetization">
          <Card className="overflow-hidden border-border shadow-md">
            <CardHeader className="bg-gradient-to-r from-amber-500/5 to-amber-500/10">
              <CardTitle>Monetization Strategy</CardTitle>
              <CardDescription>Revenue models for your product</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              {isPremium ? (
                <ScrollArea className="h-[400px] sm:h-[500px] lg:h-[600px] p-6">
                  <MarkdownContent content={results.monetization} />
                </ScrollArea>
              ) : (
                <div className="p-6">
                  <PremiumLock feature="monetization strategy recommendations" />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Landing Page Tab */}
        <TabsContent value="landing">
          <Card className="overflow-hidden border-border shadow-md">
            <CardHeader className="bg-gradient-to-r from-cyan-500/5 to-cyan-500/10">
              <CardTitle>Landing Page Content</CardTitle>
              <CardDescription>
                Copy suggestions for your landing page
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              {isPremium ? (
                <ScrollArea className="h-[400px] sm:h-[500px] lg:h-[600px] p-6">
                  <div className="space-y-6">
                    {results.landingPage && (
                      <>
                        <div className="p-6 bg-gradient-to-r from-violet-500/5 to-violet-500/10 rounded-lg border">
                          <div className="flex items-center gap-2 mb-3">
                            <Globe className="h-5 w-5 text-violet-600" />
                            <h3 className="text-sm font-medium text-violet-700 dark:text-violet-300 uppercase tracking-wide">
                              Headline
                            </h3>
                          </div>
                          <p className="text-2xl font-bold text-foreground leading-tight">
                            {results.landingPage.headline}
                          </p>
                        </div>

                        <div className="p-6 bg-muted/50 rounded-lg border">
                          <div className="flex items-center gap-2 mb-3">
                            <TrendingUp className="h-5 w-5 text-muted-foreground" />
                            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                              Subheading
                            </h3>
                          </div>
                          <p className="text-lg text-foreground leading-relaxed">
                            {results.landingPage.subheading}
                          </p>
                        </div>

                        <div className="p-6 bg-gradient-to-r from-emerald-500/5 to-emerald-500/10 rounded-lg border">
                          <div className="flex items-center gap-2 mb-4">
                            <Lightbulb className="h-5 w-5 text-emerald-600" />
                            <h3 className="text-sm font-medium text-emerald-700 dark:text-emerald-300 uppercase tracking-wide">
                              Call to Action
                            </h3>
                          </div>
                          <Button
                            size="lg"
                            className="font-semibold text-lg px-8 py-3 cursor-pointer"
                          >
                            {results.landingPage.cta}
                          </Button>
                        </div>

                        {results.landingPage.benefits && (
                          <div className="p-6 bg-muted/30 rounded-lg border">
                            <div className="flex items-center gap-2 mb-4">
                              <Users className="h-5 w-5 text-foreground" />
                              <h3 className="text-sm font-medium text-foreground uppercase tracking-wide">
                                Key Benefits
                              </h3>
                            </div>
                            <div className="space-y-4">
                              {results.landingPage.benefits.map(
                                (benefit, i) => (
                                  <div
                                    key={i}
                                    className="flex items-start gap-4 p-4 bg-background rounded-lg border shadow-sm hover:shadow-md transition-shadow"
                                  >
                                    <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                                      {i + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <MarkdownContent content={benefit} />
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </ScrollArea>
              ) : (
                <div className="p-6">
                  <PremiumLock feature="landing page content suggestions" />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Personas Tab */}
        <TabsContent value="personas">
          <Card className="overflow-hidden border-border shadow-md">
            <CardHeader className="bg-gradient-to-r from-fuchsia-500/5 to-fuchsia-500/10">
              <CardTitle>User Personas</CardTitle>
              <CardDescription>
                Potential user types for your product
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              {isPremium ? (
                <ScrollArea className="h-[400px] sm:h-[500px] lg:h-[600px] p-6">
                  <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
                    {results.userPersonas &&
                      results.userPersonas.map((persona, i) => (
                        <PersonaCard key={i} persona={persona} index={i} />
                      ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="p-6">
                  <PremiumLock feature="user persona analysis" />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Download PDF Button */}
      {isPremium && results && (
        <Card className="border-border shadow-sm">
          <CardContent className="pt-6">
            <Button
              className="w-full cursor-pointer"
              variant="outline"
              onClick={handleDownloadPDF}
            >
              <Download className="mr-2 h-4 w-4" />
              Download Full Report as PDF
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
