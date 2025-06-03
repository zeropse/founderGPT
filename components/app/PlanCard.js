"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, Lock } from "lucide-react";
import Link from "next/link";

export default function PlanCard({ isPremium, dailyPromptsLimit = 2 }) {
  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Your Plan
          {isPremium && (
            <Badge className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white border-0">
              Premium
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          {isPremium
            ? "Premium Plan - Full Access"
            : "Free Plan - Limited Access"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Daily prompts</span>
              <Badge variant="outline">{dailyPromptsLimit} / day</Badge>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span>Idea enhancement</span>
            <Badge
              variant="outline"
              className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20"
            >
              Included
            </Badge>
          </div>
          {[
            "Market validation",
            "MVP features",
            "Tech stack",
            "Monetization",
            "Landing page",
            "User personas",
          ].map((feature) => (
            <div key={feature} className="flex justify-between items-center">
              <span>{feature}</span>
              {isPremium ? (
                <Badge
                  variant="outline"
                  className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20"
                >
                  Included
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-amber-500/20"
                >
                  <Lock className="h-3 w-3 mr-1" /> Premium
                </Badge>
              )}
            </div>
          ))}

          {!isPremium && (
            <Link href="/app/billing">
              <Button className="w-full mt-4 cursor-pointer">
                <CheckCircle className="mr-2 h-4 w-4" />
                Upgrade to Premium
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
