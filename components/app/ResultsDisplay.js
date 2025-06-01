"use client";

import { AlertCircle, Download, Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";

const PremiumLock = ({ feature }) => (
  <div className="bg-muted/50 rounded-lg p-6 text-center">
    <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
    <h3 className="font-medium text-lg mb-2">Premium Feature</h3>
    <p className="text-muted-foreground mb-4 max-w-md mx-auto">
      Upgrade to Premium to unlock {feature} for your idea.
    </p>
    <Link href="/billing">
      <Button variant="default">Upgrade for $5/month</Button>
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
        <h3 className="text-xl font-medium text-primary">Analyzing your idea...</h3>
        <div className="flex justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  </div>
);

const formatContent = (content) => {
  if (!content) return "No data available";
  if (Array.isArray(content)) return content.join("\n\n");
  if (typeof content === "string") return content;
  return JSON.stringify(content, null, 2);
};

export default function ResultsDisplay({
  results,
  isPremium,
  activeTab,
  setActiveTab,
  handleDownloadPDF,
  isLoading
}) {
  if (isLoading) {
    return (
      <Card className="border-border shadow-md">
        <CardHeader>
          <CardTitle>Enhancing Your Idea</CardTitle>
          <CardDescription>Please wait while we process your request</CardDescription>
        </CardHeader>
        <CardContent>
          <LoadingSkeleton />
        </CardContent>
      </Card>
    );
  }

  if (!results) return null;

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-border shadow-md">
        <CardHeader className="bg-gradient-to-r from-violet-500/5 to-violet-500/10">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-violet-500" />
            Enhanced Idea
          </CardTitle>
          <CardDescription>Your raw idea refined for clarity and impact</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <ScrollArea className="h-full max-h-[400px]">
            <div className="prose dark:prose-invert max-w-none">
              <p className="whitespace-pre-wrap">{formatContent(results.enhancedIdea)}</p>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 lg:grid-cols-6 w-full">
          <TabsTrigger value="validation">Market</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="tech">Tech Stack</TabsTrigger>
          <TabsTrigger value="monetization">Revenue</TabsTrigger>
          <TabsTrigger value="landing">Landing</TabsTrigger>
          <TabsTrigger value="personas">Personas</TabsTrigger>
        </TabsList>

        {/* Market Validation Tab */}
        <TabsContent value="validation">
          <Card className="overflow-hidden border-border shadow-md">
            <CardHeader className="bg-gradient-to-r from-blue-500/5 to-blue-500/10">
              <CardTitle>Market Validation</CardTitle>
              <CardDescription>Analysis of market fit and competition</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {isPremium ? (
                <ScrollArea className="h-full max-h-[400px]">
                  <div className="prose dark:prose-invert max-w-none">
                    <div className="whitespace-pre-wrap">{formatContent(results.marketValidation)}</div>
                  </div>
                </ScrollArea>
              ) : (
                <PremiumLock feature="market validation insights" />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Features Tab */}
        <TabsContent value="features">
          <Card className="overflow-hidden border-border shadow-md">
            <CardHeader className="bg-gradient-to-r from-emerald-500/5 to-emerald-500/10">
              <CardTitle>MVP Features</CardTitle>
              <CardDescription>Core features for your minimum viable product</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {isPremium ? (
                <ScrollArea className="h-full max-h-[400px]">
                  <div className="prose dark:prose-invert max-w-none">
                    <div className="whitespace-pre-wrap">{formatContent(results.mvpFeatures)}</div>
                  </div>
                </ScrollArea>
              ) : (
                <PremiumLock feature="MVP feature recommendations" />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tech Stack Tab */}
        <TabsContent value="tech">
          <Card className="overflow-hidden border-border shadow-md">
            <CardHeader className="bg-gradient-to-r from-violet-500/5 to-violet-500/10">
              <CardTitle>Tech Stack</CardTitle>
              <CardDescription>Recommended technologies for your project</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {isPremium ? (
                <ScrollArea className="h-full max-h-[400px]">
                  <div className="space-y-4">
                    {results.techStack && Object.entries(results.techStack).map(([key, value]) => (
                      <div key={key} className="p-4 bg-muted/50 rounded-lg border">
                        <h3 className="font-medium capitalize mb-2">{key}:</h3>
                        <p className="text-muted-foreground">{value}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <PremiumLock feature="tech stack recommendations" />
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
            <CardContent className="p-6">
              {isPremium ? (
                <ScrollArea className="h-full max-h-[400px]">
                  <div className="prose dark:prose-invert max-w-none">
                    <div className="whitespace-pre-wrap">{formatContent(results.monetization)}</div>
                  </div>
                </ScrollArea>
              ) : (
                <PremiumLock feature="monetization strategy recommendations" />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Landing Page Tab */}
        <TabsContent value="landing">
          <Card className="overflow-hidden border-border shadow-md">
            <CardHeader className="bg-gradient-to-r from-cyan-500/5 to-cyan-500/10">
              <CardTitle>Landing Page Content</CardTitle>
              <CardDescription>Copy suggestions for your landing page</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {isPremium ? (
                <ScrollArea className="h-full max-h-[400px]">
                  <div className="space-y-6">
                    {results.landingPage && (
                      <>
                        <div className="p-4 bg-gradient-to-r from-violet-500/5 to-violet-500/10 rounded-lg border">
                          <h3 className="text-sm font-medium mb-2">Headline</h3>
                          <p className="text-2xl font-bold">{results.landingPage.headline}</p>
                        </div>
                        <div className="p-4 bg-muted/50 rounded-lg border">
                          <h3 className="text-sm font-medium mb-2">Subheading</h3>
                          <p className="text-lg">{results.landingPage.subheading}</p>
                        </div>
                        <div className="p-4 bg-gradient-to-r from-emerald-500/5 to-emerald-500/10 rounded-lg border">
                          <h3 className="text-sm font-medium mb-2">Call to Action</h3>
                          <Button size="lg">{results.landingPage.cta}</Button>
                        </div>
                        {results.landingPage.benefits && (
                          <div className="p-4 bg-muted/30 rounded-lg border">
                            <h3 className="text-sm font-medium mb-4">Key Benefits</h3>
                            <div className="space-y-3">
                              {results.landingPage.benefits.map((benefit, i) => (
                                <div key={i} className="flex items-start gap-3 p-3 bg-background rounded border">
                                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                                    {i + 1}
                                  </div>
                                  <p>{benefit}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </ScrollArea>
              ) : (
                <PremiumLock feature="landing page content suggestions" />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Personas Tab */}
        <TabsContent value="personas">
          <Card className="overflow-hidden border-border shadow-md">
            <CardHeader className="bg-gradient-to-r from-fuchsia-500/5 to-fuchsia-500/10">
              <CardTitle>User Personas</CardTitle>
              <CardDescription>Potential user types for your product</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {isPremium ? (
                <ScrollArea className="h-full max-h-[400px]">
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {results.userPersonas && results.userPersonas.map((persona, i) => (
                      <Card key={i} className="border-2">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                              {i + 1}
                            </div>
                            {persona.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                          <div className="p-3 bg-red-500/5 rounded-lg border border-red-500/20">
                            <span className="font-semibold text-red-600 dark:text-red-400 block mb-1">
                              Pain Points
                            </span>
                            <p>{persona.painPoints}</p>
                          </div>
                          <div className="p-3 bg-blue-500/5 rounded-lg border border-blue-500/20">
                            <span className="font-semibold text-blue-600 dark:text-blue-400 block mb-1">
                              Goals
                            </span>
                            <p>{persona.goals}</p>
                          </div>
                          <div className="p-3 bg-emerald-500/5 rounded-lg border border-emerald-500/20">
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400 block mb-1">
                              Solution
                            </span>
                            <p>{persona.solution}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <PremiumLock feature="user persona analysis" />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {isPremium && results && (
        <Card className="border-border shadow-sm">
          <CardContent className="pt-6">
            <Button className="w-full" variant="outline" onClick={handleDownloadPDF}>
              <Download className="mr-2 h-4 w-4" />
              Download Full Report as PDF
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}