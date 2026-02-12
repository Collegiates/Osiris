"use client";

import { AlertCircle, RefreshCw, Server, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

type ErrorType = "BACKEND_DOWN" | "INVALID_RESPONSE" | "NETWORK_ERROR" | "MISSING_ENV_VARS";

interface ConfigErrorProps {
    errorType: ErrorType;
    errorMessage: string;
}

export function ConfigError({ errorType, errorMessage }: ConfigErrorProps) {
    const [isRetrying, setIsRetrying] = useState(false);

    const handleRetry = () => {
        setIsRetrying(true);
        // Reload the page to retry fetching config
        window.location.reload();
    };

    const getErrorDetails = () => {
        switch (errorType) {
            case "BACKEND_DOWN":
                return {
                    icon: Server,
                    title: "Backend Server Not Running",
                    description: "The FastAPI backend server is not responding.",
                    steps: [
                        "Ensure the backend server is running",
                        "Start it with: uvicorn backend.main:app --reload",
                        "Verify it's accessible at the configured NEXT_PUBLIC_API_URL",
                    ],
                };
            case "MISSING_ENV_VARS":
                return {
                    icon: Database,
                    title: "Missing Configuration",
                    description: "Supabase environment variables are not configured in the backend.",
                    steps: [
                        "Check that backend/.env file exists",
                        "Ensure NEXT_PUBLIC_SUPABASE_URL is set",
                        "Ensure NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is set",
                        "Restart the backend server after updating .env",
                    ],
                };
            case "INVALID_RESPONSE":
                return {
                    icon: AlertCircle,
                    title: "Invalid Backend Response",
                    description: "The backend returned an unexpected response format.",
                    steps: [
                        "Check backend logs for errors",
                        "Verify the /api/env endpoint is working correctly",
                        "Ensure the backend is returning the correct data format",
                    ],
                };
            case "NETWORK_ERROR":
            default:
                return {
                    icon: AlertCircle,
                    title: "Connection Error",
                    description: "Unable to connect to the backend server.",
                    steps: [
                        "Check your network connection",
                        "Verify the backend URL in .env.local",
                        "Ensure the backend server is running and accessible",
                    ],
                };
        }
    };

    const { icon: Icon, title, description, steps } = getErrorDetails();

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-6">
            <div className="max-w-2xl w-full">
                <div className="border border-destructive/50 rounded-lg p-8 bg-destructive/5">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="p-3 rounded-full bg-destructive/10">
                            <Icon className="h-6 w-6 text-destructive" />
                        </div>
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-foreground mb-2">{title}</h1>
                            <p className="text-muted-foreground">{description}</p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-sm font-semibold text-foreground mb-3">Error Details:</h2>
                        <div className="bg-muted/50 rounded p-3 font-mono text-sm text-muted-foreground">
                            {errorMessage}
                        </div>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-sm font-semibold text-foreground mb-3">How to Fix:</h2>
                        <ol className="space-y-2">
                            {steps.map((step, index) => (
                                <li key={index} className="flex gap-3 text-sm text-muted-foreground">
                                    <span className="font-semibold text-foreground">{index + 1}.</span>
                                    <span>{step}</span>
                                </li>
                            ))}
                        </ol>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            onClick={handleRetry}
                            disabled={isRetrying}
                            className="flex items-center gap-2"
                        >
                            <RefreshCw className={`h-4 w-4 ${isRetrying ? "animate-spin" : ""}`} />
                            {isRetrying ? "Retrying..." : "Retry Connection"}
                        </Button>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-sm text-muted-foreground">
                        Need help? Check the{" "}
                        <a
                            href="https://github.com/supabase/supabase"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                        >
                            Supabase documentation
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
