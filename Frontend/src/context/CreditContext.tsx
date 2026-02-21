import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/clerk-react";

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
    if (!user?.id) return;
    try {
      // 👇 Matches your backend leadequator.ts route exactly
      const url = `${import.meta.env.VITE_API_BASE_URL}/api/lead-discovery/user/credits?userId=${user.id}`;
      const res = await fetch(url);

      // Prevent crashes if the server returns a 404/500 HTML page
      if (!res.ok) {
        throw new Error(`Server returned status: ${res.status}`);
      }

      const contentType = res.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await res.json();
        if (data.success) {
          setCredits(data.credits);
        }
      } else {
        throw new Error("Received non-JSON response from server");
      }
    } catch (err) {
      console.error("Failed to fetch credits:", err);
      // Fallback gracefully instead of crashing
      setCredits(0);
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