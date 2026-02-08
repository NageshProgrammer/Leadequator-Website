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
    switch (trend) {
      case "up":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "down":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground border-transparent";
    }
  };

  return (
    <Card className="p-4 md:p-6 bg-card border-border hover:shadow-md md:hover:shadow-lg transition-all flex flex-col justify-between">
      {/* Top Row: Icon and Badge */}
      <div className="flex items-start justify-between mb-3 md:mb-4">
        <div className="p-2 bg-primary/5 rounded-lg">
          <Icon className="w-5 h-5 md:w-8 md:h-8 text-primary" />
        </div>
        
        {change && (
          <Badge 
            variant="outline" 
            className={`text-[10px] md:text-xs font-semibold px-1.5 py-0 md:px-2.5 md:py-0.5 ${getTrendColor()}`}
          >
            {change}
          </Badge>
        )}
      </div>

      {/* Bottom Content */}
      <div className="space-y-0.5 md:space-y-1">
        <div className="text-xl md:text-3xl font-bold tracking-tight truncate">
          {value}
        </div>
        <div className="text-xs md:text-sm text-muted-foreground font-medium truncate uppercase tracking-wide">
          {label}
        </div>
      </div>
    </Card>
  );
};