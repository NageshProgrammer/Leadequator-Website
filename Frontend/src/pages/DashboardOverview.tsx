import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KPICard } from "@/components/dashboard/KPICard";
import {
  Activity,
  TrendingUp,
  Users,
  MessageSquare,
  ThumbsUp,
  AlertCircle,
} from "lucide-react";
import {
  PieChart, Pie, Cell,
  BarChart, Bar,
  XAxis, YAxis,
  CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from "recharts";
import { useLeads } from "@/hooks/useLeads";

const DashboardOverview = () => {
  const { leads } = useLeads();
  const [range] = useState("7d");

  const totalLeads = leads.length;
  const highIntent = leads.filter(l => l.intent >= 70).length;
  const replies = leads.filter(l => l.status !== "New").length;
  const clicks = totalLeads * 3;
  const converted = leads.filter(l => l.status === "Closed Won").length;
  const conversion = totalLeads > 0
    ? ((converted / totalLeads) * 100).toFixed(1) + "%"
    : "0%";

  const sentimentData = [
    { name: "Positive", value: highIntent, color: "#22c55e" },
    { name: "Neutral", value: totalLeads - highIntent, color: "#a1a1aa" },
    { name: "Negative", value: 0, color: "#ef4444" },
  ];

  const platformData = Object.values(
    leads.reduce((acc: any, l) => {
      if (!acc[l.platform])
        acc[l.platform] = { platform: l.platform, threads: 0 };
      acc[l.platform].threads += 1;
      return acc;
    }, {})
  );

  const kpiData = [
    { icon: MessageSquare, label: "New Comments", value: totalLeads.toString() },
    { icon: AlertCircle, label: "High-Intent (≥70)", value: highIntent.toString() },
    { icon: ThumbsUp, label: "Auto Replies Sent", value: replies.toString() },
    { icon: Users, label: "Link Clicks", value: clicks.toString() },
    { icon: TrendingUp, label: "Engage→Lead %", value: conversion },
    { icon: Activity, label: "Avg Reply Time", value: "—" },
  ];

  return (
    <div className="p-8 space-y-8 bg-background min-h-screen">
      <h1 className="text-3xl font-bold">Dashboard Overview</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpiData.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">Sentiment</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={sentimentData} dataKey="value" outerRadius={100}>
                {sentimentData.map((e, i) => (
                  <Cell key={i} fill={e.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">Platform Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={platformData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="platform" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="threads" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">Recent High-Intent Leads</h3>
        {leads.filter(l => l.intent >= 80).slice(0, 3).map(l => (
          <div key={l._id} className="flex justify-between p-3 border rounded mb-2">
            <div>
              <div className="font-semibold">{l.name}</div>
              <div className="text-xs text-muted-foreground">
                via {l.platform}
              </div>
            </div>
            <Badge>{l.intent}</Badge>
          </div>
        ))}
      </Card>
    </div>
  );
};

export default DashboardOverview;
