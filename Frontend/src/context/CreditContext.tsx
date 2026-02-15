import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/clerk-react";

// 🔧 API CONFIGURATION
const API_BASE = import.meta.env.MODE === "development" 
  ? "http://localhost:5000" 
  : "https://api.leadequator.live";

type CreditContextType = {
  credits: number;
  loading: boolean;
  refreshCredits: () => Promise<void>;
};

const CreditContext = createContext<CreditContextType | undefined>(undefined);

export const CreditProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoaded } = useUser();
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(true);

  const refreshCredits = useCallback(async () => {
    if (!isLoaded || !user) return;
    try {
      // 🛑 DEBUG LOG: Remove this after verifying it works in console
      console.log("🔄 Refreshing credits for:", user.id);

      // ✅ FIX: URL must match 'app.use("/api/lead-discovery", ...)' in server.ts
      // ✅ FIX: Added timestamp to prevent browser caching
      const res = await fetch(`${API_BASE}/api/lead-discovery/user/credits?userId=${user.id}&_t=${Date.now()}`);
      
      if (res.ok) {
        const data = await res.json();
        console.log("✅ Credits updated:", data.credits);
        setCredits(data.credits);
      } else {
        console.error("❌ Failed to fetch credits:", res.status);
      }
    } catch (error) {
      console.error("❌ Error fetching credits:", error);
    } finally {
      setLoading(false);
    }
  }, [isLoaded, user]);

  // Initial Load
  useEffect(() => {
    refreshCredits();
  }, [refreshCredits]);

  return (
    <CreditContext.Provider value={{ credits, loading, refreshCredits }}>
      {children}
    </CreditContext.Provider>
  );
};

export const useCredits = () => {
  const context = useContext(CreditContext);
  if (!context) {
    throw new Error("useCredits must be used within a CreditProvider");
  }
  return context;
};