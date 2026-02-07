import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Rocket, Check } from 'lucide-react';

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

// Full SVG set for official brand consistency
const platforms = [
  { 
    key: 'linkedin', 
    name: 'LinkedIn', 
    color: '#0A66C2',
    icon: (
      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
      </svg>
    ), 
    description: 'Professional networking' 
  },
  { 
    key: 'twitter', 
    name: 'X (Twitter)', 
    color: '#FFFFFF',
    icon: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
      </svg>
    ), 
    description: 'Real-time conversations' 
  },
  { 
    key: 'reddit', 
    name: 'Reddit', 
    color: '#FF4500',
    icon: (
      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.056 1.597.04.282.063.568.063.856 0 2.211-2.729 4.003-6.107 4.003s-6.107-1.792-6.107-4.003c0-.288.022-.574.063-.856a1.754 1.754 0 0 1-1.064-1.597c0-.968.786-1.754 1.754-1.754.463 0 .875.18 1.179.466 1.187-.822 2.812-1.373 4.603-1.463l.812-3.812a.375.375 0 0 1 .324-.294l2.844.6z"/>
      </svg>
    ), 
    description: 'Community discussions' 
  },
  { 
    key: 'facebook', 
    name: 'Facebook', 
    color: '#1877F2',
    icon: (
      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ), 
    description: 'Public pages & groups' 
  },
  { 
    key: 'quora', 
    name: 'Quora', 
    color: '#B92B27',
    icon: (
      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
        <path d="M12.44 2.1c-5.74 0-10.39 4.2-10.39 9.38 0 5.17 4.65 9.37 10.39 9.37 1.08 0 2.13-.15 3.11-.42l3.43 3.41V20.2c2.4-1.81 3.86-4.5 3.86-7.46.01-5.18-4.66-9.24-10.4-9.24zm0 16.51c-4.43 0-8.02-3.21-8.02-7.14 0-3.92 3.59-7.13 8.02-7.13s8.02 3.21 8.02 7.13c0 3.93-3.59 7.14-8.02 7.14z"/>
      </svg>
    ), 
    description: 'Q&A platform' 
  },
  { 
    key: 'youtube', 
    name: 'YouTube', 
    color: '#FF0000',
    icon: (
      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ), 
    description: 'Video comments' 
  },
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
      className="max-w-xl mx-auto px-4"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-2xl flex items-center justify-center">
          <Rocket className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Where should we find your buyers?
        </h2>
        <p className="text-muted-foreground">
          Select the platforms where your audience is most active
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                className={`relative group p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                  isSelected
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-border bg-card hover:border-muted-foreground/30'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Icon Container */}
                  <div 
                    className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
                    style={{ 
                        color: isSelected ? platform.color : '#64748b',
                        backgroundColor: isSelected ? `${platform.color}15` : 'transparent' 
                    }}
                  >
                    {platform.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className={`block font-semibold truncate ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                      {platform.name}
                    </span>
                    <span className="text-xs text-muted-foreground line-clamp-1">{platform.description}</span>
                  </div>
                </div>

                {/* Selection Indicator */}
                <div className={`absolute top-2 right-2 w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                  isSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-transparent'
                }`}>
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </motion.button>
            );
          })}
        </div>

        <div className="space-y-4 pt-2">
          <p className="text-sm text-muted-foreground text-center">
            {selectedCount === 0 
              ? 'Select at least one platform to continue'
              : `${selectedCount} platform${selectedCount > 1 ? 's' : ''} selected`
            }
          </p>

          <div className="flex gap-4">
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
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Processing...
                </span>
              ) : (
                <>
                  Finish Setup
                  <Rocket className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default StepPlatforms;