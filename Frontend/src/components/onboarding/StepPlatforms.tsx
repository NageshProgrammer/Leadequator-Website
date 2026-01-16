import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Rocket } from 'lucide-react';

interface StepPlatformsProps {
  data: {
    linkedin: boolean;
    twitter: boolean;
    reddit: boolean;
    facebook: boolean;
    quora: boolean;
    youtube: boolean;
  };
  onChange: (field: string, value: boolean) => void;
  onNext: () => void;
  onBack: () => void;
  loading: boolean;
}

const platforms = [
  { key: 'linkedin', name: 'LinkedIn', icon: '💼', description: 'Professional networking' },
  { key: 'twitter', name: 'X (Twitter)', icon: '𝕏', description: 'Real-time conversations' },
  { key: 'reddit', name: 'Reddit', icon: '🔴', description: 'Community discussions' },
  { key: 'facebook', name: 'Facebook', icon: '📘', description: 'Public pages & groups' },
  { key: 'quora', name: 'Quora', icon: '❓', description: 'Q&A platform' },
  { key: 'youtube', name: 'YouTube', icon: '▶️', description: 'Video comments' },
];

const StepPlatforms: React.FC<StepPlatformsProps> = ({ data, onChange, onNext, onBack, loading }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const selectedCount = Object.values(data).filter(Boolean).length;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4 }}
      className="max-w-lg mx-auto"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-primary/20 rounded-2xl flex items-center justify-center">
          <Rocket className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Where should we find your buyers?
        </h2>
        <p className="text-muted-foreground">
          Select the platforms where your audience is most active
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {platforms.map((platform, index) => {
            const isSelected = data[platform.key as keyof typeof data];
            return (
              <motion.button
                key={platform.key}
                type="button"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onChange(platform.key, !isSelected)}
                className={`p-5 rounded-xl border-2 text-left transition-all duration-200 ${
                  isSelected
                    ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10'
                    : 'border-border bg-card hover:border-primary/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{platform.icon}</span>
                  <div>
                    <span className={`block font-semibold ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                      {platform.name}
                    </span>
                    <span className="text-xs text-muted-foreground">{platform.description}</span>
                  </div>
                </div>
                {/* Checkbox indicator */}
                <div className={`absolute top-3 right-3 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  isSelected ? 'border-primary bg-primary' : 'border-border'
                }`}>
                  {isSelected && (
                    <motion.svg
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-3 h-3 text-primary-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </motion.svg>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        <p className="text-sm text-muted-foreground text-center pt-4">
          {selectedCount === 0 
            ? 'Select at least one platform to continue'
            : `${selectedCount} platform${selectedCount > 1 ? 's' : ''} selected`
          }
        </p>

        <div className="flex gap-4 mt-8">
          <Button type="button" variant="outline" size="lg" className="flex-1" onClick={onBack}>
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <Button
            type="submit"
            variant="default"
            size="lg"
            className="flex-1"
            disabled={selectedCount === 0 || loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Rocket className="w-5 h-5 animate-pulse" />
                Setting up...
              </span>
            ) : (
              <>
                Finish Setup
                <Rocket className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default StepPlatforms;
