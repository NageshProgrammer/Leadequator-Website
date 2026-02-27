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

const inputStyle = "pl-11 bg-white/[0.02] border-white/[0.08] text-white focus-visible:ring-[#fbbf24]/30 focus-visible:border-[#fbbf24]/50 rounded-xl h-12 transition-all placeholder:text-zinc-600";
const labelStyle = "block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2 ml-1";

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
      className="max-w-lg mx-auto w-full px-4"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-[#fbbf24]/10 border border-[#fbbf24]/20 rounded-2xl flex items-center justify-center shadow-[inset_0_1px_0_0_rgba(251,191,36,0.2)]">
          <Target className="w-8 h-8 text-[#fbbf24]" />
        </div>
        <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">
          Who do you want to reach?
        </h2>
        <p className="text-zinc-400 font-medium">
          Define your ideal customer profile
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-backgroung/20 backdrop-blur-xl border border-white/[0.05] p-6 sm:p-8 rounded-[2rem] shadow-2xl">
        <div>
          <label className={labelStyle}>Target Audience</label>
          <div className="relative">
            <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input
              type="text"
              value={data.targetAudience}
              onChange={(e) => onChange('targetAudience', e.target.value)}
              placeholder="e.g., Founders, CMOs, Coaches..."
              required
              className={inputStyle}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className={labelStyle}>Country</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input
                type="text"
                value={data.targetCountry}
                onChange={(e) => onChange('targetCountry', e.target.value)}
                placeholder="United States"
                required
                className={inputStyle}
              />
            </div>
          </div>
          <div>
            <label className={labelStyle}>
              State / City <span className="text-zinc-600 normal-case font-medium ml-1">(opt.)</span>
            </label>
            <Input
              type="text"
              value={data.targetStateCity}
              onChange={(e) => onChange('targetStateCity', e.target.value)}
              placeholder="California, NYC..."
              className="bg-white/[0.02] border-white/[0.08] text-white focus-visible:ring-[#fbbf24]/30 focus-visible:border-[#fbbf24]/50 rounded-xl h-12 px-4 transition-all placeholder:text-zinc-600"
            />
          </div>
        </div>

        <div>
          <label className={labelStyle}>Business Type</label>
          <div className="grid grid-cols-3 gap-3">
            {businessTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => onChange('businessType', type.value)}
                className={`p-3 rounded-xl border text-center transition-all duration-200 ${
                  data.businessType === type.value
                    ? 'border-[#fbbf24] bg-[#fbbf24]/10 shadow-[inset_0_0_15px_rgba(251,191,36,0.1)]'
                    : 'border-white/[0.08] bg-white/[0.02] hover:border-white/[0.2] hover:bg-white/[0.05]'
                }`}
              >
                <span className={`block font-bold text-base mb-0.5 ${
                  data.businessType === type.value ? 'text-[#fbbf24]' : 'text-zinc-300'
                }`}>
                  {type.label}
                </span>
                <span className="text-[10px] text-zinc-500 leading-tight block">{type.description}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button type="button" variant="outline" size="lg" className="flex-1 h-12 rounded-xl border-white/[0.1] bg-transparent text-white hover:bg-[#fbbf24]" onClick={onBack}>
            <ArrowLeft className="w-5 h-5 mr-2" /> Back
          </Button>
          <Button type="submit" variant="default" size="lg" className="flex-1 h-12 rounded-xl bg-[#fbbf24] text-black hover:bg-[#fbbf24]/90 font-bold shadow-[0_0_15px_rgba(251,191,36,0.2)]">
            Next <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default StepTargetMarket;