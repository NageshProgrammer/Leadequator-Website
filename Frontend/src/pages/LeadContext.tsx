import React, { createContext, useContext, useState, useCallback } from "react";
import { useUser } from "@clerk/clerk-react";

export type Thread = {
  id: string;
  platform: string;
  user: string;
  intent: number;
  sentiment: "Positive" | "Neutral" | "Negative";
  timestamp: string;
  post: string;
  engagement: { likes: number };
  replyStatus: "Not Sent" | "Sent";
  url: string;
  replyOption1?: string | null;
  replyOption2?: string | null;
};

interface LeadContextType {
  threads: Thread[];
  loading: boolean;
  refreshLeads: () => Promise<void>;
  setThreads: React.Dispatch<React.SetStateAction<Thread[]>>;
}

const LeadContext = createContext<LeadContextType | undefined>(undefined);

export const LeadProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoaded } = useUser();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshLeads = useCallback(async () => {
    if (!isLoaded || !user?.id) return;
    setLoading(true);
    try {
      const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/api/lead-discovery`;
      const [redditRes, quoraRes] = await Promise.all([
        fetch(`${API_BASE}/reddit/posts?userId=${encodeURIComponent(user.id)}`),
        fetch(`${API_BASE}/quora/posts?userId=${encodeURIComponent(user.id)}`),
      ]);

      const redditData = await redditRes.json();
      const quoraData = await quoraRes.json();
      const combined = [...(redditData.posts || []), ...(quoraData.posts || [])];

      const mapped: Thread[] = combined.map((p: any, idx: number) => ({
        id: String(p.id),
        platform: p.platform || "Quora",
        user: p.author ?? "Unknown",
        intent: p.intentScore ?? (50 + (idx % 40)),
        sentiment: p.intentScore >= 80 ? "Positive" : p.intentScore >= 60 ? "Neutral" : "Negative",
        timestamp: p.createdAt ? new Date(p.createdAt).toLocaleString() : "—",
        post: p.question || p.content || "",
        engagement: { likes: 0 },
        replyStatus: p.replyStatus || "Not Sent",
        url: p.url,
        replyOption1: p.replyOption1 || null,
        replyOption2: p.replyOption2 || null,
      }));

      setThreads(mapped);
    } catch (err) {
      console.error("Error refreshing leads:", err);
    } finally {
      setLoading(false);
    }
  }, [isLoaded, user?.id]);

  return (
    <LeadContext.Provider value={{ threads, loading, refreshLeads, setThreads }}>
      {children}
    </LeadContext.Provider>
  );
};

export const useLeads = () => {
  const context = useContext(LeadContext);
  if (!context) throw new Error("useLeads must be used within LeadProvider");
  return context;
};