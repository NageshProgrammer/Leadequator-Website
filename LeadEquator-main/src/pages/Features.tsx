import React from "react";
import {
  MessageSquare,
  Target,
  ListTodo,
  Sparkles,
  Users,
  LayoutGrid,
  TrendingUp,
  Ban,
  Infinity,
  Check,
  X,
} from "lucide-react";
import { AuroraText } from "@/components/ui/aurora-text";
import { ShineBorder } from "@/components/ui/shine-border";
import { ScrollProgress } from "@/components/ui/scroll-progress";

const Features = () => {
  return (
    <div className="bg-black min-h-screen text-white font-sans selection:bg-amber-500/30 pt-20">
      <ScrollProgress className="top-[65px]" />
      {/* =========================================
          SECTION 1: CORE FEATURES
      ========================================= */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-amber-500 font-bold tracking-widest text-xs uppercase mb-4 block">
            Core Features
          </span>
          <h2 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Every feature tied to <AuroraText>revenue.</AuroraText>
          </h2>
          <p className="text-zinc-500 mt-4 text-lg">
            Not tech jargon. Real business outcomes.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-32">
          <FeatureCard
            icon={<MessageSquare className="w-5 h-5 text-amber-500" />}
            title="Real-time conversation discovery"
            desc="Find buying signals the moment they appear across multiple platforms."
            tag="Never miss a hot lead"
          />

          <FeatureCard
            icon={<Target className="w-5 h-5 text-amber-500" />}
            title="Intent-based lead scoring"
            desc="AI prioritizes prospects based on buying readiness and fit."
            tag="Focus on buyers, not browsers"
          />

          <FeatureCard
            icon={<ListTodo className="w-5 h-5 text-amber-500" />}
            title="Engagement opportunity queue"
            desc="Organized workflow of high-value conversations awaiting response."
            tag="Streamlined daily actions"
          />

          <FeatureCard
            icon={<Sparkles className="w-5 h-5 text-amber-500" />}
            title="Human-like comment generation"
            desc="AI drafts contextual, personalized responses matching your voice."
            tag="Authentic at scale"
          />

          <FeatureCard
            icon={<Users className="w-5 h-5 text-amber-500" />}
            title="Competitor conversation tracking"
            desc="Monitor what prospects say about competitors and industry."
            tag="Strategic intelligence"
          />

          <FeatureCard
            icon={<LayoutGrid className="w-5 h-5 text-amber-500" />}
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
          <h2 className="text-4xl md:text-5xl font-bold mb-2">
            Built different. <AuroraText>Defensible by design.</AuroraText>
          </h2>
        </div>

        {/* Comparison Table */}
        <div className="border border-amber-500/30 rounded-3xl overflow-hidden bg-zinc-900/20 backdrop-blur-sm">
          {/* Table Header */}
          <div className="grid grid-cols-12 border-b border-zinc-800 bg-zinc-900/50 p-6 text-sm font-semibold text-zinc-400 uppercase tracking-wider">
            <div className="col-span-6 md:col-span-5">Feature</div>
            <div className="col-span-3 md:col-span-4 text-center text-white flex items-center justify-center gap-2">
              {/* Small Logo Icon Placeholder */}
              <div className="w-4 h-4 bg-amber-500 rounded-sm"></div>
              Leadequator
            </div>
            <div className="col-span-3 text-center">Other Tools</div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-zinc-800">
            <TableRow
              feature="Buying-intent detection"
              leadequator={true}
              others={false}
            />
            <TableRow
              feature="Engagement heatmap"
              leadequator={true}
              others={false}
            />
            <TableRow
              feature="Human-in-the-loop execution"
              leadequator={true}
              others={false}
            />
            <TableRow
              feature="Multi-platform intelligence"
              leadequator={true}
              others={false}
            />
            <TableRow
              feature="Zero policy risk"
              leadequator={true}
              others={false}
            />
            <TableRow
              feature="Auto-bots & automation"
              leadequator={false}
              others={false}
            />
            <TableRow
              feature="Content scheduling only"
              leadequator={false}
              others={false}
            />
            <TableRow
              feature="High ban risk"
              leadequator={false}
              others={false}
            />
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 text-center">
          <div className="inline-block border border-amber-500/20 bg-amber-500/5 rounded-xl px-8 py-4">
            <span className="text-zinc-400 text-sm block mb-1">
              We are creating a new category:
            </span>
            <span className="text-amber-500 font-bold text-lg">
              Organic Engagement Intelligence
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};

// --- Sub-Components ---

const FeatureCard = ({
  icon,
  title,
  desc,
  tag,
}: {
  icon: any;
  title: string;
  desc: string;
  tag: string;
}) => (
  <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-8 hover:border-amber-700 hover:scale-105 transition-all group flex flex-col items-start h-full hover:shadow-lg hover:shadow-amber-500/20 hover:cursor-default">
    <div className="p-3 bg-zinc-900 rounded-lg mb-6 group-hover:bg-amber-900 transition-colors">
      {icon}
    </div>
    <h3 className="text-lg font-bold text-white mb-3">{title}</h3>
    <p className="text-zinc-400 text-sm leading-relaxed mb-8 flex-grow">
      {desc}
    </p>
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-medium">
      <Sparkles className="w-3 h-3" />
      {tag}
    </div>
  </div>
);

const TableRow = ({
  feature,
  leadequator,
  others,
}: {
  feature: string;
  leadequator: boolean;
  others: boolean;
}) => (
  <div className="grid grid-cols-12 p-6 items-center hover:bg-amber-500/15 transition-colors">
    <div className="col-span-6 md:col-span-5 text-zinc-300 font-medium text-sm md:text-base">
      {feature}
    </div>

    {/* Leadequator Column */}
    <div className="col-span-3 md:col-span-4 flex justify-center">
      {leadequator ? (
        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
          <Check className="w-5 h-5 text-green-500" />
        </div>
      ) : (
        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
          <X className="w-4 h-4 text-zinc-500" />
        </div>
      )}
    </div>

    {/* Others Column */}
    <div className="col-span-3 flex justify-center">
      {others ? (
        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
          <Check className="w-5 h-5 text-green-500" />
        </div>
      ) : (
        <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
          <X className="w-4 h-4 text-red-500" />
        </div>
      )}
    </div>
  </div>
);

export default Features;
