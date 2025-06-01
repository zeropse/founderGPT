"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { AlertCircle, CheckCircle, CreditCard, Loader2 } from "lucide-react";

export default function BillingPage() {
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async () => {
    try {
      setIsLoading(true);
      // Simulate API call - in production, this would be a real payment flow
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsPremium(true);
      toast.success("Successfully upgraded to Premium!");
    } catch (error) {
      console.error('Upgrade error:', error);
      toast.error("Failed to upgrade. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    try {
      setIsLoading(true);
      // Simulate API call - in production, this would cancel the subscription
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsPremium(false);
      toast.success("Successfully cancelled Premium plan. Changes will take effect at the end of your billing period.");
    } catch (error) {
      console.error('Cancellation error:', error);
      toast.error("Failed to cancel subscription. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Billing</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Free Plan */}
        <Card className={`border-2 ${!isPremium ? "border-primary" : ""}`}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Free Plan</CardTitle>
                <CardDescription>Limited features</CardDescription>
              </div>
              {!isPremium && (
                <Badge className="bg-primary text-primary-foreground">
                  CURRENT PLAN
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-6">$0</div>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>2 prompts per day</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Idea enhancement</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <span className="h-4 w-4">×</span>
                <span>Market validation</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <span className="h-4 w-4">×</span>
                <span>MVP feature breakdown</span>
              </li>
            </ul>

            {isPremium && (
              <Button 
                variant="outline" 
                className="w-full mt-6"
                onClick={handleCancel}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Switch to Free Plan"
                )}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Premium Plan */}
        <Card className={`border-2 ${isPremium ? "border-primary" : ""}`}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Premium Plan</CardTitle>
                <CardDescription>Full access to all features</CardDescription>
              </div>
              {isPremium && (
                <Badge className="bg-primary text-primary-foreground">
                  CURRENT PLAN
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-6">$5<span className="text-base font-normal">/month</span></div>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>5 prompts per day (max 25/week)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>All free features</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Market validation</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>MVP features breakdown</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Tech stack suggestions</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>PDF download</span>
              </li>
            </ul>

            {!isPremium ? (
              <Button 
                className="w-full mt-6" 
                onClick={handleUpgrade}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Upgrading...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Upgrade Now
                  </>
                )}
              </Button>
            ) : (
              <Button 
                variant="destructive" 
                className="w-full mt-6"
                onClick={handleCancel}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Cancel Plan"
                )}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Usage Overview */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Usage Overview</CardTitle>
            <CardDescription>Your current usage and limits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg border">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Daily Prompts</span>
                  <Badge variant="outline">
                    {isPremium ? "5" : "2"} per day
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  Resets daily at midnight UTC
                </div>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg border">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Weekly Limit</span>
                  <Badge variant="outline">
                    {isPremium ? "25" : "14"} per week
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  Resets weekly on Sunday at midnight UTC
                </div>
              </div>
            </div>

            {isPremium && (
              <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Premium features active - Full access enabled</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}