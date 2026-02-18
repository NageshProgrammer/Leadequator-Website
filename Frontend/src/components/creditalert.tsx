import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Zap, Loader2 } from 'lucide-react'; 

// 👇 Import the hook to fetch DB credits directly
import { useCredits } from "@/context/CreditContext";

const CreditAlert = () => {
  // 1. Get real-time credits from your database context
  const { credits, loading } = useCredits();

  // OPTIONAL: Hide the alert if credits are healthy (e.g., > 50)
  // If you want the alert to always show, remove this if-block.
  if (!loading && credits > 50) {
    return null; 
  }

  return (
    // Container: Matches your dark theme with a subtle gold/red background tint
    <div className="mb-8 w-full rounded-xl border border-red-500/20 bg-red-500/10 p-4 shadow-sm backdrop-blur-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        
        {/* Left Side: Icon & Text */}
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-yellow-500/20 text-yellow-500">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">
              {credits === 0 ? "Out of Credits" : "Credits Running Low"}
            </h3>
            <p className="text-sm text-gray-400">
              You have{' '}
              <span className={`font-medium ${credits === 0 ? 'text-red-500' : 'text-yellow-500'}`}>
                {loading ? (
                  <Loader2 className="inline h-3 w-3 animate-spin" />
                ) : (
                  credits
                )} credits
              </span>{' '}
              remaining.Your {credits === 0 ? "credits are exhausted." : "credits may exhaust soon."}
            </p>
          </div>
        </div>

        {/* Right Side: Action Button */}
        <Link to="/pricings">
          <button className="group flex shrink-0 items-center justify-center gap-2 rounded-lg bg-red-500 px-5 py-2.5 text-sm font-bold text-black transition-all hover:bg-red-500/85 active:scale-95">
            <Zap size={16} className="fill-black" />
            <span>Upgrade Plan</span>
          </button>
        </Link>
        
      </div>
    </div>
  );
};

export default CreditAlert;