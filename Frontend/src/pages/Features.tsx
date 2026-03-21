import React from "react";
import {
  MessageSquare,
  Target,
  ListTodo,
  Sparkles,
  Users,
  LayoutGrid,
  Check,
  X,
} from "lucide-react";
import { AuroraText } from "@/components/ui/aurora-text";
import { ScrollProgress } from "@/components/ui/scroll-progress";

const Features = () => {
  return (
    // ✅ RULE APPLIED: bg-white in light mode, bg-background in dark mode
    <div className="min-h-screen bg-white dark:bg-background text-zinc-900 dark:text-white font-sans selection:bg-[#fbbf24] relative z-10 overflow-x-hidden transition-colors duration-500">
      <ScrollProgress className="top-[69px]" />
      
      {/* ✅ RULE APPLIED: Soft yellow glow in light mode, subtle gold in dark mode */}
      <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#fbbf24]/15 dark:bg-[#fbbf24]/5 rounded-full blur-[120px] -z-10 pointer-events-none transition-colors duration-500" />

      {/* =========================================
          SECTION 1: CORE FEATURES
      ========================================= */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.05] text-amber-600 dark:text-[#fbbf24] font-bold tracking-widest text-xs uppercase mb-6 shadow-sm dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] transition-colors">
            Core Features
          </span>
          <h2 className="text-4xl md:text-6xl font-extrabold leading-tight text-zinc-900 dark:text-neutral-50 transition-colors">
            Every feature tied to <AuroraText>revenue.</AuroraText>
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 mt-6 text-xl max-w-2xl mx-auto transition-colors">
            Not tech jargon. Real business outcomes.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
          <FeatureCard
            icon={<MessageSquare className="w-6 h-6 text-amber-500 dark:text-[#fbbf24]" />}
            title="Real-time conversation discovery"
            desc="Find buying signals the moment they appear across multiple platforms."
            tag="Never miss a hot lead"
          />

          <FeatureCard
            icon={<Target className="w-6 h-6 text-amber-500 dark:text-[#fbbf24]" />}
            title="Intent-based lead scoring"
            desc="AI prioritizes prospects based on buying readiness and fit."
            tag="Focus on buyers, not browsers"
          />

          <FeatureCard
            icon={<ListTodo className="w-6 h-6 text-amber-500 dark:text-[#fbbf24]" />}
            title="Engagement opportunity queue"
            desc="Organized workflow of high-value conversations awaiting response."
            tag="Streamlined daily actions"
          />

          <FeatureCard
            icon={<Sparkles className="w-6 h-6 text-amber-500 dark:text-[#fbbf24]" />}
            title="Human-like comment generation"
            desc="AI drafts contextual, personalized responses matching your voice."
            tag="Authentic at scale"
          />

          <FeatureCard
            icon={<Users className="w-6 h-6 text-amber-500 dark:text-[#fbbf24]" />}
            title="Competitor conversation tracking"
            desc="Monitor what prospects say about competitors and industry."
            tag="Strategic intelligence"
          />

          <FeatureCard
            icon={<LayoutGrid className="w-6 h-6 text-amber-500 dark:text-[#fbbf24]" />}
            title="Lead & prospect dashboard"
            desc="Centralized view of all engaged leads and conversion status."
            tag="Complete visibility"
          />
        </div>
      </section>

      {/* =========================================
          SECTION 2: COMPARISON TABLE
      ========================================= */}
      <section className="py-20 px-4 md:px-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Built different. <AuroraText>Defensible by design.</AuroraText>
          </h2>
        </div>

        {/* Comparison Table */}
        <div className="border border-black/10 dark:border-white/[0.08] rounded-[2.5rem] overflow-hidden bg-white/60 dark:bg-[#050505]/60 backdrop-blur-xl shadow-lg dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_20px_40px_rgba(0,0,0,0.4)] transition-colors duration-500">
          
          {/* Table Header */}
          <div className="grid grid-cols-12 border-b border-black/5 dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.02] p-6 md:p-8 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest transition-colors">
            <div className="col-span-6 md:col-span-5">Feature</div>
            <div className="col-span-3 md:col-span-4 text-center text-zinc-900 dark:text-white flex items-center justify-center gap-2">
              <div className="w-4 h-4 bg-[#fbbf24] rounded-sm shadow-[0_0_10px_rgba(251,191,36,0.5)]"></div>
              Leadequator
            </div>
            <div className="col-span-3 text-center">Other Tools</div>
          </div>

          {/* Table Rows (Removed divide-y to handle dark/light borders cleanly inside the component) */}
          <div className="flex flex-col">
            <TableRow feature="Buying-intent detection" leadequator={true} others={false} />
            <TableRow feature="Engagement heatmap" leadequator={true} others={false} />
            <TableRow feature="Human-in-the-loop execution" leadequator={true} others={false} />
            <TableRow feature="Multi-platform intelligence" leadequator={true} others={false} />
            <TableRow feature="Zero policy risk" leadequator={true} others={false} />
            <TableRow feature="Auto-bots & automation" leadequator={false} others={false} />
            <TableRow feature="Content scheduling only" leadequator={false} others={false} />
            <TableRow feature="High ban risk" leadequator={false} others={false} />
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="mt-16 text-center">
          <div className="inline-block border border-amber-500/20 dark:border-[#fbbf24]/20 bg-amber-500/5 dark:bg-[#fbbf24]/[0.05] rounded-2xl px-10 py-5 shadow-sm dark:shadow-[inset_0_1px_0_0_rgba(251,191,36,0.1)] transition-colors">
            <span className="text-zinc-500 dark:text-zinc-400 text-sm block mb-1 uppercase tracking-widest font-semibold transition-colors">
              We are creating a new category:
            </span>
            <span className="text-amber-600 dark:text-[#fbbf24] font-extrabold text-xl md:text-2xl tracking-tight transition-colors">
              Organic Engagement Intelligence
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};

// --- Sub-Components ---

const FeatureCard = ({ icon, title, desc, tag }: { icon: React.ReactNode, title: string, desc: string, tag: string }) => (
  <div className="bg-white/60 dark:bg-[#050505]/15 backdrop-blur-xl border border-black/5 dark:border-white/[0.05] rounded-[2rem] p-8 shadow-sm dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] hover:border-amber-400 dark:hover:border-[#fbbf24]/30 hover:shadow-lg dark:hover:shadow-[0_0_30px_rgba(251,191,36,0.1)] hover:-translate-y-1 transition-all duration-300 group flex flex-col items-start h-full cursor-default">
    <div className="p-4 bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.05] rounded-2xl mb-8 group-hover:bg-amber-500/10 dark:group-hover:bg-[#fbbf24]/10 transition-colors shadow-sm dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)]">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-3 group-hover:text-black dark:group-hover:text-white transition-colors">{title}</h3>
    <p className="text-zinc-600 dark:text-zinc-400 text-base leading-relaxed mb-8 flex-grow group-hover:text-zinc-900 dark:group-hover:text-zinc-300 transition-colors">
      {desc}
    </p>
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 dark:bg-[#fbbf24]/10 border border-amber-500/20 dark:border-[#fbbf24]/20 text-amber-600 dark:text-[#fbbf24] text-xs font-bold uppercase tracking-wider transition-colors">
      <Sparkles className="w-3 h-3" />
      {tag}
    </div>
  </div>
);

const TableRow = ({ feature, leadequator, others }: { feature: string, leadequator: boolean, others: boolean }) => (
  <div className="grid grid-cols-12 p-6 md:px-8 md:py-6 items-center hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors border-b border-black/5 dark:border-white/[0.02] last:border-0">
    <div className="col-span-6 md:col-span-5 text-zinc-700 dark:text-zinc-300 font-medium text-sm md:text-base transition-colors">
      {feature}
    </div>

    {/* Leadequator Column */}
    <div className="col-span-3 md:col-span-4 flex justify-center border-l border-black/5 dark:border-white/[0.02] transition-colors">
      {leadequator ? (
        <div className="w-8 h-8 rounded-full bg-amber-500/20 dark:bg-[#fbbf24]/20 border border-amber-500/30 dark:border-[#fbbf24]/30 flex items-center justify-center shadow-sm dark:shadow-[0_0_15px_rgba(251,191,36,0.2)] transition-colors">
          <Check className="w-4 h-4 text-amber-600 dark:text-[#fbbf24] stroke-[3]" />
        </div>
      ) : (
        <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-white/[0.03] border border-zinc-200 dark:border-transparent flex items-center justify-center transition-colors">
          <X className="w-4 h-4 text-zinc-400 dark:text-zinc-600" />
        </div>
      )}
    </div>

    {/* Others Column */}
    <div className="col-span-3 flex justify-center border-l border-black/5 dark:border-white/[0.02] transition-colors">
      {others ? (
        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30 transition-colors">
          <Check className="w-4 h-4 text-green-600 dark:text-green-500 stroke-[3]" />
        </div>
      ) : (
        <div className="w-8 h-8 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center transition-colors">
          <X className="w-4 h-4 text-red-600 dark:text-red-500 stroke-[3]" />
        </div>
      )}
    </div>
  </div>
);

export default Features;