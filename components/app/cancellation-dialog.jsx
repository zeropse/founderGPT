"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle } from "lucide-react";

export function CancellationDialog({
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}) {
  const [confirmText, setConfirmText] = useState("");
  const isConfirmValid = confirmText.trim().toLowerCase() === "cancel";

  const handleConfirm = () => {
    if (isConfirmValid) {
      onConfirm();
      setConfirmText("");
    }
  };

  const handleCancel = () => {
    setConfirmText("");
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-destructive" />
            <AlertDialogTitle className="text-lg font-semibold">
              Cancel Premium Plan
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-left">
            Are you sure you want to cancel your Premium plan? This action will:
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-3 mb-4">
          <ul className="text-sm text-muted-foreground">
            <li>• Immediately downgrade you to the Free plan</li>
            <li>• Remove access to all Premium features</li>
            <li>• Require repurchasing ($5) to regain Premium access</li>
          </ul>
          <div className="text-sm font-medium text-destructive">
            This action cannot be undone.
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-text" className="text-sm font-medium">
            Type <span className="font-bold text-destructive">"Cancel"</span> to
            confirm:
          </Label>
          <Input
            id="confirm-text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Type Cancel here..."
            className="w-full mt-2"
            disabled={isLoading}
          />
        </div>

        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel
            onClick={handleCancel}
            disabled={isLoading}
            className="cursor-pointer"
          >
            Keep Premium
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={!isConfirmValid || isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer"
          >
            {isLoading ? "Cancelling..." : "Cancel Plan"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
