"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Crown, Calendar, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export default function UsageDashboard({
  isPremium,
  promptsUsed,
  promptsRemaining,
  dailyPromptsLimit,
  promptsResetDate,
}) {
  const usagePercentage = Math.min(
    100,
    (promptsUsed / dailyPromptsLimit) * 100
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

  const getStatusColor = () => {
    if (usagePercentage <= 50)
      return "text-green-600 bg-green-100 dark:bg-green-900";
    if (usagePercentage <= 80)
      return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900";
    return "text-red-600 bg-red-100 dark:bg-red-900";
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-sm font-medium">Plan Type</div>
              <div className="text-sm text-muted-foreground">
                {isPremium ? "Premium" : "Free"}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-sm font-medium">Daily Limit</div>
              <div className="text-sm text-muted-foreground">
                {dailyPromptsLimit} prompts
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-sm font-medium">Next Reset</div>
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatResetTime()}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-sm font-medium">Status</div>
              <div className="text-sm">
                {promptsRemaining > 0 ? (
                  <span className="text-green-600">Active</span>
                ) : (
                  <span className="text-red-600">Limit Reached</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
