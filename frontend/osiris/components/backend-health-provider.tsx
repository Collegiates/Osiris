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

const DEV_MODE = process.env.NEXT_PUBLIC_DEV_MODE === "true";

export function BackendHealthProvider({ children }: { children: React.ReactNode }) {
    // In dev mode, skip all polling and report online immediately.
    // To restore real health checks: set NEXT_PUBLIC_DEV_MODE=false in .env.local.
    const [status, setStatus] = useState<BackendStatus>(DEV_MODE ? "online" : "checking");
    const [lastChecked, setLastChecked] = useState<Date | null>(DEV_MODE ? new Date() : null);

    useEffect(() => {
        if (DEV_MODE) return; // ← skip polling in dev/demo mode

        const checkHealth = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 3000);

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

        checkHealth();
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
