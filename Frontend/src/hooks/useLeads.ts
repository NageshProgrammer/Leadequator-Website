// src/hooks/useLeads.ts
import { useEffect, useState, useCallback } from "react";
import { useUser } from "@clerk/clerk-react";

export type Lead = {
  _id: string;
  name: string;
  platform: string;
  intent: number;
  status: string;
  value: number;
  createdAt: string;
};

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/api/lead-discovery`;

export const useLeads = () => {
  const { user, isLoaded } = useUser();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  const loadLeads = useCallback(async () => {
    if (!isLoaded || !user?.id) return;

    try {
      setLoading(true);

      const [redditRes, quoraRes] = await Promise.all([
        fetch(`${API_BASE}/reddit/posts?userId=${encodeURIComponent(user.id)}`),
        fetch(`${API_BASE}/quora/posts?userId=${encodeURIComponent(user.id)}`),
      ]);

      if (!redditRes.ok || !quoraRes.ok) {
        throw new Error("Failed to fetch leads");
      }

      const redditData = await redditRes.json();
      const quoraData = await quoraRes.json();

      const combined = [
        ...(redditData.posts || []),
        ...(quoraData.posts || []),
      ];

      const mapped: Lead[] = combined.map((p: any, index: number) => ({
        _id: String(p.id || index),
        name: p.author || "Unknown",
        platform: p.platform || "Quora",
        intent: p.intentScore ?? 50,
        status: p.replyStatus || "New",
        value: 0,
        createdAt: p.createdAt || new Date().toISOString(),
      }));

      setLeads(mapped);
    } catch (err) {
      console.error("Error loading leads:", err);
    } finally {
      setLoading(false);
    }
  }, [isLoaded, user?.id]);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  return { leads, loading, refresh: loadLeads };
};
