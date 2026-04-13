import React from "react";
import {
  Globe,
  Crosshair,
  Users,
  LineChart,
  DollarSign,
  Filter,
  MapPin,
  BrainCircuit,
  Share2,
  Sparkles,
  Check,
  Gift,
  ArrowRight,
  Zap
} from "lucide-react";
import { AuroraText } from "@/components/ui/aurora-text";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { ShineBorder } from "@/components/ui/shine-border";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// --- Animation Variants ---
const smoothEase = [0.22, 1, 0.36, 1];
const VARIANTS = {
  container: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
  },
  fadeUp: {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: smoothEase } }
  },
  zoomIn: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: smoothEase } }
  }
};

// --- Content Data ---
const modules = [
  {
    title: "1. Market Intelligence",
    icon: <Globe className="w-6 h-6 text-amber-500 dark:text-[#fbbf24]" />,
    bullets: [
      "Industry trends (what’s rising, declining, saturated)",
      "Emerging opportunities before they go mainstream",
      "Demand-supply gaps in your niche",
      "Seasonal and cyclical patterns",
      "Geographic demand insights"
    ]
  },
  {
    title: "2. Competitor Intelligence",
    icon: <Crosshair className="w-6 h-6 text-amber-500 dark:text-[#fbbf24]" />,
    bullets: [
      "Top competitors’ growth strategies",
      "Their ad angles, creatives & funnels",
      "Traffic sources (paid vs organic split)",
      "Keyword & SEO strategy breakdown",
      "Pricing, positioning & offer analysis",
      "Weaknesses you can exploit"
    ]
  },
  {
    title: "3. Customer & Buyer Intelligence",
    icon: <Users className="w-6 h-6 text-amber-500 dark:text-[#fbbf24]" />,
    bullets: [
      "Real-time buyer intent signals",
      "What your audience is actively searching for",
      "Pain points extracted from real conversations",
      "Objections & buying triggers",
      "Audience segmentation (who converts fastest)"
    ]
  },
  {
    title: "4. Demand & Trend Signals",
    icon: <LineChart className="w-6 h-6 text-amber-500 dark:text-[#fbbf24]" />,
    bullets: [
      "High-intent keyword clusters",
      "Search trend analysis (Google + platforms)",
      "Viral topics in your industry",
      "Content gaps you can dominate",
      "Platform-wise demand (LinkedIn, YouTube, etc.)"
    ]
  },
  {
    title: "5. Revenue Opportunity Mapping",
    icon: <DollarSign className="w-6 h-6 text-amber-500 dark:text-[#fbbf24]" />,
    bullets: [
      "Untapped revenue channels",
      "High ROI marketing opportunities",
      "Offer positioning suggestions",
      "Upsell / cross-sell opportunities",
      "Market segments with highest monetization potential"
    ]
  },
  {
    title: "6. Ad & Funnel Intelligence",
    icon: <Filter className="w-6 h-6 text-amber-500 dark:text-[#fbbf24]" />,
    bullets: [
      "Winning ad copies & hooks in your niche",
      "Funnel breakdowns of competitors",
      "Landing page positioning insights",
      "Conversion triggers that are working now",
      "Retargeting & scaling strategies"
    ]
  },
  {
    title: "7. Strategic Action Plan",
    icon: <MapPin className="w-6 h-6 text-amber-500 dark:text-[#fbbf24]" />,
    isSpecial: true, // Triggers full width & shine border
    bullets: [
      "Clear step-by-step execution roadmap",
      "Priority actions (what to do first)",
      "Short-term vs long-term strategy",
      "Growth experiments to run",
      "Risk alerts (what to avoid)"
    ],
    footer: "👉 This is where most reports fail. This is where we win."
  },
  {
    title: "8. AI + Human Insight Layer",
    icon: <BrainCircuit className="w-6 h-6 text-amber-500 dark:text-[#fbbf24]" />,
    bullets: [
      "AI-driven data processing",
      "Human strategic interpretation",
      "Context-aware recommendations (not generic outputs)"
    ]
  },
  {
    title: "9. Platform Intelligence",
    icon: <Share2 className="w-6 h-6 text-amber-500 dark:text-[#fbbf24]" />,
    bullets: [
      "LinkedIn growth insights",
      "YouTube content opportunities",
      "SEO ranking opportunities",
      "Paid ads scaling platforms",
      "Community & distribution channels"
    ]
  },
  {
    title: "10. Predictive Intelligence",
    icon: <Sparkles className="w-6 h-6 text-amber-500 dark:text-[#fbbf24]" />,
    bullets: [
      "Where your market is heading next",
      "Early signals of shifts & disruptions",
      "Competitor future moves (pattern-based prediction)",
      "“What will work next” insights"
    ]
  }
];

