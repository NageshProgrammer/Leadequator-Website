import React from "react";
import { ShieldCheck, CheckCircle2, Users2 } from "lucide-react";
import { motion } from "framer-motion";

const ConversionHero = () => {
  const features = [
    {
      icon: <ShieldCheck className="w-5 h-5 text-amber-500" />,
      text: "No bots. No auto-commenting.",
    },
    {
      icon: <CheckCircle2 className="w-5 h-5 text-amber-500" />,
      text: "100% platform-compliant",
    },
    {
      icon: <Users2 className="w-5 h-5 text-amber-500" />,
      text: "Built for founders, agencies & growth teams",
    },
  ];

  return (
    <div className="h-screen bg-[#0a0a0a] flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-2xl w-full space-y-8 relative z-10">
        {/* Logo Section */}
        <div className="flex items-center gap-3 mb-12">
          <img
            src="/leadequator_logo.png"
            alt="Leadequator"
            className="w-16 h-16 object-contain"
          />
          <span className="text-white text-xl font-bold tracking-tight">
            Leadequator
          </span>
        </div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl font-bold text-white leading-[1.1] tracking-tight"
        >
          Start converting conversations into customers.
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-zinc-500 text-xl leading-relaxed max-w-xl"
        >
          Join the conversations where real buyers already exist — without ads
          or automation risk.
        </motion.p>

        {/* Feature List */}
        <div className="space-y-5 pt-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="flex items-center gap-4 group"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 group-hover:border-amber-500/40 transition-colors">
                {feature.icon}
              </div>
              <span className="text-zinc-300 text-lg font-medium">
                {feature.text}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConversionHero;
