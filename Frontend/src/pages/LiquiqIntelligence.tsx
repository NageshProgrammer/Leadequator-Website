import React, { useState, useRef } from "react";
import { motion, useScroll, useTransform, useMotionTemplate, useMotionValue } from "framer-motion";
import { 
  ArrowRight, AlertTriangle, BrainCircuit, TrendingUp, Users, Target, 
  Lightbulb, PieChart, Zap, ShieldCheck, CheckCircle2, BarChart3, 
  Eye, LineChart, Briefcase, MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/* ====================================================================================
   1. CINEMATIC ANIMATION VARIANTS
==================================================================================== */
const cinematicEase = [0.22, 2, 0.36, 2]; // Premium Apple-style ease-out

const VARIANTS = {
  container: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
  },
  fadeUp: {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: cinematicEase } }
  },
  fadeRight: {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0, transition: { duration: 1, ease: cinematicEase } }
  },
  fadeLeft: {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0, transition: { duration: 1, ease: cinematicEase } }
  },
  scaleUp: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 1.2, ease: cinematicEase } }
  }
};

/* ====================================================================================
   2. PREMIUM ANIMATION COMPONENTS
==================================================================================== */

// --- A. Ambient Particle System (Tiny drifting orbs) ---
const AmbientParticles = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, Math.random() * -300 - 100],
            x: [0, Math.random() * 100 - 50],
            opacity: [0, Math.random() * 0.6 + 0.2, 0],
            scale: [0, Math.random() * 1.5 + 0.5, 0]
          }}
          transition={{
            duration: Math.random() * 15 + 15, // Slow drift between 15-30 seconds
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 10 // Stagger start times
          }}
          className="absolute bg-[#fbbf24] rounded-full blur-[2px]"
          style={{ 
            top: `${Math.random() * 100}%`, 
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 4 + 2}px`,
            height: `${Math.random() * 4 + 2}px`
          }}
        />
      ))}
    </div>
  );
};

// --- B. Masked Text Reveal (Text slides up from an invisible line) ---
const MaskRevealText = ({ text, className }: { text: string; className?: string }) => {
  return (
    <div className={`overflow-hidden inline-block ${className}`}>
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: false, margin: "-50px" }}
        transition={{ duration: 1, ease: cinematicEase }}
      >
        {text}
      </motion.div>
    </div>
  );
};

// --- C. Spotlight Hover Card (Premium dynamic lighting) ---
const SpotlightCard = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = ({ currentTarget, clientX, clientY }: React.MouseEvent) => {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  return (
    <motion.div
      variants={VARIANTS.fadeUp}
      onMouseMove={handleMouseMove}
      className={`group relative overflow-hidden ${className}`}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-500 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              400px circle at ${mouseX}px ${mouseY}px,
              rgba(251, 191, 36, 0.15),
              transparent 80%
            )
          `,
        }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
};

// --- D. Scroll Progress Line (Draws down the page) ---
const ScrollLine = () => {
  const { scrollYProgress } = useScroll();
  const height = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  
  return (
    <div className="absolute left-4 md:left-10 top-0 bottom-0 w-[1px] bg-white/[0.05] z-0 hidden sm:block">
      <motion.div 
        style={{ height }} 
        className="w-full bg-gradient-to-b from-[#fbbf24] to-transparent shadow-[0_0_10px_#fbbf24]"
      />
    </div>
  );
};

/* ====================================================================================
   3. STYLES
==================================================================================== */
const glassCardStyle = "bg-[#050505]/40 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8px_30px_rgb(0,0,0,0.12),inset_0_1px_0_0_rgba(255,255,255,0.05)] rounded-[2rem]";
const inputStyle = "bg-white/[0.02] border-white/[0.08] text-white focus-visible:ring-[#fbbf24]/30 focus-visible:border-[#fbbf24]/50 rounded-xl h-14 transition-all placeholder:text-zinc-600";
const labelStyle = "text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest mb-2 block ml-1";

