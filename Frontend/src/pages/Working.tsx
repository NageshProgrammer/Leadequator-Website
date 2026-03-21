import React from 'react';
import { Search, Brain, PenTool, MousePointerClick, Shield, User, Lock } from 'lucide-react';
import { AuroraText } from '@/components/ui/aurora-text';
import { ScrollProgress } from '@/components/ui/scroll-progress';
import Features from './Features';

const Working = () => {
  return (
    // ✅ RULE APPLIED: bg-white in light mode, bg-background in dark mode
    <div className="min-h-screen bg-white dark:bg-background text-zinc-900 dark:text-white font-sans selection:bg-[#fbbf24] pt-20 relative z-10 overflow-x-hidden transition-colors duration-500">
      <ScrollProgress className="top-[69px]" />
      
      {/* ✅ RULE APPLIED: Soft yellow glow in light mode, subtle gold in dark mode */}
      <div className="absolute -top-[10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#fbbf24]/15 dark:bg-[#fbbf24]/5 rounded-full blur-[120px] -z-10 pointer-events-none transition-colors duration-500" />

      {/* =========================================
         SECTION 1: FOUR STEPS TO ORGANIC GROWTH
      ========================================= */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto mb-20 relative z-20">
        
        {/* Header */}
        <div className="text-center mb-24">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.05] text-amber-600 dark:text-[#fbbf24] font-bold tracking-widest text-xs uppercase mb-6 shadow-sm dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] transition-colors">
            How It Works
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Four Steps to <AuroraText>Organic Growth</AuroraText>
          </h2>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-20 relative">
          
          {/* Connecting Dashed Line (Desktop Only) */}
          <div className="hidden md:block absolute top-12 left-[12%] right-[12%] h-[1px] border-t-2 border-dashed border-black/10 dark:border-white/10 -z-10 transition-colors"></div>

          {/* Step 1 */}
          <StepCard 
            num="1"
            icon={<Search className="w-8 h-8 text-cyan-500 dark:text-cyan-400 transition-transform duration-500 group-hover:scale-110" />}
            hoverBorder="group-hover:border-cyan-400/50 dark:group-hover:border-cyan-400/30"
            hoverShadow="group-hover:shadow-[0_0_30px_rgba(34,211,238,0.2)] dark:group-hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]"
            title="Scan"
            desc="AI monitors public conversations across LinkedIn, X, Reddit, Quora, Facebook, YouTube."
          />

          {/* Step 2 */}
          <StepCard 
            num="2"
            icon={<Brain className="w-8 h-8 text-amber-500 dark:text-[#fbbf24] transition-transform duration-500 group-hover:scale-110" />}
            hoverBorder="group-hover:border-amber-400/50 dark:group-hover:border-[#fbbf24]/30"
            hoverShadow="group-hover:shadow-[0_0_30px_rgba(251,191,36,0.2)] dark:group-hover:shadow-[0_0_30px_rgba(251,191,36,0.15)]"
            title="Detect"
            desc="Identifies buying intent using real phrases, context, and behavioral signals."
          />

          {/* Step 3 */}
          <StepCard 
            num="3"
            icon={<PenTool className="w-8 h-8 text-purple-500 dark:text-purple-400 transition-transform duration-500 group-hover:scale-110" />}
            hoverBorder="group-hover:border-purple-400/50 dark:group-hover:border-purple-400/30"
            hoverShadow="group-hover:shadow-[0_0_30px_rgba(192,132,252,0.2)] dark:group-hover:shadow-[0_0_30px_rgba(192,132,252,0.15)]"
            title="Draft"
            desc="Generates hyper-personalized, human-style replies based on post context and your style."
          />

          {/* Step 4 */}
          <StepCard 
            num="4"
            icon={<MousePointerClick className="w-8 h-8 text-green-500 dark:text-green-400 transition-transform duration-500 group-hover:scale-110" />}
            hoverBorder="group-hover:border-green-400/50 dark:group-hover:border-green-400/30"
            hoverShadow="group-hover:shadow-[0_0_30px_rgba(74,222,128,0.2)] dark:group-hover:shadow-[0_0_30px_rgba(74,222,128,0.15)]"
            title="Engage"
            desc="You approve → click → paste → post. Human-in-the-loop ensures quality and compliance."
          />
        </div>

        {/* Safety Badges */}
        <div className="flex flex-wrap justify-center gap-4">
          <Badge icon={<Shield className="w-4 h-4" />} text="100% ToS-Safe" />
          <Badge icon={<User className="w-4 h-4" />} text="Human-Executed" />
          <Badge icon={<Lock className="w-4 h-4" />} text="No Account Risk" />
        </div>

      </section>
      
      <section>
        <Features />
      </section>
    </div>
  );
};

// --- Sub-Components ---

const StepCard = ({ num, icon, hoverBorder, hoverShadow, title, desc }: { num: string, icon: React.ReactNode, hoverBorder: string, hoverShadow: string, title: string, desc: string }) => (
  <div className="flex flex-col items-center text-center relative group cursor-default">
    {/* Icon Container with Glassmorphism */}
    <div className={`w-24 h-24 rounded-[2rem] bg-white/80 dark:bg-[#050505]/80 backdrop-blur-xl border border-black/5 dark:border-white/[0.05] flex items-center justify-center mb-8 shadow-sm dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] transition-all duration-500 ease-out group-hover:-translate-y-2 ${hoverBorder} ${hoverShadow} relative`}>
      
      {/* Step Number Indicator */}
      <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white dark:bg-[#111] border border-black/10 dark:border-white/10 flex items-center justify-center text-xs font-bold text-zinc-500 dark:text-zinc-400 shadow-md dark:shadow-lg transition-colors group-hover:text-zinc-900 dark:group-hover:text-white group-hover:bg-zinc-50 dark:group-hover:bg-zinc-800">
        {num}
      </div>
      
      {icon}
    </div>
    
    <h3 className="text-xl font-bold mb-3 text-zinc-900 dark:text-zinc-100 group-hover:text-black dark:group-hover:text-white transition-colors">{title}</h3>
    <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed max-w-[260px] group-hover:text-zinc-900 dark:group-hover:text-zinc-300 transition-colors">
      {desc}
    </p>
  </div>
);

const Badge = ({ icon, text }: { icon: React.ReactNode, text: string }) => (
  <div className="flex items-center gap-2 px-5 py-2.5 rounded-2xl border border-green-600/20 dark:border-green-500/20 bg-green-500/10 dark:bg-green-500/[0.05] text-green-700 dark:text-green-400 text-sm font-medium shadow-sm dark:shadow-[inset_0_1px_0_0_rgba(74,222,128,0.1)] hover:bg-green-500/20 dark:hover:bg-green-500/[0.08] hover:border-green-600/30 dark:hover:border-green-500/30 transition-all cursor-default">
    {icon}
    {text}
  </div>
);

export default Working;