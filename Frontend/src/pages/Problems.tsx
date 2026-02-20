import React from "react";
import {
  TrendingUp,
  MousePointer2,
  DollarSign,
  Users,
  Quote,
  MessageSquare,
  Facebook,
  Twitter,
  MessageCircle,
  Linkedin,
} from "lucide-react";
import { FlipWordsDemo } from "@/[components]/flipword";
import { ShineBorder } from "@/components/ui/shine-border";
import { AuroraText } from "@/components/ui/aurora-text";
import { ScrollProgress } from "@/components/ui/scroll-progress";

const Problems = () => {
  return (
    // ADDED: bg-black and overflow-x-hidden to fix the mobile layout stretching
    <div className="min-h-screen  text-white font-sans selection:bg-[#fbbf24]/30 pt-20 relative z-10 overflow-x-hidden">
      <ScrollProgress className="top-[65px]" />
      
      {/* Background Glow */}
      <div className="absolute top-1/5 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#fbbf24]/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

      {/* =========================================
          SECTION 1: THE PROBLEM
      ========================================= */}
      <section className="py-20 px-4 md:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.05] text-[#fbbf24] font-bold tracking-widest text-xs uppercase mb-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
            The Problem
          </span>
          <h2 className="text-4xl md:text-6xl font-extrabold leading-tight">
            <FlipWordsDemo />
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <ProblemCard
            icon={<TrendingUp className="w-6 h-6 text-red-500" />}
            title="Cost per lead rising"
            stat="40-80%"
            desc="Year over year increase in ad costs"
          />
          <ProblemCard
            icon={<MousePointer2 className="w-6 h-6 text-red-500" />}
            title="Fake clicks, cold leads"
            stat="60%+"
            desc="Of ad clicks never convert"
          />
          <ProblemCard
            icon={<DollarSign className="w-6 h-6 text-red-500" />}
            title="Paying for impressions"
            stat="$0"
            desc="Return on visibility without intent"
          />
          <ProblemCard
            icon={<Users className="w-6 h-6 text-red-500" />}
            title="Competing blind"
            stat="10X"
            desc="Bigger budgets always win"
          />
        </div>

        <div className="bg-[#050505]/40 backdrop-blur-xl border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] rounded-[2rem] p-10 text-center max-w-3xl mx-auto relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-[#fbbf24] to-transparent" />
          <p className="text-zinc-400 text-xl leading-relaxed italic">
            "Meanwhile, millions of real buyers are asking for{" "}
            <br className="hidden md:block" />
            recommendations every day —{" "}
            <span className="text-white font-bold not-italic">
              and brands never see them.
            </span>
            "
          </p>
        </div>
      </section>

      {/* =========================================
          SECTION 2: THE OPPORTUNITY
      ========================================= */}
      <section className="py-20 px-4 md:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.05] text-[#fbbf24] font-bold tracking-widest text-xs uppercase mb-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
            The Hidden Opportunity
          </span>
          <h2 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Your best customers are{" "}
            <span className="text-[#fbbf24]">
              <AuroraText>already talking.</AuroraText>
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <SocialCard
            platform="LinkedIn"
            icon={<Linkedin className="w-5 h-5 text-blue-400" />}
            time="2 min ago"
            text="Looking for a good marketing agency that specializes in B2B SaaS..."
          />
          <SocialCard
            platform="Reddit"
            icon={<MessageCircle className="w-5 h-5 text-orange-500" />}
            time="5 min ago"
            text="Any recommendations for a CRM that actually works for small teams?"
          />
          <SocialCard
            platform="X"
            icon={<Twitter className="w-5 h-5 text-zinc-100" />}
            time="8 min ago"
            text="Need help scaling my ecommerce business. Who should I talk to?"
          />
          <SocialCard
            platform="Facebook"
            icon={<Facebook className="w-5 h-5 text-blue-600" />}
            time="12 min ago"
            text="Our current solution isn't working. What do you all use?"
          />
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6 py-12 max-w-4xl mx-auto border-t border-white/[0.05]">
          <Quote className="w-10 h-10 text-zinc-800 fill-zinc-800 rotate-180 shrink-0" />
          <h3 className="text-3xl md:text-4xl font-extrabold text-[#fbbf24] text-center tracking-tight">
            These are live buying signals, not leads.
          </h3>
          <Quote className="w-10 h-10 text-zinc-800 fill-zinc-800 shrink-0 hidden md:block" />
        </div>
      </section>
    </div>
  );
};

// --- Sub-Components ---

const ProblemCard = ({ icon, title, stat, desc }) => (
  <div className="relative p-8 rounded-[2rem] bg-[#050505]/20 backdrop-blur-xl border border-white/[0.05] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] overflow-hidden group">
    <ShineBorder shineColor={["#7f1d1d", "#ef4444", "#f87171", "#991b1b"]} />
    <div className="relative z-10 flex flex-col h-full justify-between space-y-6">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-zinc-100">{title}</h3>
      </div>
      <div>
        <div className="text-5xl font-bold text-red-500 mb-3 tracking-tight">{stat}</div>
        <p className="text-zinc-400 text-base">{desc}</p>
      </div>
    </div>
  </div>
);

const SocialCard = ({ platform, time, text, icon }) => (
  <div className="relative p-8 rounded-[2rem] bg-[#050505]/25 backdrop-blur-xl border border-white/[0.05] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] overflow-hidden group">
    <ShineBorder shineColor={["#b45309", "#fbbf24", "#fde68a", "#d97706"]} />
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
            {icon || <MessageSquare className="w-5 h-5 text-[#fbbf24]" />}
          </div>
          <span className="text-zinc-100 font-bold text-lg">{platform}</span>
        </div>
        <div className="flex items-center gap-2 bg-[#111] px-3 py-1.5 rounded-full border border-white/[0.05]">
          <span className="text-zinc-400 text-xs font-medium uppercase tracking-wider">{time}</span>
          <span className="relative flex h-2 w-2 ml-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
        </div>
      </div>
      <p className="text-zinc-300 font-medium leading-relaxed italic text-lg">
        "{text}"
      </p>
    </div>
  </div>
);

export default Problems;