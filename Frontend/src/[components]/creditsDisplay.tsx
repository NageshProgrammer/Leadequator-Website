// @/components/dashboard/CreditDisplay.tsx
import { useState, useEffect } from "react";
import { Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useCredits } from "@/context/CreditContext";

interface CreditDisplayProps {
  sidebarOpen: boolean;
}

export const CreditDisplay = ({ sidebarOpen }: CreditDisplayProps) => {
  const { credits, loading } = useCredits();
  const [isAnimating, setIsAnimating] = useState(false);

  const TOTAL_PLAN_CREDITS = 300;
  const remainingPercentage = (credits / TOTAL_PLAN_CREDITS) * 100;
  const usedPercentage = 100 - remainingPercentage;

  // Trigger animation when credits change
  useEffect(() => {
    if (!loading) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 500); // 500ms pulse
      return () => clearTimeout(timer);
    }
  }, [credits, loading]);

  const getStatusColor = () => {
    if (remainingPercentage <= 20) return "text-red-500";
    if (remainingPercentage <= 50) return "text-[#fbbf24]";
    return "text-green-500";
  };

  const getBarColor = () => {
    if (remainingPercentage <= 20) return "bg-red-500";
    if (remainingPercentage <= 50) return "bg-[#fbbf24]";
    return "bg-green-500";
  };

  return (
    <div className={`w-full flex flex-col items-center ${sidebarOpen ? "px-1" : ""}`}>
      {sidebarOpen ? (
        <div className="w-full space-y-2.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-zinc-400 font-medium flex items-center gap-1.5">
              <Zap className={`h-3.5 w-3.5 fill-current ${getStatusColor()}`} /> Credits
            </span>
            <span
              className={`font-bold transition-all duration-300 ${
                isAnimating 
                  ? "scale-125 text-white drop-shadow-[0_0_12px_#fbbf24]" 
                  : `${getStatusColor()} drop-shadow-md`
              }`}
            >
              {loading ? "..." : Math.round(remainingPercentage)}%
            </span>
          </div>
          <Progress
            value={loading ? 0 : usedPercentage}
            className={`h-2 bg-white/[0.05] border border-white/[0.02] [&>div]:transition-all [&>div]:duration-1000 [&>div]:${getBarColor()} [&>div]:shadow-[0_0_10px_currentColor]`}
          />
          <div className="text-[10px] text-zinc-500 font-medium text-right tracking-wide flex justify-end gap-1">
            <span className={`transition-all duration-300 ${isAnimating ? "text-[#fbbf24]" : ""}`}>
              {credits}
            </span> 
            / {TOTAL_PLAN_CREDITS} remaining
          </div>
        </div>
      ) : (
        <div className="relative h-11 w-11 flex items-center justify-center">
          <svg className="h-full w-full transform -rotate-90">
            <circle
              cx="22" cy="22" r="18"
              stroke="currentColor" strokeWidth="3" fill="transparent"
              className="text-white/[0.05]"
            />
            <circle
              cx="22" cy="22" r="18"
              stroke="currentColor" strokeWidth="3" fill="transparent"
              strokeDasharray={113}
              strokeDashoffset={113 - ((loading ? 0 : remainingPercentage) / 100) * 113}
              strokeLinecap="round"
              className={`transition-all duration-1000 ${getStatusColor()}`}
            />
          </svg>
          <Zap
            className={`absolute h-3.5 w-3.5 fill-current transition-all duration-300 ${
              isAnimating ? "scale-150 text-white drop-shadow-[0_0_10px_#fbbf24]" : getStatusColor()
            }`}
          />
        </div>
      )}
    </div>
  );
};