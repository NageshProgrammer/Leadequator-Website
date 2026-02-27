import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Briefcase, ArrowRight, ArrowLeft } from 'lucide-react';

interface StepIndustryProps {
  data: {
    industry: string;
    industryOther: string;
    productDescription: string;
  };
  onChange: (field: string, value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const industries = [
  { value: 'saas', label: 'SaaS' },
  { value: 'agency', label: 'Agency' },
  { value: 'real_estate', label: 'Real Estate' },
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'education', label: 'Education' },
  { value: 'local_business', label: 'Local Business' },
  { value: 'other', label: 'Other' },
];

const StepIndustry: React.FC<StepIndustryProps> = ({ data, onChange, onNext, onBack }) => {
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
          <Briefcase className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          What do you offer?
        </h2>
        <p className="text-muted-foreground">
          Help us understand your product or service
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-7 bg-background/20 backdrop-blur-xl border border-white/[0.05] p-6 sm:p-8 rounded-[2rem] shadow-2xl">
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            Industry
          </label>
          <div className="grid grid-cols-2 gap-3">
            {industries.map((industry) => (
              <button
                key={industry.value}
                type="button"
                onClick={() => onChange('industry', industry.value)}
                className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                  data.industry === industry.value
                    ? 'border-primary bg-primary/10 text-foreground'
                    : 'border-border bg-card hover:border-primary/50 text-muted-foreground hover:text-foreground'
                }`}
              >
                <span className="font-medium">{industry.label}</span>
              </button>
            ))}
          </div>
        </div>

        {data.industry === 'other' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <label className="block text-sm font-medium text-foreground mb-2">
              Please specify your industry
            </label>
            <Input
              type="text"
              value={data.industryOther}
              onChange={(e) => onChange('industryOther', e.target.value)}
              placeholder="e.g., Fintech, Legal Services..."
              required
              className="bg-card border-border focus:border-primary"
            />
          </motion.div>
        )}

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Product / Service Description
          </label>
          <Textarea
            value={data.productDescription}
            onChange={(e) => onChange('productDescription', e.target.value)}
            placeholder="Briefly describe what you sell and who it's for..."
            rows={4}
            className="bg-card border-border focus:border-primary resize-none"
          />
          <p className="text-xs text-muted-foreground mt-2">
            The better your inputs, the smarter Leadequator becomes.
          </p>
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

export default StepIndustry;
