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
    <div className=" min-h-screen text-white font-sans selection:bg-amber-500/30">
      <ScrollProgress className="top-[65px]" />
      {/* =========================================
          SECTION 1: THE PROBLEM
      ========================================= */}
      <section className="py-20 px-4 md:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-amber-500 font-bold tracking-widest text-xs uppercase mb-4 block">
            The Problem
          </span>
          <h2 className="text-4xl md:text-6xl font-extrabold leading-tight">
            <FlipWordsDemo />
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
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

        <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-8 text-center max-w-3xl mx-auto">
          <p className="text-zinc-400 text-lg italic">
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
          <span className="text-amber-500 font-bold tracking-widest text-xs uppercase mb-4 block">
            The Hidden Opportunity
          </span>
          <h2 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Your best customers are{" "}
            <span className="text-amber-500">
              <AuroraText>already talking.</AuroraText>
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <SocialCard
            platform="LinkedIn"
            icon={<Linkedin className="w-4 h-4 text-blue-400" />}
            time="2 min ago"
            text="Looking for a good marketing agency that specializes in B2B SaaS..."
          />
          <SocialCard
            platform="Reddit"
            icon={<MessageCircle className="w-4 h-4 text-orange-500" />}
            time="5 min ago"
            text="Any recommendations for a CRM that actually works for small teams?"
          />
          <SocialCard
            platform="X"
            icon={<Twitter className="w-4 h-4 text-zinc-100" />}
            time="8 min ago"
            text="Need help scaling my ecommerce business. Who should I talk to?"
          />
          <SocialCard
            platform="Facebook"
            icon={<Facebook className="w-4 h-4 text-blue-600" />}
            time="12 min ago"
            text="Our current solution isn't working. What do you all use?"
          />
        </div>

        <div className="flex items-center justify-center gap-4 py-12 max-w-5xl mx-auto">
          {/* Opening Quote */}
          <Quote className="w-8 h-8 md:w-10 md:h-10 text-zinc-700 fill-zinc-600 rotate-180 shrink-0" />

          <h3 className="text-2xl md:text-4xl font-extrabold text-amber-500 text-center">
            These are live buying signals, not leads.
          </h3>

          {/* Closing Quote (Rotated 180 degrees) */}
          <Quote className="w-8 h-8 md:w-10 md:h-10 text-zinc-700 fill-zinc-600  shrink-0" />
        </div>
      </section>
    </div>
  );
};

const ProblemCard = ({ icon, title, stat, desc }) => (
  <div className="relative p-8 rounded-2xl bg-zinc-800/50 overflow-hidden group">
    <ShineBorder shineColor={["#7f1d1d", "#ef4444", "#f87171", "#991b1b"]} />
    <div className="relative z-10 flex flex-col h-full justify-between space-y-6">
      <div className="flex items-center gap-4">
        <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-zinc-100">{title}</h3>
      </div>
      <div>
        <div className="text-4xl font-bold text-red-500 mb-2">{stat}</div>
        <p className="text-zinc-500 text-sm">{desc}</p>
      </div>
    </div>
  </div>
);

const SocialCard = ({ platform, time, text, icon }) => (
  <div className="relative p-6 rounded-2xl bg-zinc-800/50 overflow-hidden group">
    {/* GOLD SHINE BORDER */}
    <ShineBorder shineColor={["#b45309", "#fbbf24", "#fde68a", "#d97706"]} />

    <div className="relative z-10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {icon || <MessageSquare className="w-4 h-4 text-amber-500" />}
          <span className="text-zinc-100 font-bold text-sm">{platform}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-zinc-500 text-xs">{time}</span>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
        </div>
      </div>
      <p className="text-zinc-300 font-medium leading-relaxed italic">
        "{text}"
      </p>
    </div>
  </div>
);

export default Problems;
