// @/context/CreditContext.tsx (Update your existing context)
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/clerk-react";

type CreditContextType = {
  credits: number;
  loading: boolean;
  refreshCredits: () => Promise<void>; // Add this function
};

const CreditContext = createContext<CreditContextType | undefined>(undefined);

export const CreditProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoaded } = useUser();
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(true);

  // Expose a way to manually trigger a fetch
  const refreshCredits = useCallback(async () => {
    if (!user?.id) return;
    try {
      // Replace with your actual backend endpoint for fetching credits
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user-data?userId=${user.id}`);
      const data = await res.json();
      if (data.success) {
        setCredits(data.credits);
      }
    } catch (err) {
      console.error("Failed to fetch credits", err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (isLoaded) {
      refreshCredits();
    }
  }, [isLoaded, refreshCredits]);

  return (
    <CreditContext.Provider value={{ credits, loading, refreshCredits }}>
      {children}
    </CreditContext.Provider>
  );
};

export const useCredits = () => {
  const context = useContext(CreditContext);
  if (!context) throw new Error("useCredits must be used within a CreditProvider");
  return context;
};