import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquare, X, Plus, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';

interface StepKeywordsProps {
  data: { keywords: string[] };
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
    if (data.keywords.length >= 3) onNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4 }}
      className="max-w-lg mx-auto w-full px-4"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-[#fbbf24]/10 border border-[#fbbf24]/20 rounded-2xl flex items-center justify-center shadow-[inset_0_1px_0_0_rgba(251,191,36,0.2)]">
          <MessageSquare className="w-8 h-8 text-[#fbbf24]" />
        </div>
        <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">
          How do your buyers talk?
        </h2>
        <p className="text-zinc-400 font-medium">
          These keywords help Leadequator detect real buying conversations.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-background/20 backdrop-blur-xl border border-white/[0.05] p-6 sm:p-8 rounded-[2rem] shadow-2xl">
        
        <div>
          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3 ml-1">
            Keywords / Phrases <span className={data.keywords.length >= 3 ? "text-green-400" : "text-[#fbbf24]"}>({data.keywords.length}/3 minimum)</span>
          </label>
          
          {/* Tag Container */}
          <div className="min-h-[120px] p-4 bg-black/40 border border-white/[0.05] rounded-xl mb-4 shadow-inner">
            <AnimatePresence mode="popLayout">
              {data.keywords.length === 0 ? (
                <p className="text-zinc-600 text-sm italic font-medium pt-2">Type a phrase below and press enter, or click a suggestion.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {data.keywords.map((keyword, index) => (
                    <motion.div
                      key={keyword}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      layout
                      className="flex items-center gap-2 px-3 py-1.5 bg-[#fbbf24]/10 border border-[#fbbf24]/20 rounded-lg text-[#fbbf24] shadow-sm"
                    >
                      <span className="text-sm font-bold">{keyword}</span>
                      <button
                        type="button"
                        onClick={() => removeKeyword(index)}
                        className="w-5 h-5 rounded-md hover:bg-red-500/20 text-[#fbbf24] hover:text-red-400 flex items-center justify-center transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
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
              placeholder="e.g. 'Looking for a marketing tool...'"
              className="flex-1 bg-white/[0.02] border-white/[0.08] text-white focus-visible:ring-[#fbbf24]/30 focus-visible:border-[#fbbf24]/50 rounded-xl h-12"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => addKeyword(inputValue)}
              disabled={!inputValue.trim()}
              className="h-12 px-4 rounded-xl bg-white/[0.05] border-white/[0.1] text-white hover:bg-white/[0.1] hover:text-[#fbbf24]"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Suggested Keywords */}
        <div className="pt-2 border-t border-white/[0.05]">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-[#fbbf24]" />
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Suggested for you</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion) => {
              const isSelected = data.keywords.includes(suggestion);
              return (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => addKeyword(suggestion)}
                  disabled={isSelected}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all duration-200 ${
                    isSelected
                      ? 'border-white/[0.02] bg-white/[0.01] text-zinc-600 cursor-not-allowed'
                      : 'border-white/[0.08] bg-white/[0.02] hover:border-[#fbbf24]/50 hover:bg-[#fbbf24]/10 hover:text-[#fbbf24] text-zinc-400'
                  }`}
                >
                  + {suggestion}
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex gap-4 pt-4 mt-8">
          <Button type="button" variant="outline" size="lg" className="flex-1 h-12 rounded-xl border-white/[0.1] bg-transparent text-white hover:bg-[#fbbf24]" onClick={onBack}>
            <ArrowLeft className="w-5 h-5 mr-2" /> Back
          </Button>
          <Button
            type="submit"
            variant="default"
            size="lg"
            className="flex-1 h-12 rounded-xl bg-[#fbbf24] text-black hover:bg-[#fbbf24]/90 font-bold shadow-[0_0_15px_rgba(251,191,36,0.2)] disabled:opacity-50"
            disabled={data.keywords.length < 3}
          >
            Next <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default StepKeywords;