/* ====================================================================================
   4. MAIN PAGE
==================================================================================== */
export default function LiquidIntelligence() {
  const [formData, setFormData] = useState({
    name: "", email: "", company: "", role: "", industry: "", question: ""
  });

  // Parallax for Hero
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 1000], [0, 250]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const scrollToForm = () => document.getElementById("briefing-form")?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="min-h-screen bg-background text-white selection:bg-[#fbbf24] selection:text-black overflow-hidden font-sans relative">
      
      {/* Background Ambient Glow & Particles */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100vw] h-[60vh] bg-[radial-gradient(ellipse_at_top,_rgba(251,191,36,0.08)_0%,_rgba(0,0,0,0)_70%)]" />
      </div>
      <AmbientParticles />
      <ScrollLine />

      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-[90vh] flex flex-col justify-center pt-32 pb-20 px-4 z-10 overflow-hidden">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="max-w-5xl mx-auto text-center z-10">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease: cinematicEase }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#fbbf24]/10 border border-[#fbbf24]/20 text-[#fbbf24] text-xs font-bold uppercase tracking-widest mb-8 shadow-[0_0_20px_rgba(251,191,36,0.1)]"
          >
            <BrainCircuit className="w-4 h-4" /> Liquid Intelligence Reports
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1] flex flex-col items-center">
            <MaskRevealText text="Make Strategic Decisions With" />
            <MaskRevealText 
              text="Intelligence, Not Assumptions" 
              className="text-transparent bg-clip-text bg-gradient-to-r from-[#fbbf24] to-amber-600 drop-shadow-[0_0_20px_rgba(251,191,36,0.2)] mt-2"
            />
          </h1>

          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5, delay: 0.4 }} 
            className="text-lg md:text-2xl text-zinc-300 mb-12 max-w-4xl mx-auto leading-relaxed font-medium"
          >
            Leadership teams today operate in markets that change faster than traditional research can track. LeadEquator’s Liquid Intelligence Reports provide deep strategic intelligence across markets, competitors, and emerging demand signals.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.6, ease: cinematicEase }} 
            className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-8"
          >
            <Button onClick={scrollToForm} className="w-full sm:w-auto h-14 px-8 text-base bg-[#fbbf24] text-black hover:bg-[#fbbf24]/90 font-extrabold rounded-xl shadow-[0_0_25px_rgba(251,191,36,0.15)] transition-all">
              Request Intelligence Briefing <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button variant="outline" className="w-full sm:w-auto h-14 px-8 text-base bg-white/[0.03] border-white/[0.1] text-white hover:bg-white/[0.08] font-extrabold rounded-xl transition-all">
              Get Custom Snapshot
            </Button>
          </motion.div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.8 }} className="text-xs md:text-sm text-zinc-500 font-medium max-w-2xl mx-auto">
            Designed for strategy leaders evaluating market expansion, competitor positioning, investment opportunities, and product innovation.
          </motion.p>
        </motion.div>
      </section>

      {/* ================= THE PROBLEM ================= */}
      <section className="py-32 px-4 relative border-t border-white/[0.05] bg-gradient-to-b from-transparent to-zinc-950/50 z-10">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, margin: "-100px" }} variants={VARIANTS.container} className="max-w-6xl mx-auto">
          
          <div className="text-center mb-20">
            <motion.h2 variants={VARIANTS.fadeUp} className="text-3xl md:text-5xl font-bold mb-6">Most Strategic Decisions Fail For One Reason</motion.h2>
            <motion.p variants={VARIANTS.fadeUp} className="text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed">
              Not because of poor execution. But because the initial market assumptions were <span className="text-red-400 font-semibold border-b border-red-400/30 pb-0.5">incomplete or outdated.</span>
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <PieChart />, text: "Fragmented market intelligence" },
              { icon: <Target />, text: "Limited visibility into emerging competitors" },
              { icon: <Users />, text: "Unclear demand signals from real buyers" },
              { icon: <AlertTriangle />, text: "Delayed research insights that arrive too late" }
            ].map((item, i) => (
              <SpotlightCard key={i} className={`p-8 ${glassCardStyle} border-red-500/10 transition-colors`}>
                <div className="text-red-400 mb-5 bg-red-400/10 w-14 h-14 rounded-2xl flex items-center justify-center">
                  {React.cloneElement(item.icon, { className: "w-7 h-7" })}
                </div>
                <p className="text-zinc-200 font-semibold text-lg leading-snug">{item.text}</p>
              </SpotlightCard>
            ))}
          </div>

          <motion.div variants={VARIANTS.scaleUp} className="mt-24 text-center">
            <div className="bg-white/[0.03] border border-white/[0.08] inline-block px-10 py-8 rounded-[2rem] shadow-2xl backdrop-blur-md relative overflow-hidden">
              <p className="text-2xl font-bold text-white mb-3">By the time traditional research reports are completed, the market has already evolved.</p>
              <p className="text-2xl font-black text-[#fbbf24]">Organizations need continuous intelligence, not static reports.</p>
            </div>
          </motion.div>

        </motion.div>
      </section>

      {/* ================= INTRODUCING LIQUID INTELLIGENCE ================= */}
      <section className="py-32 px-4 relative z-10">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, margin: "-100px" }} variants={VARIANTS.container} className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            
            <motion.div variants={VARIANTS.fadeRight} className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
                Introducing <span className="text-[#fbbf24] drop-shadow-[0_0_15px_rgba(251,191,36,0.2)]">Liquid Intelligence</span>
              </h2>
              <p className="text-xl text-zinc-400 leading-relaxed font-medium">
                A modern intelligence framework designed for leadership teams making high-impact strategic decisions.
              </p>
              <p className="text-lg text-zinc-500 leading-relaxed">
                Instead of static reports, Liquid Intelligence Reports combine multiple layers of strategic analysis to create a comprehensive and continuously evolving understanding of the market.
              </p>
              <div className="p-6 rounded-2xl bg-[#fbbf24]/10 border border-[#fbbf24]/20 shadow-[inset_0_1px_0_0_rgba(251,191,36,0.1)] inline-block relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#fbbf24]" />
                <p className="text-[#fbbf24] font-bold text-lg pl-2">Identify opportunities and risks earlier than competitors.</p>
              </div>
            </motion.div>

            <motion.div variants={VARIANTS.fadeLeft} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { icon: <LineChart />, text: "Market trend analysis" },
                { icon: <Target />, text: "Competitive landscape intelligence" },
                { icon: <Briefcase />, text: "Investment & funding activity" },
                { icon: <MessageSquare />, text: "Customer sentiment signals" },
                { icon: <Users />, text: "Buyer behavior analysis" },
                { icon: <Zap />, text: "Demand pattern identification" },
              ].map((item, i) => (
                <SpotlightCard key={i} className={`p-5 flex items-center gap-4 ${glassCardStyle}`}>
                  <div className="text-[#fbbf24] bg-[#fbbf24]/10 p-2.5 rounded-xl shadow-inner">{item.icon}</div>
                  <span className="font-bold text-sm tracking-tight">{item.text}</span>
                </SpotlightCard>
              ))}
            </motion.div>

          </div>
        </motion.div>
      </section>

      {/* ================= PROPRIETARY ENGINE (BENTO GRID) ================= */}
      <section className="py-32 px-4 relative border-t border-white/[0.05] bg-zinc-950/40 z-10">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, margin: "-100px" }} variants={VARIANTS.container} className="max-w-6xl mx-auto">
          
          <div className="text-center mb-20">
            <motion.h2 variants={VARIANTS.fadeUp} className="text-3xl md:text-5xl font-bold mb-6">Powered by the Liquid Intelligence Engine™</motion.h2>
            <motion.p variants={VARIANTS.fadeUp} className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Most research firms rely on static datasets. We use a proprietary model designed to analyze multiple layers of real-world market signals.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <motion.div variants={VARIANTS.fadeUp} className="md:col-span-2">
              <SpotlightCard className={`h-full p-10 ${glassCardStyle}`}>
                <BarChart3 className="w-12 h-12 text-[#fbbf24] mb-6" />
                <h3 className="text-3xl font-extrabold mb-4 text-white">Market Data Intelligence</h3>
                <p className="text-lg text-zinc-400 font-medium">Structured analysis of market size, growth trajectories, regulatory shifts, and macro industry dynamics mapped in real-time.</p>
              </SpotlightCard>
            </motion.div>
            
            {[
              { title: "Competitive Intelligence", desc: "Comprehensive mapping of established players and emerging disruptors.", icon: <Target className="w-10 h-10 text-[#fbbf24] mb-5" /> },
              { title: "Investment Intelligence", desc: "Tracking venture capital activity and M&A to identify market momentum.", icon: <TrendingUp className="w-10 h-10 text-[#fbbf24] mb-5" /> },
              { title: "Buyer Intelligence", desc: "Deep analysis of behavioral decision patterns across entire industries.", icon: <Users className="w-10 h-10 text-[#fbbf24] mb-5" /> },
              { title: "Demand Signals", desc: "Detection of early signals indicating emerging demand trends.", icon: <Zap className="w-10 h-10 text-[#fbbf24] mb-5" /> }
            ].map((feature, i) => (
              <SpotlightCard key={i} className={`h-full p-8 ${glassCardStyle}`}>
                {feature.icon}
                <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{feature.desc}</p>
              </SpotlightCard>
            ))}
          </div>

        </motion.div>
      </section>

      {/* ================= CORE CAPABILITIES ================= */}
      <section className="py-32 px-4 relative z-10 overflow-hidden">
        <div className="max-w-6xl mx-auto space-y-40">
          
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, margin: "-100px" }} variants={VARIANTS.container} className="grid md:grid-cols-2 gap-16 items-center relative">
            <motion.div variants={VARIANTS.fadeRight} className="order-2 md:order-1 relative">
              <SpotlightCard className={`p-10 ${glassCardStyle}`}>
                <ul className="space-y-6">
                  {["How customers perceive existing solutions", "Pain points expressed across digital ecosystems", "Shifts in customer expectations", "Perception gaps within the market", "Early signals of changing demand patterns"].map((item, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <div className="bg-[#fbbf24]/20 p-1.5 rounded-full shrink-0"><CheckCircle2 className="w-5 h-5 text-[#fbbf24]" /></div>
                      <span className="text-zinc-200 font-medium text-lg leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </SpotlightCard>
            </motion.div>
            <motion.div variants={VARIANTS.fadeLeft} className="order-1 md:order-2 space-y-6">
              <div className="w-16 h-16 bg-[#fbbf24]/10 border border-[#fbbf24]/20 rounded-2xl flex items-center justify-center shadow-inner">
                <Eye className="w-8 h-8 text-[#fbbf24]" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold">Real Market Sentiment Analysis</h2>
              <p className="text-2xl text-[#fbbf24] font-semibold tracking-tight">Understand What The Market Actually Thinks</p>
              <p className="text-zinc-400 leading-relaxed text-lg">
                Markets are shaped not only by data — but also by perception and sentiment. LeadEquator analyzes large-scale digital market conversations to understand how customers, buyers, and industry stakeholders perceive specific industries.
              </p>
            </motion.div>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, margin: "-100px" }} variants={VARIANTS.container} className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div variants={VARIANTS.fadeRight} className="space-y-6">
              <div className="w-16 h-16 bg-[#fbbf24]/10 border border-[#fbbf24]/20 rounded-2xl flex items-center justify-center shadow-inner">
                <BrainCircuit className="w-8 h-8 text-[#fbbf24]" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold">Deep Buyer <br/>Intelligence</h2>
              <p className="text-zinc-400 leading-relaxed text-lg">
                Understanding the buyer is often the most overlooked aspect of strategic decision-making. LeadEquator analyzes audience signals and behavioral patterns to reveal exactly what drives purchasing decisions.
              </p>
            </motion.div>
            <motion.div variants={VARIANTS.fadeLeft} className="relative">
              <SpotlightCard className={`p-10 ${glassCardStyle}`}>
                <ul className="space-y-6">
                  {["Who the real buyers are in a given market", "What problems they are actively discussing", "Which capabilities they prioritize when selecting solutions", "Where dissatisfaction exists with current offerings"].map((item, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <div className="bg-[#fbbf24]/20 p-1.5 rounded-full shrink-0"><CheckCircle2 className="w-5 h-5 text-[#fbbf24]" /></div>
                      <span className="text-zinc-200 font-medium text-lg leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </SpotlightCard>
            </motion.div>
          </motion.div>

        </div>
      </section>

      {/* ================= USE CASES ================= */}
      <section className="py-32 px-4 relative border-t border-white/[0.05] bg-black z-10">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, margin: "-100px" }} variants={VARIANTS.container} className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-20">
          
          <motion.div variants={VARIANTS.fadeRight}>
            <h2 className="text-4xl font-extrabold mb-6">How Enterprise Leaders Use It</h2>
            <p className="text-zinc-400 text-lg mb-10 leading-relaxed">Liquid Intelligence Reports support leadership teams when evaluating and deploying capital across major strategic vectors:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {["Market entry opportunities", "Competitive positioning strategies", "Product expansion initiatives", "Strategic partnerships", "Mergers and acquisitions", "Long-term investment decisions"].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                  <ShieldCheck className="w-6 h-6 text-[#fbbf24] shrink-0" />
                  <span className="text-sm font-bold tracking-tight">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={VARIANTS.fadeLeft}>
            <h2 className="text-4xl font-extrabold mb-6">Why LeadEquator?</h2>
            <p className="text-zinc-400 text-lg mb-10 leading-relaxed">Traditional research reports are static. Consulting engagements take months. We provide the intelligence layer in between.</p>
            <SpotlightCard className={`p-10 ${glassCardStyle} bg-gradient-to-br from-[#fbbf24]/5 to-transparent border-[#fbbf24]/20`}>
              <ul className="space-y-6">
                {["Faster access to actionable intelligence", "Real-time market sentiment insights", "Deep buyer behavior analysis", "Forward-looking demand signals", "Strategic opportunity mapping"].map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className="bg-black/50 p-1.5 rounded-full shrink-0 border border-[#fbbf24]/30"><CheckCircle2 className="w-5 h-5 text-[#fbbf24]" /></div>
                    <span className="text-white font-bold text-lg">{item}</span>
                  </li>
                ))}
              </ul>
            </SpotlightCard>
          </motion.div>

        </motion.div>
      </section>

      {/* ================= FINAL CTA & FORM ================= */}
      <section id="briefing-form" className="py-32 px-4 relative z-10 bg-zinc-950/80">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, margin: "-100px" }} variants={VARIANTS.container} className="max-w-6xl mx-auto">
          
          <div className={`p-10 md:p-16 ${glassCardStyle} border-[#fbbf24]/40 bg-gradient-to-br from-black to-[#fbbf24]/5 overflow-hidden relative shadow-[0_30px_100px_rgba(0,0,0,0.8)]`}>
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#fbbf24]/5 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="grid lg:grid-cols-2 gap-16 relative z-10">
              
              <motion.div variants={VARIANTS.fadeRight} className="flex flex-col justify-center">
                <h2 className="text-4xl md:text-6xl font-black mb-8 leading-[1.1]">
                  Request Your Industry <br/>
                  <span className="text-[#fbbf24] drop-shadow-md">Intelligence Briefing</span>
                </h2>
                <p className="text-xl text-zinc-300 mb-10 leading-relaxed font-medium">
                  See how LeadEquator’s Liquid Intelligence Engine analyzes your industry, competitors, and buyer signals to uncover strategic opportunities.
                </p>
                <div className="space-y-6 mb-10 bg-black/40 p-6 rounded-3xl border border-white/[0.05]">
                  <p className="font-extrabold text-[#fbbf24] uppercase tracking-widest text-xs">Your briefing will include:</p>
                  <ul className="space-y-4 text-zinc-200 font-medium">
                    <li className="flex items-center gap-4"><div className="p-2 rounded-lg bg-white/5"><Target className="w-5 h-5 text-[#fbbf24]"/></div> Market intelligence overview</li>
                    <li className="flex items-center gap-4"><div className="p-2 rounded-lg bg-white/5"><PieChart className="w-5 h-5 text-[#fbbf24]"/></div> Key competitor landscape insights</li>
                    <li className="flex items-center gap-4"><div className="p-2 rounded-lg bg-white/5"><TrendingUp className="w-5 h-5 text-[#fbbf24]"/></div> Emerging demand signals</li>
                  </ul>
                </div>
                <div className="flex items-center gap-4 pl-2 border-l-4 border-[#fbbf24]">
                  <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-700">
                    <Users className="w-6 h-6 text-zinc-400" />
                  </div>
                  <p className="text-zinc-400 text-sm font-semibold italic leading-relaxed">
                    A LeadEquator strategist will walk you through the insights in a 15-minute briefing.
                  </p>
                </div>
              </motion.div>

              <motion.div variants={VARIANTS.scaleUp}>
                <form onSubmit={handleSubmit} className="space-y-6 bg-[#050505]/80 backdrop-blur-2xl p-8 md:p-10 rounded-[2rem] border border-white/[0.1] shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#fbbf24] to-transparent" />
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className={labelStyle}>Full Name</Label>
                      <Input required placeholder="John Doe" className={inputStyle} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label className={labelStyle}>Work Email</Label>
                      <Input required type="email" placeholder="john@company.com" className={inputStyle} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className={labelStyle}>Company</Label>
                      <Input required placeholder="Acme Corp" className={inputStyle} value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label className={labelStyle}>Role / Title</Label>
                      <Input required placeholder="CEO, Strategy..." className={inputStyle} value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className={labelStyle}>Industry</Label>
                    <Input required placeholder="e.g. SaaS, Finance" className={inputStyle} value={formData.industry} onChange={e => setFormData({...formData, industry: e.target.value})} />
                  </div>

                  <div className="space-y-2">
                    <Label className={labelStyle}>Primary Strategic Question (Optional)</Label>
                    <textarea rows={3} placeholder="What specific market shift are you evaluating?" className={`${inputStyle} h-auto py-4 w-full resize-none`} value={formData.question} onChange={e => setFormData({...formData, question: e.target.value})} />
                  </div>

                  <div className="pt-2">
                    <Button className="w-full h-16 text-lg font-black bg-[#fbbf24] text-black hover:bg-[#fbbf24]/90 rounded-2xl shadow-[0_0_20px_rgba(251,191,36,0.3)] transition-all">
                      Get My Intelligence Briefing
                    </Button>
                  </div>
                  
                  <p className="text-center text-[10px] text-zinc-500 uppercase tracking-widest font-extrabold mt-4">
                    Your information is strictly confidential.
                  </p>
                </form>
              </motion.div>

            </div>
          </div>
        </motion.div>
      </section>

      {/* ================= FINAL FOOTER ================= */}
      <section className="py-24 px-4 text-center relative border-t border-white/[0.05] z-10 bg-black">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, margin: "-50px" }} variants={VARIANTS.container} className="max-w-4xl mx-auto">
          <motion.h2 variants={VARIANTS.fadeUp} className="text-3xl md:text-5xl font-extrabold mb-8 tracking-tight">Strategic Decisions Require <br/><span className="text-[#fbbf24]">Strategic Intelligence</span></motion.h2>
          <motion.p variants={VARIANTS.fadeUp} className="text-zinc-400 mb-16 text-lg md:text-xl leading-relaxed font-medium">
            In rapidly evolving industries, the difference between market leaders and followers often comes down to who understands the market first. LeadEquator provides the intelligence layer that enables organizations to anticipate shifts and act with confidence.
          </motion.p>
          <motion.div variants={VARIANTS.scaleUp} className="inline-flex flex-col items-center bg-white/[0.02] border border-white/[0.05] py-8 px-16 rounded-[2rem] shadow-2xl">
            <div className="text-4xl font-black tracking-tighter mb-3 flex items-center gap-2 drop-shadow-xl">
              <span className="text-white">Lead</span><span className="text-[#fbbf24]">Equator</span>
            </div>
            <p className="text-xs uppercase tracking-[0.4em] text-zinc-500 font-extrabold">Strategic Intelligence</p>
          </motion.div>
        </motion.div>
      </section>

    </div>
  );
}