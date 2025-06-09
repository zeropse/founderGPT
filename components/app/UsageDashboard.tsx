"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Crown, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

interface UsageDashboardProps {
  isPremium?: boolean;
  promptsUsed: number;
  dailyPromptsLimit: number;
  promptsResetDate?: string;
  weeklyPromptsUsed?: number;
  weeklyPromptsLimit?: number;
  weeklyPromptsResetDate?: string;
}

export default function UsageDashboard({
  isPremium,
  promptsUsed,
  dailyPromptsLimit,
  promptsResetDate,
  weeklyPromptsUsed,
  weeklyPromptsLimit,
  weeklyPromptsResetDate,
}: UsageDashboardProps) {
  const usagePercentage = Math.min(
    100,
    (promptsUsed / dailyPromptsLimit) * 100
  );

  const weeklyUsagePercentage = Math.min(
    100,
    ((weeklyPromptsUsed || 0) / (weeklyPromptsLimit || 1)) * 100
  );

  const formatResetTime = () => {
    if (!promptsResetDate) return "midnight UTC";

    const resetDate = new Date(promptsResetDate);
    const now = new Date();

    const timeDiff = resetDate.getTime() - now.getTime();
    const hoursUntilReset = Math.max(0, Math.ceil(timeDiff / (1000 * 60 * 60)));

    if (hoursUntilReset <= 24) {
      return `in ${hoursUntilReset} hours`;
    }

    return resetDate.toLocaleDateString();
  };

  const formatWeeklyResetTime = () => {
    if (!weeklyPromptsResetDate) return "next Monday";

    const resetDate = new Date(weeklyPromptsResetDate);
    const now = new Date();

    const timeDiff = resetDate.getTime() - now.getTime();
    const daysUntilReset = Math.max(
      0,
      Math.ceil(timeDiff / (1000 * 60 * 60 * 24))
    );

    if (daysUntilReset === 0) {
      return "today";
    } else if (daysUntilReset === 1) {
      return "tomorrow";
    } else if (daysUntilReset <= 7) {
      return `in ${daysUntilReset} days`;
    }

    return resetDate.toLocaleDateString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5" />
                Usage Overview
              </CardTitle>
            </div>
            {isPremium && (
              <Badge className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white border-0">
                <Crown className="h-3 w-3 mr-1" />
                Premium
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Daily Prompts</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {promptsUsed} / {dailyPromptsLimit}
                  </span>
                </div>
              </div>
              <Progress value={usagePercentage} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Weekly Prompts</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {weeklyPromptsUsed || 0} / {weeklyPromptsLimit || 0}
                  </span>
                </div>
              </div>
              <Progress value={weeklyUsagePercentage} className="h-2" />
            </div>
          </div>{" "}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-sm font-medium">Daily Limit</div>
              <div className="text-sm text-muted-foreground">
                {dailyPromptsLimit} prompts
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium">Daily Reset</div>
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                {formatResetTime()}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-sm font-medium">Weekly Limit</div>
              <div className="text-sm text-muted-foreground">
                {weeklyPromptsLimit || 0} prompts
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium">Weekly Reset</div>
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                {formatWeeklyResetTime()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
