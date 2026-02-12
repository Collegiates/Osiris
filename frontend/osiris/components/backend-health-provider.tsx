"use client";

import { createContext, useContext, useEffect, useState } from "react";

type BackendStatus = "online" | "offline" | "checking";

interface BackendHealthContextType {
    status: BackendStatus;
    lastChecked: Date | null;
}

const BackendHealthContext = createContext<BackendHealthContextType>({
    status: "checking",
    lastChecked: null,
});

export function BackendHealthProvider({ children }: { children: React.ReactNode }) {
    const [status, setStatus] = useState<BackendStatus>("checking");
    const [lastChecked, setLastChecked] = useState<Date | null>(null);

    useEffect(() => {
        const checkHealth = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

                const response = await fetch(`${apiUrl}/health`, {
                    signal: controller.signal,
                    cache: "no-store",
                });

                clearTimeout(timeoutId);

                if (response.ok) {
                    setStatus("online");
                } else {
                    setStatus("offline");
                }
            } catch (error) {
                setStatus("offline");
            } finally {
                setLastChecked(new Date());
            }
        };

        // Check immediately on mount
        checkHealth();

        // Then check every 30 seconds
        const interval = setInterval(checkHealth, 30000);

        return () => clearInterval(interval);
    }, []);

    return (
        <BackendHealthContext.Provider value={{ status, lastChecked }}>
            {children}
        </BackendHealthContext.Provider>
    );
}

export function useBackendHealth() {
    return useContext(BackendHealthContext);
}
