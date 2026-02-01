import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquare, X, Plus, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';

interface StepKeywordsProps {
  data: {
    keywords: string[];
  };
  onChange: (field: string, value: string[]) => void;
  onNext: () => void;
  onBack: () => void;
  industry: string;
}

const suggestedKeywordsByIndustry: Record<string, string[]> = {
  saas: ['Looking for software', 'Best SaaS for', 'Need a tool for', 'Any recommendations for software', 'Struggling with automation'],
  agency: ['Looking for an agency', 'Need help with branding', 'Any recommendations for marketing', 'Who can help with design', 'Best agency for'],
  real_estate: ['Looking for a realtor', 'Need help selling house', 'Best real estate agent', 'Property recommendations', 'Investment property advice'],
  ecommerce: ['Looking for products like', 'Where to buy', 'Best online store for', 'Any recommendations for', 'Need to find'],
  healthcare: ['Looking for a doctor', 'Need medical advice', 'Best clinic for', 'Any recommendations for treatment', 'Health services near'],
  education: ['Looking for courses', 'Best online learning', 'Need tutoring for', 'Recommendations for training', 'Want to learn'],
  local_business: ['Looking for services', 'Best local', 'Need help with', 'Any recommendations near', 'Who provides'],
  other: ['Looking for', 'Need help with', 'Any recommendations for', 'Best solution for', 'Struggling with'],
};

const StepKeywords: React.FC<StepKeywordsProps> = ({ data, onChange, onNext, onBack, industry }) => {
  const [inputValue, setInputValue] = useState('');
  const suggestions = suggestedKeywordsByIndustry[industry] || suggestedKeywordsByIndustry.other;

  const addKeyword = (keyword: string) => {
    const trimmed = keyword.trim();
    if (trimmed && !data.keywords.includes(trimmed)) {
      onChange('keywords', [...data.keywords, trimmed]);
    }
    setInputValue('');
  };

  const removeKeyword = (index: number) => {
    onChange('keywords', data.keywords.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addKeyword(inputValue);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (data.keywords.length >= 3) {
      onNext();
    }
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
          <MessageSquare className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          How do your buyers talk?
        </h2>
        <p className="text-muted-foreground">
          These keywords help Leadequator detect real buying conversations.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Added Keywords */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            Keywords / Phrases buyers use <span className="text-primary">({data.keywords.length}/3 minimum)</span>
          </label>
          
          <div className="min-h-[100px] p-4 bg-card border border-border rounded-xl mb-4">
            <AnimatePresence mode="popLayout">
              {data.keywords.length === 0 ? (
                <p className="text-muted-foreground text-sm">Add at least 3 keywords...</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {data.keywords.map((keyword, index) => (
                    <motion.div
                      key={keyword}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      layout
                      className="flex items-center gap-2 px-3 py-1.5 bg-primary/20 border border-primary/30 rounded-full"
                    >
                      <span className="text-sm text-foreground">{keyword}</span>
                      <button
                        type="button"
                        onClick={() => removeKeyword(index)}
                        className="w-4 h-4 rounded-full bg-primary/30 hover:bg-primary/50 flex items-center justify-center transition-colors"
                      >
                        <X className="w-3 h-3 text-foreground" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <Input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a keyword and press Enter..."
              className="flex-1 bg-card border-border focus:border-primary"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => addKeyword(inputValue)}
              disabled={!inputValue.trim()}
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Suggested Keywords */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Suggested for your industry</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => addKeyword(suggestion)}
                disabled={data.keywords.includes(suggestion)}
                className={`px-3 py-1.5 text-sm rounded-full border transition-all duration-200 ${
                  data.keywords.includes(suggestion)
                    ? 'border-primary/30 bg-primary/10 text-muted-foreground cursor-not-allowed'
                    : 'border-border bg-card hover:border-primary hover:bg-primary/10 text-foreground'
                }`}
              >
                + {suggestion}
              </button>
            ))}
          </div>
        </div>

        <p className="text-sm text-muted-foreground text-center">
          These answers help us find buyers faster.
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
            disabled={data.keywords.length < 3}
          >
            Next
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default StepKeywords;
