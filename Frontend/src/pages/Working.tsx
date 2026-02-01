import React from 'react';
import { Search, Brain, PenTool, MousePointerClick, Check, X, Shield, User, Lock } from 'lucide-react';
import { AuroraText } from '@/components/ui/aurora-text';
import { ScrollProgress } from '@/components/ui/scroll-progress';

const Working = () => {
  return (
    <div className=" min-h-screen text-white font-sans selection:bg-amber-500/30 pt-20">
      <ScrollProgress className="top-[65px]" />
      {/* =========================================
          SECTION 1: FOUR STEPS TO ORGANIC GROWTH
      ========================================= */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto mb-20">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-amber-500 font-bold tracking-widest text-xs uppercase mb-4 block">
            How It Works
          </span>
          <h2 className="text-4xl md:text-5xl font-bold">
            Four Steps to <AuroraText>Organic Growth</AuroraText>
          </h2>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16 relative">
          
          {/* Connecting Line (Desktop Only) */}
          <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-zinc-800 -z-10"></div>

          {/* Step 1 */}
          <StepCard 
            icon={<Search className="w-8 h-8 text-cyan-400 " />}
            color="border-cyan-400"
            title="Scan"
            desc="AI monitors public conversations across LinkedIn, X, Reddit, Quora, Facebook, YouTube."
          />

          {/* Step 2 */}
          <StepCard 
            icon={<Brain className="w-8 h-8 text-amber-400" />}
            color="border-amber-400"
            title="Detect"
            desc="Identifies buying intent using real phrases, context, and behavioral signals."
          />

          {/* Step 3 */}
          <StepCard 
            icon={<PenTool className="w-8 h-8 text-purple-400" />}
            color="border-purple-400"
            title="Draft"
            desc="Generates hyper-personalized, human-style replies based on post context and your style."
          />

          {/* Step 4 */}
          <StepCard 
            icon={<MousePointerClick className="w-8 h-8 text-green-400" />}
            color="border-green-400"
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


      

    </div>
  );
};

// --- Sub-Components ---

const StepCard = ({ icon, color, title, desc }: {icon:any, color:string, title:string, desc:string}) => (
  <div className="flex flex-col items-center text-center relative z-10}">
    <div className={`w-24 h-24 rounded-2xl bg-zinc-900 border-2 ${color} flex items-center justify-center mb-6 shadow-lg shadow-black/50 hover:bg-${color}`}>
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">
      {desc}
    </p>
  </div>
);

const Badge = ({ icon, text }: {icon:any, text:string}) => (
  <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-sm font-medium">
    {icon}
    {text}
  </div>
);



export default Working;