const Intelligence = () => {
  return (
    <div className="min-h-screen pt-24 pb-20 bg-white dark:bg-background text-zinc-900 dark:text-white selection:bg-[#fbbf24] relative z-10 overflow-x-hidden transition-colors duration-500">
      <ScrollProgress className="top-[69px]" />
      
      {/* Background Glow */}
      <div className="absolute top-[5%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#fbbf24]/15 dark:bg-[#fbbf24]/5 rounded-full blur-[120px] -z-10 pointer-events-none transition-colors duration-500" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        
        {/* ================= HEADER ================= */}
        <motion.div 
          initial="hidden" animate="visible" variants={VARIANTS.container}
          className="text-center max-w-5xl mx-auto mb-20 pt-10"
        >
          <motion.div variants={VARIANTS.fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-50 dark:bg-white/[0.03] border border-black/5 dark:border-white/[0.1] text-amber-600 dark:text-[#fbbf24] font-bold tracking-widest text-xs uppercase mb-8 shadow-sm dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] transition-colors">
            Core Intelligence Modules
          </motion.div>
          <motion.h1 variants={VARIANTS.zoomIn} className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-8 tracking-tight">
            Everything You Need to Understand, Predict & <br className="hidden md:block"/>
            <AuroraText>Dominate Your Market</AuroraText>
          </motion.h1>
          <motion.p variants={VARIANTS.fadeUp} className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 font-medium">
            Not just insights. A complete intelligence system built for decision-makers.
          </motion.p>
        </motion.div>

        {/* ================= MODULES GRID ================= */}
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: false, margin: "-50px" }} variants={VARIANTS.container}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24"
        >
          {modules.map((mod, idx) => (
            <motion.div 
              key={idx} 
              variants={VARIANTS.fadeUp}
              className={`relative ${mod.isSpecial ? "md:col-span-2 lg:col-span-3" : ""}`}
            >
              <div className={`h-full bg-white/60 dark:bg-[#050505]/20 backdrop-blur-xl border border-black/5 dark:border-white/[0.05] shadow-sm dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] rounded-[2rem] p-8 hover:border-amber-400 dark:hover:border-[#fbbf24]/30 hover:shadow-lg dark:hover:shadow-[0_0_30px_rgba(251,191,36,0.1)] transition-all duration-300 group flex flex-col overflow-hidden ${mod.isSpecial ? "bg-amber-50/50 dark:bg-amber-500/[0.02]" : ""}`}>
                
                {/* Permanent Golden Border for the "Most Important" Module */}
                {mod.isSpecial && <ShineBorder shineColor={["#b45309", "#fbbf24", "#fde68a", "#d97706"]} />}

                <div className="flex items-center gap-4 mb-6 relative z-10">
                  <div className="p-3 bg-zinc-50 dark:bg-white/[0.03] border border-black/5 dark:border-white/[0.05] rounded-xl group-hover:bg-amber-500/10 dark:group-hover:bg-[#fbbf24]/10 transition-colors shadow-sm dark:shadow-none">
                    {mod.icon}
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 transition-colors">
                    {mod.title}
                    {mod.isSpecial && <span className="ml-3 inline-block px-2 py-1 bg-amber-500/20 text-amber-600 dark:text-[#fbbf24] text-[10px] uppercase tracking-widest rounded-md border border-amber-500/30">Most Important</span>}
                  </h3>
                </div>

                <ul className="space-y-3 flex-grow relative z-10">
                  {mod.bullets.map((bullet, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-3 text-zinc-600 dark:text-zinc-400 text-sm font-medium transition-colors">
                      <Check className="w-4 h-4 text-amber-500 dark:text-[#fbbf24] shrink-0 mt-0.5" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>

                {mod.footer && (
                  <div className="mt-6 pt-4 border-t border-black/5 dark:border-white/[0.05] text-zinc-900 dark:text-white font-bold italic relative z-10 transition-colors">
                    {mod.footer}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ================= BONUS SECTION ================= */}
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: false, margin: "-50px" }} variants={VARIANTS.container}
          className="max-w-4xl mx-auto mb-24"
        >
          <motion.div variants={VARIANTS.fadeUp} className="relative p-10 md:p-14 bg-gradient-to-br from-amber-500/10 dark:from-[#fbbf24]/10 to-transparent border border-amber-500/20 dark:border-[#fbbf24]/20 rounded-[2.5rem] backdrop-blur-xl shadow-xl dark:shadow-[inset_0_1px_0_0_rgba(251,191,36,0.1)] overflow-hidden transition-colors duration-500">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-500/20 blur-[80px] rounded-full pointer-events-none"></div>
            
            <div className="flex items-center gap-3 mb-8 relative z-10">
              <Gift className="w-8 h-8 text-amber-600 dark:text-[#fbbf24]" />
              <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white transition-colors">Bonus Add-ons</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4 relative z-10">
              {[
                "Custom report tailored to YOUR business",
                "Monthly update option (stay ahead continuously)",
                "1:1 strategy call (premium tier)",
                "Execution guidance (if needed)"
              ].map((bonus, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-white/60 dark:bg-black/40 p-4 rounded-xl border border-black/5 dark:border-white/[0.05] shadow-sm transition-colors">
                  <div className="w-2 h-2 rounded-full bg-[#fbbf24] shadow-[0_0_10px_rgba(251,191,36,0.5)] shrink-0"></div>
                  <span className="text-zinc-800 dark:text-zinc-200 font-semibold text-sm transition-colors">{bonus}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* ================= CTA & POSITIONING ================= */}
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: false, margin: "-50px" }} variants={VARIANTS.container}
          className="text-center pb-10"
        >
          <motion.div variants={VARIANTS.zoomIn} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Link to="/pricing">
              <Button className="w-full sm:w-auto bg-[#fbbf24] text-black hover:bg-[#fbbf24]/90 font-bold rounded-2xl px-10 h-14 text-lg shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:scale-105 transition-all duration-300 flex items-center gap-2">
                <Zap className="w-5 h-5 fill-current" /> Get My Intelligence Report
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" className="w-full sm:w-auto bg-black/5 dark:bg-white/[0.03] border-black/10 dark:border-white/[0.1] text-zinc-900 dark:text-white hover:bg-black/10 dark:hover:bg-white/[0.08] hover:text-[#fbbf24] dark:hover:text-[#fbbf24] font-bold rounded-2xl px-10 h-14 text-lg transition-all duration-300">
                Unlock Insights Now <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>

          <motion.div variants={VARIANTS.fadeUp} className="max-w-2xl mx-auto border-t border-black/10 dark:border-white/[0.08] pt-12 transition-colors">
            <h3 className="text-2xl md:text-3xl font-extrabold text-zinc-400 dark:text-zinc-500 leading-snug tracking-tight transition-colors">
              “Anyone can access data. <br/>
              <span className="text-zinc-900 dark:text-white">Very few can turn it into decisions that make money.</span>”
            </h3>
          </motion.div>
        </motion.div>

      </div>
    </div>
  );
};

export default Intelligence;