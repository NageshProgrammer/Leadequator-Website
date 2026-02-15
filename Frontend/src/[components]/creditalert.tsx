import React from 'react';
// If you don't have lucide-react, you can use any warning icon SVG
import { AlertTriangle, Zap } from 'lucide-react'; 

const CreditAlert = () => {
  return (
    // Container: Matches your dark theme with a subtle gold background tint
    <div className="mb-8 w-full rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-4 shadow-sm backdrop-blur-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        
        {/* Left Side: Icon & Text */}
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-yellow-500/20 text-yellow-500">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">
              Credits Running Low
            </h3>
            <p className="text-sm text-gray-400">
              You have <span className="font-medium text-yellow-500">15 credits</span> remaining. 
              Your campaigns may pause soon.
            </p>
          </div>
        </div>

        {/* Right Side: Action Button */}
        <button className="group flex shrink-0 items-center justify-center gap-2 rounded-lg bg-yellow-500 px-5 py-2.5 text-sm font-bold text-black transition-all hover:bg-yellow-400 active:scale-95">
          <Zap size={16} className="fill-black" />
          <span>Upgrade Plan</span>
        </button>
        
      </div>
    </div>
  );
};

export default CreditAlert;