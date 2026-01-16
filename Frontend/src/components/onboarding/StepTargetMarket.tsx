import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Target, MapPin, Users, ArrowRight, ArrowLeft } from 'lucide-react';

interface StepTargetMarketProps {
  data: {
    targetAudience: string;
    targetCountry: string;
    targetStateCity: string;
    businessType: string;
  };
  onChange: (field: string, value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const businessTypes = [
  { value: 'b2b', label: 'B2B', description: 'Business to Business' },
  { value: 'b2c', label: 'B2C', description: 'Business to Consumer' },
  { value: 'both', label: 'Both', description: 'B2B & B2C' },
];

const StepTargetMarket: React.FC<StepTargetMarketProps> = ({ data, onChange, onNext, onBack }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

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
          <Target className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Who do you want to reach?
        </h2>
        <p className="text-muted-foreground">
          Define your ideal customer profile
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Target Audience
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              value={data.targetAudience}
              onChange={(e) => onChange('targetAudience', e.target.value)}
              placeholder="e.g., Founders, CMOs, Restaurant owners, Coaches..."
              required
              className="pl-10 bg-card border-border focus:border-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Country
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                value={data.targetCountry}
                onChange={(e) => onChange('targetCountry', e.target.value)}
                placeholder="United States"
                required
                className="pl-10 bg-card border-border focus:border-primary"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              State / City <span className="text-muted-foreground text-xs">(optional)</span>
            </label>
            <Input
              type="text"
              value={data.targetStateCity}
              onChange={(e) => onChange('targetStateCity', e.target.value)}
              placeholder="California, NYC..."
              className="bg-card border-border focus:border-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            Business Type
          </label>
          <div className="grid grid-cols-3 gap-3">
            {businessTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => onChange('businessType', type.value)}
                className={`p-4 rounded-xl border-2 text-center transition-all duration-200 ${
                  data.businessType === type.value
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-card hover:border-primary/50'
                }`}
              >
                <span className={`block font-bold text-lg ${
                  data.businessType === type.value ? 'text-primary' : 'text-foreground'
                }`}>
                  {type.label}
                </span>
                <span className="text-xs text-muted-foreground">{type.description}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <Button type="button" variant="outline" size="lg" className="flex-1" onClick={onBack}>
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <Button type="submit" variant="default" size="lg" className="flex-1">
            Next
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default StepTargetMarket;
