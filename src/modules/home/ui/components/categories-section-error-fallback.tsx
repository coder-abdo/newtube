"use client";
import { FallbackProps } from "react-error-boundary";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function ErrorBoundaryFallback({ error }: FallbackProps) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Something went wrong:</AlertTitle>
      <AlertDescription>{error.message}</AlertDescription>
    </Alert>
  );
}
