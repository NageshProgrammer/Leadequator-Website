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
      className="max-w-lg mx-auto"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-primary/20 rounded-2xl flex items-center justify-center">
          <Building2 className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Tell us about your business
        </h2>
        <p className="text-muted-foreground">
          This helps us understand who you are
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Company Name
          </label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              value={data.companyName}
              onChange={(e) => onChange('companyName', e.target.value)}
              placeholder="Acme Inc."
              required
              className="pl-10 bg-card border-border focus:border-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Website URL
          </label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="url"
              value={data.websiteUrl}
              onChange={(e) => onChange('websiteUrl', e.target.value)}
              placeholder="https://yourcompany.com"
              className="pl-10 bg-card border-border focus:border-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Business Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="email"
              value={data.businessEmail}
              onChange={(e) => onChange('businessEmail', e.target.value)}
              placeholder="hello@yourcompany.com"
              className="pl-10 bg-card border-border focus:border-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Phone Number <span className="text-muted-foreground">(optional)</span>
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="tel"
              value={data.phoneNumber}
              onChange={(e) => onChange('phoneNumber', e.target.value)}
              placeholder="+1 (555) 123-4567"
              className="pl-10 bg-card border-border focus:border-primary"
            />
          </div>
        </div>

        <Button type="submit" variant="default" size="lg" className="w-full mt-8">
          Next
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </form>
    </motion.div>
  );
};

export default StepCompanyBasics;
