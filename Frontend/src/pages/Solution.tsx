import React from "react";
import { MessageSquare, TrendingUp, Shield, Bot } from "lucide-react";
import { AuroraText } from "@/components/ui/aurora-text";
import { ShineBorder } from "@/components/ui/shine-border";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import leadequatorLogo from "@/assets/leadequator_logo.png"; // adjust path as needed

const Solution = () => {
  return (
    <div className="bg-black min-h-screen text-white font-sans selection:bg-amber-500/30 pt-20">
      <ScrollProgress className="top-[65px]" />
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        {/* =========================================
            HEADER SECTION
        ========================================= */}
        <div className="text-center mb-16 space-y-4">
          <span className="text-amber-500 font-bold tracking-widest text-xs uppercase block">
            The Solution
          </span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Meet <AuroraText>Leadequator</AuroraText>
          </h1>
          <p className="text-zinc-400 text-xl md:text-2xl font-light">
            Your AI Engagement Copilot
          </p>
        </div>

        {/* =========================================
            CENTRAL FEATURE BOX
        ========================================= */}
        <div className="relative mb-8">
          {/* Glowing Background Effect behind the box */}
          <div className="absolute inset-0 bg-amber-500/5 blur-3xl rounded-full opacity-20 pointer-events-none"></div>

          <div className="relative z-10 border border-amber-500/30 bg-zinc-900/20 rounded-3xl p-10 md:p-20 text-center max-w-5xl mx-auto backdrop-blur-sm">
            <ShineBorder
              shineColor={["#b45309", "#fbbf24", "#fde68a", "#d97706"]}
            />

            {/* Logo/Icon Container */}
            <div className="flex justify-center mb-8">
              <div className="relative group">
                <div className="absolute -inset-1 bg-amber-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                <div className="relative bg-black border border-zinc-700 p-1 rounded-xl flex items-center justify-center w-16 h-16">
                  {/* Using Bot icon as placeholder for the logo */}
                  <img
                    src={leadequatorLogo}
                    alt="Leadequator"
                    className="w-16 h-16 object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Main Value Proposition Text */}
            <p className="text-lg md:text-2xl text-zinc-300 leading-relaxed max-w-3xl mx-auto font-light">
              Leadequator scans public conversations across platforms, detects
              real buying intent, and helps you respond with{" "}
              <span className="text-white font-semibold">
                human-like, high-trust replies
              </span>{" "}
              —{" "}
              <span className="text-amber-500 font-medium">
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
  icon: any;
  title: string;
  desc: string;
}) => (
  <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-8 hover:bg-zinc-900/60 hover:border-amber-700 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/20 hover:cursor-default hover:scale-105">
    <div className="mb-6 p-3 bg-zinc-950 rounded-lg w-fit border border-zinc-800 group-hover:border-amber-500/30 transition-colors">
      {icon}
    </div>
    <h3 className="text-white font-bold text-lg mb-3">{title}</h3>
    <p className="text-zinc-500 text-sm leading-relaxed">{desc}</p>
  </div>
);

export default Solution;
