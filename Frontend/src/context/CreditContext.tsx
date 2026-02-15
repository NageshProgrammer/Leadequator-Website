import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/clerk-react";

// API Config
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
      // Intentionally don't set loading=true here to avoid UI flickering during background refreshes
      const res = await fetch(`${API_BASE}/api/lead-discovery/user/credits?userId=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setCredits(data.credits);
      }
    } catch (error) {
      console.error("Failed to refresh credits:", error);
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