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
import { ArrowRight } from "lucide-react";
import { LoadingSpinner, LoadingDots } from "@/components/ui/loading-spinner";

interface IdeaFormProps {
  idea: string;
  setIdea: (idea: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  promptsRemaining: number;
  weeklyPromptsUsed?: number;
  weeklyPromptsLimit?: number;
  retryTimeout: number | null;
  enhancementStep?: number;
}

export default function IdeaForm({
  idea,
  setIdea,
  handleSubmit,
  isLoading,
  promptsRemaining,
  weeklyPromptsUsed,
  weeklyPromptsLimit,
  retryTimeout,
  enhancementStep = 0,
}: IdeaFormProps) {
  const isDailyLimitReached = promptsRemaining === 0;

  const isWeeklyLimitReached =
    (weeklyPromptsUsed || 0) >= (weeklyPromptsLimit || 0);

  const canSubmit =
    !isLoading &&
    !isDailyLimitReached &&
    !isWeeklyLimitReached &&
    idea.trim() &&
    retryTimeout === null;

  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <CardTitle>Idea Validator</CardTitle>
        <CardDescription>
          Enter your raw idea, and our AI will help refine and validate it.
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
              disabled={!canSubmit}
              className="w-full cursor-pointer"
            >
              {(() => {
                if (isLoading) {
                  return (
                    <div className="flex items-center justify-center gap-2">
                      <LoadingSpinner size="sm" />
                      <span>
                        {enhancementStep === 0 && "Analyzing your idea..."}
                        {enhancementStep === 1 && "Enhancing concept..."}
                        {enhancementStep === 2 && "Researching market..."}
                        {enhancementStep === 3 && "Generating features..."}
                        {enhancementStep === 4 && "Building tech stack..."}
                        {enhancementStep === 5 && "Creating strategies..."}
                        {enhancementStep >= 6 && "Finalizing results..."}
                      </span>
                      <LoadingDots />
                    </div>
                  );
                }

                if (retryTimeout !== null) {
                  return (
                    <div className="flex items-center justify-center gap-2">
                      <LoadingSpinner size="sm" />
                      <span>Please wait...</span>
                    </div>
                  );
                }

                if (isWeeklyLimitReached) {
                  return "Weekly Limit Reached";
                }

                return (
                  <>
                    Validate Idea <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                );
              })()}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
