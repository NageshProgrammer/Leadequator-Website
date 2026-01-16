import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Rocket, Check, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OnboardingComplete = () => {
  const navigate = useNavigate();

  const features = [
    'Real-time conversation discovery',
    'AI-powered intent detection',
    'Human-in-the-loop engagement',
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-lg mx-auto text-center"
    >
      {/* Success Animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', duration: 0.8, delay: 0.2 }}
        className="relative w-32 h-32 mx-auto mb-8"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-glow rounded-full opacity-20 animate-pulse" />
        <div className="absolute inset-2 bg-gradient-to-r from-primary to-primary-glow rounded-full opacity-40 animate-pulse delay-100" />
        <div className="absolute inset-4 bg-gradient-to-r from-primary to-primary-glow rounded-full flex items-center justify-center">
          <Rocket className="w-12 h-12 text-primary-foreground" />
        </div>
        
        {/* Sparkles */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute -top-2 -right-2"
        >
          <Sparkles className="w-8 h-8 text-primary animate-pulse" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="absolute -bottom-2 -left-2"
        >
          <Sparkles className="w-6 h-6 text-primary-glow animate-pulse" />
        </motion.div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-3xl md:text-4xl font-bold text-foreground mb-4"
      >
        Your AI Engagement Engine is{' '}
        <span className="text-gradient">Ready</span> 🚀
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-lg text-muted-foreground mb-8"
      >
        We're now scanning real conversations and detecting buying intent for your business.
      </motion.p>

      {/* Features List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-card/50 border border-border rounded-2xl p-6 mb-8"
      >
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          What happens next
        </h3>
        <div className="space-y-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="flex items-center gap-3"
            >
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 text-primary" />
              </div>
              <span className="text-foreground">{feature}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <Button
          variant="default"
          onClick={() => navigate('/dashboard')}
          className="w-full md:w-auto"
        >
          Go to Dashboard
          <Rocket className="w-5 h-5 ml-2" />
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default OnboardingComplete;
