import React from "react";
import { MessageSquare, TrendingUp, Shield } from "lucide-react";
import { AuroraText } from "@/components/ui/aurora-text";
import { ShineBorder } from "@/components/ui/shine-border";
import { ScrollProgress } from "@/components/ui/scroll-progress";

const Solution = () => {
  return (
    // ✅ RULE APPLIED: bg-white in light mode, bg-background in dark mode
    <div className="min-h-screen bg-white dark:bg-background text-zinc-900 dark:text-white font-sans selection:bg-[#fbbf24] relative z-10 overflow-x-hidden transition-colors duration-500">
      <ScrollProgress className="top-[69px]" />

      {/* ✅ RULE APPLIED: Soft yellow glow in light mode, subtle gold in dark mode */}
      <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#fbbf24]/15 dark:bg-[#fbbf24]/5 rounded-full blur-[120px] -z-10 pointer-events-none transition-colors duration-500" />
      
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        {/* =========================================
            HEADER SECTION
        ========================================= */}
        <div className="text-center mb-16 space-y-4">
          <span className="text-amber-600 dark:text-amber-500 font-bold tracking-widest text-xs uppercase block transition-colors">
            The Solution
          </span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Meet <AuroraText>Leadequator</AuroraText>
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-xl md:text-2xl font-light transition-colors">
            Your AI Engagement Copilot
          </p>
        </div>

        {/* =========================================
            CENTRAL FEATURE BOX
        ========================================= */}
        <div className="relative mb-8">
          {/* Glowing Background Effect behind the box */}
          <div className="absolute inset-0 bg-amber-500/5 dark:bg-amber-500/2 blur-3xl rounded-full pointer-events-none transition-colors duration-500"></div>

          <div className="relative z-10 border border-amber-500/20 dark:border-amber-500/30 bg-white/60 dark:bg-black/70 rounded-3xl p-10 md:p-20 text-center max-w-5xl mx-auto backdrop-blur-xl shadow-sm dark:shadow-none transition-colors duration-500">
            <ShineBorder
              shineColor={["#b45309", "#fbbf24", "#fde68a", "#d97706"]}
            />

            {/* Logo/Icon Container */}
            <div className="flex justify-center mb-8">
              <div className="relative group">
                <div className="absolute -inset-1 bg-amber-500 rounded-full blur opacity-15 dark:opacity-25 group-hover:opacity-40 dark:group-hover:opacity-50 transition duration-1000"></div>
                <div className="relative border border-amber-500/20 dark:border-white/10 bg-white/80 dark:bg-black/50 backdrop-blur-sm p-1 rounded-full flex items-center justify-center w-24 h-24 transition-colors">
                  <img
                    src="/leadequator_logo.png"
                    alt="Leadequator"
                    className="w-16 h-16 object-contain drop-shadow-md"
                  />
                </div>
              </div>
            </div>

            {/* Main Value Proposition Text */}
            <p className="text-lg md:text-2xl text-zinc-700 dark:text-zinc-300 leading-relaxed max-w-3xl mx-auto font-light transition-colors">
              Leadequator scans public conversations across platforms, detects
              real buying intent, and helps you respond with{" "}
              <span className="text-zinc-900 dark:text-white font-semibold">
                human-like, high-trust replies
              </span>{" "}
              —{" "}
              <span className="text-amber-600 dark:text-amber-500 font-medium">
                without violating platform rules.
              </span>
            </p>
          </div>
        </div>

        {/* =========================================
            THREE CARD GRID
        ========================================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Card 1 */}
          <FeatureCard
            icon={<MessageSquare className="w-6 h-6 text-amber-500" />}
            title="Replace ads with conversations"
            desc="Engage directly where buying decisions happen"
          />

          {/* Card 2 */}
          <FeatureCard
            icon={<TrendingUp className="w-6 h-6 text-amber-500" />}
            title="Build trust before selling"
            desc="Establish credibility through helpful responses"
          />

          {/* Card 3 */}
          <FeatureCard
            icon={<Shield className="w-6 h-6 text-amber-500" />}
            title="Capture high-intent leads organically"
            desc="No cold outreach, just warm conversations"
          />
        </div>
      </section>
    </div>
  );
};

// --- Sub-Component for the cards ---
const FeatureCard = ({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) => (
  <div className="group bg-zinc-50/80 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 hover:bg-white dark:hover:bg-zinc-900/60 hover:border-amber-400 dark:hover:border-amber-700 transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-amber-500/10 dark:hover:shadow-amber-500/20 hover:cursor-default hover:scale-105 backdrop-blur-sm">
    <div className="mb-6 p-3 bg-white dark:bg-zinc-950 rounded-lg w-fit border border-zinc-200 dark:border-zinc-800 group-hover:border-amber-500/30 transition-colors shadow-sm dark:shadow-none">
      {icon}
    </div>
    <h3 className="text-zinc-900 dark:text-white font-bold text-lg mb-3 transition-colors">{title}</h3>
    <p className="text-zinc-600 dark:text-zinc-500 text-sm leading-relaxed transition-colors">{desc}</p>
  </div>
);

export default Solution;