import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface KPICardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
}

export const KPICard = ({ icon: Icon, label, value, change, trend = "neutral" }: KPICardProps) => {
  const getTrendColor = () => {
    if (trend === "up") return "bg-green-500/20 text-green-500";
    if (trend === "down") return "bg-destructive/20 text-destructive";
    return "bg-muted text-muted-foreground";
  };

  return (
    <Card className="p-6 bg-card border-border hover:shadow-lg transition-all">
      <div className="flex items-start justify-between mb-4">
        <Icon className="w-8 h-8 text-primary" />
        {change && (
          <Badge variant="secondary" className={getTrendColor()}>
            {change}
          </Badge>
        )}
      </div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </Card>
  );
};
