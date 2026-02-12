"use client";

import { useEffect, useState } from "react";
import { useBackendHealth } from "./backend-health-provider";

export function BackendStatusToast() {
    const { status } = useBackendHealth();
    const [show, setShow] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);

    useEffect(() => {
        if (status === "offline" && !isDismissed) {
            setShow(true);
        } else if (status === "online") {
            setShow(false);
            setIsDismissed(false); // Reset dismissal when backend comes back online
        }
    }, [status, isDismissed]);

    if (!show) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-slide-up">
            <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 shadow-lg dark:border-orange-900 dark:bg-orange-950">
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                        <svg
                            className="h-5 w-5 text-orange-600 dark:text-orange-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-sm font-semibold text-orange-800 dark:text-orange-200">
                            Backend Unavailable
                        </h3>
                        <p className="mt-1 text-sm text-orange-700 dark:text-orange-300">
                            The backend server is not responding. Some features may be unavailable.
                        </p>
                    </div>
                    <button
                        onClick={() => setIsDismissed(true)}
                        className="flex-shrink-0 rounded-md text-orange-600 hover:text-orange-800 dark:text-orange-400 dark:hover:text-orange-200"
                        aria-label="Dismiss"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
