"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, ArrowRight, Loader2, Sparkles } from "lucide-react";

export default function IdeaForm({
  idea,
  setIdea,
  handleSubmit,
  isLoading,
  promptsRemaining,
  isPremium,
  handleUpgrade,
  retryTimeout,
  results,
  resetForm,
}) {
  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <CardTitle>Idea Validator</CardTitle>
        <CardDescription>
          Enter your raw idea, and our AI will help refine and validate it
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Describe your idea here... (e.g., 'A platform that helps startup founders validate their ideas using AI')"
            className="min-h-[200px] resize-none"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            disabled={isLoading}
          />

          <div className="flex flex-col space-y-3">
            <Button
              type="submit"
              disabled={
                isLoading ||
                promptsRemaining === 0 ||
                !idea.trim() ||
                retryTimeout !== null
              }
              className="w-full cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : retryTimeout !== null ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait...
                </>
              ) : (
                <>
                  Validate Idea <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>

            {results && (
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                className="w-full cursor-pointer"
              >
                Start Over
              </Button>
            )}

            {promptsRemaining === 0 && !isPremium && (
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center text-destructive gap-1">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">Daily limit reached</span>
                </div>
                <Button
                  variant="outline"
                  className="w-full cursor-pointer"
                  onClick={handleUpgrade}
                >
                  Upgrade for $5/month
                </Button>
              </div>
            )}

            <div className="text-center text-sm text-muted-foreground">
              {promptsRemaining > 0 ? (
                <span>
                  You have <strong>{promptsRemaining}</strong> prompt
                  {promptsRemaining !== 1 ? "s" : ""} remaining today
                </span>
              ) : (
                <span>Resets at midnight UTC</span>
              )}
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
