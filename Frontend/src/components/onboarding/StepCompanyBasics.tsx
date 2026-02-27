import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Building2, Globe, Mail, Phone, ArrowRight } from 'lucide-react';

interface StepCompanyBasicsProps {
  data: {
    companyName: string;
    websiteUrl: string;
    businessEmail: string;
    phoneNumber: string;
  };
  onChange: (field: string, value: string) => void;
  onNext: () => void;
}

const inputStyle = "pl-11 bg-white/[0.02] border-white/[0.08] text-white focus-visible:ring-[#fbbf24]/30 focus-visible:border-[#fbbf24]/50 rounded-xl h-12 transition-all placeholder:text-zinc-600";
const labelStyle = "block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2 ml-1";

const StepCompanyBasics: React.FC<StepCompanyBasicsProps> = ({ data, onChange, onNext }) => {
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
      className="max-w-lg mx-auto w-full px-4 "
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-[#fbbf24]/10 border border-[#fbbf24]/20 rounded-2xl flex items-center justify-center shadow-[inset_0_1px_0_0_rgba(251,191,36,0.2)]">
          <Building2 className="w-8 h-8 text-[#fbbf24]" />
        </div>
        <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">
          Tell us about your business
        </h2>
        <p className="text-zinc-400 font-medium">
          This helps us understand who you are
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 bg-background/20 backdrop-blur-xl border border-white/[0.05] p-6 sm:p-8 rounded-[2rem] shadow-2xl">
        <div>
          <label className={labelStyle}>Company Name</label>
          <div className="relative">
            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input
              type="text"
              value={data.companyName}
              onChange={(e) => onChange('companyName', e.target.value)}
              placeholder="Acme Inc."
              required
              className={inputStyle}
            />
          </div>
        </div>

        <div>
          <label className={labelStyle}>Website URL</label>
          <div className="relative">
            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input
              type="url"
              value={data.websiteUrl}
              onChange={(e) => onChange('websiteUrl', e.target.value)}
              placeholder="https://yourcompany.com"
              className={inputStyle}
            />
          </div>
        </div>

        <div>
          <label className={labelStyle}>Business Email</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input
              type="email"
              value={data.businessEmail}
              onChange={(e) => onChange('businessEmail', e.target.value)}
              placeholder="hello@yourcompany.com"
              className={inputStyle}
            />
          </div>
        </div>

        <div>
          <label className={labelStyle}>
            Phone Number <span className="text-zinc-600 normal-case font-medium ml-1">(optional)</span>
          </label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input
              type="tel"
              value={data.phoneNumber}
              onChange={(e) => onChange('phoneNumber', e.target.value)}
              placeholder="+1 (555) 123-4567"
              className={inputStyle}
            />
          </div>
        </div>

        <Button type="submit" className="w-full h-12 mt-6 text-base font-bold bg-[#fbbf24] text-black hover:bg-[#fbbf24]/90 rounded-xl shadow-[0_0_20px_rgba(251,191,36,0.2)] hover:shadow-[0_0_30px_rgba(251,191,36,0.4)] transition-all">
          Next Step
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </form>
    </motion.div>
  );
};

export default StepCompanyBasics;