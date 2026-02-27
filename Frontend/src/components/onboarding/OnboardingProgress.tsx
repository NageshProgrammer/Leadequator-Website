import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
}

const OnboardingProgress: React.FC<OnboardingProgressProps> = ({ currentStep, totalSteps }) => {
  const steps = [
    'Company Basics',
    'Industry & Offering',
    'Target Market',
    'Buyer Keywords',
    'Platforms',
  ];

  return (
    <div className="w-full max-w-3xl mx-auto mb-12 px-4">
      {/* Progress Bar */}
      <div className="relative mb-8 mt-4">
        {/* Background Track */}
        <div className="absolute top-1/2 left-0 w-full h-1.5 bg-white/[0.05] -translate-y-1/2 rounded-full" />
        
        {/* Active Track */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="absolute top-1/2 left-0 h-1.5 bg-gradient-to-r from-[#fbbf24]/50 to-[#fbbf24] -translate-y-1/2 rounded-full shadow-[0_0_10px_rgba(251,191,36,0.5)]"
        />
        
        {/* Step Indicators */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;
            
            return (
              <div key={index} className="flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: isCurrent ? 1.1 : 1 }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 z-10 ${
                    isCompleted
                      ? 'bg-[#fbbf24] text-black shadow-[0_0_15px_rgba(251,191,36,0.4)]'
                      : isCurrent
                      ? 'bg-[#fbbf24] text-black ring-4 ring-[#fbbf24]/20 shadow-[0_0_20px_rgba(251,191,36,0.5)]'
                      : 'bg-[#09090b] border-2 border-white/[0.1] text-zinc-500'
                  }`}
                >
                  {isCompleted ? <Check className="w-5 h-5 stroke-[3]" /> : stepNumber}
                </motion.div>
                <span className={`absolute top-12 text-[10px] sm:text-xs font-bold uppercase tracking-wider whitespace-nowrap hidden md:block transition-colors ${
                  isCurrent ? 'text-[#fbbf24]' : isCompleted ? 'text-zinc-300' : 'text-zinc-600'
                }`}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Step Counter (Mobile mainly) */}
      <div className="text-center md:hidden mt-6">
        <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
          Step <span className="text-[#fbbf24]">{currentStep}</span> of {totalSteps}
        </span>
      </div>
    </div>
  );
};

export default OnboardingProgress;