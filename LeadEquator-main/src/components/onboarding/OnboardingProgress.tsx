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
    <div className="w-full max-w-3xl mx-auto mb-12">
      {/* Progress Bar */}
      <div className="relative mb-6">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-border -translate-y-1/2 rounded-full" />
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-primary to-primary-glow -translate-y-1/2 rounded-full"
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
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    isCompleted
                      ? 'bg-primary text-primary-foreground'
                      : isCurrent
                      ? 'bg-gradient-to-r from-primary to-primary-glow text-primary-foreground shadow-lg shadow-primary/30'
                      : 'bg-card border-2 border-border text-muted-foreground'
                  }`}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : stepNumber}
                </motion.div>
                <span className={`mt-2 text-xs font-medium hidden md:block ${
                  isCurrent ? 'text-primary' : isCompleted ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Step Counter */}
      <div className="text-center">
        <span className="text-sm text-muted-foreground">
          Step <span className="text-primary font-semibold">{currentStep}</span> of {totalSteps}
        </span>
      </div>
    </div>
  );
};

export default OnboardingProgress;
