import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Cpu,
  TrendingUp,
  LineChart,
  Scale,
  Briefcase,
  Rocket,
  Loader2,
  Calendar,
  Clock,
  ChevronRight,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

/* ==========================================
   MOCK DATA
========================================== */
const WHAT_YOU_GET = [
  {
    title: "AI & Technology Insights",
    icon: <Cpu className="w-5 h-5 text-[#fbbf24]" />,
    desc: "Understand the tools shaping the future.",
  },
  {
    title: "Business & Marketing Strategies",
    icon: <TrendingUp className="w-5 h-5 text-[#fbbf24]" />,
    desc: "Actionable playbooks to scale revenue.",
  },
  {
    title: "Market Trends & Opportunities",
    icon: <LineChart className="w-5 h-5 text-[#fbbf24]" />,
    desc: "Spot the next big wave early.",
  },
  {
    title: "Demand vs Supply Analysis",
    icon: <Scale className="w-5 h-5 text-[#fbbf24]" />,
    desc: "Data-driven breakdowns of market gaps.",
  },
  {
    title: "Career & Skill Insights",
    icon: <Briefcase className="w-5 h-5 text-[#fbbf24]" />,
    desc: "Stay relevant in an automated world.",
  },
  {
    title: "Startup & Growth Lessons",
    icon: <Rocket className="w-5 h-5 text-[#fbbf24]" />,
    desc: "Real case studies from scaling businesses.",
  },
];

const AUDIENCES = [
  "Business Owners",
  "Entrepreneurs",
  "Professionals",
  "Students",
  "Creators",
];

const RECENT_POSTS = [
  {
    id: 1,
    title: "The AI Tools Replacing Junior Marketers in 2026",
    excerpt:
      "Why traditional marketing agencies are struggling to keep up with autonomous AI agents, and how you can adapt your skill set.",
    date: "Mar 4, 2026",
    readTime: "5 min read",
    tag: "AI & Tech",
  },
  {
    id: 2,
    title: "How to Build an Intent-Driven Lead Engine",
    excerpt:
      "Stop paying for clicks. Start scraping intent. A step-by-step breakdown of how modern B2B startups are acquiring users for free.",
    date: "Feb 25, 2026",
    readTime: "7 min read",
    tag: "Growth",
  },
  {
    id: 3,
    title: "Demand vs Supply: The Hidden SaaS Opportunities",
    excerpt:
      "We analyzed 10,000 Reddit posts to find exactly what software business owners are begging for right now.",
    date: "Feb 18, 2026",
    readTime: "6 min read",
    tag: "Market Trends",
  },
];

/* ==========================================
   LIQUID GLASS BACKGROUND COMPONENT
========================================== */
const LiquidBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-background">
    <motion.div
      animate={{
        x: [0, 150, -100, 0],
        y: [0, -100, 150, 0],
        scale: [1, 1.2, 0.8, 1],
      }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="absolute top-[10%] left-[20%] w-[600px] h-[600px] bg-[#fbbf24]/10 rounded-full blur-[120px]"
    />
    <motion.div
      animate={{
        x: [0, -200, 100, 0],
        y: [0, 150, -150, 0],
        scale: [1, 0.9, 1.3, 1],
      }}
      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      className="absolute bottom-[10%] right-[10%] w-[700px] h-[700px] bg-amber-600/10 rounded-full blur-[150px]"
    />
    <motion.div
      animate={{
        x: [0, 100, -150, 0],
        y: [0, 200, -100, 0],
        scale: [1, 1.4, 0.9, 1],
      }}
      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      className="absolute top-[40%] left-[50%] w-[500px] h-[500px] bg-yellow-500/[0.08] rounded-full blur-[100px]"
    />
  </div>
);

/* ==========================================
   MAIN COMPONENT
========================================== */
export default function Newsletter1() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
      
      const response = await fetch(`${API_BASE}/api/newsletter/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Failed to subscribe");
      }

      setIsSuccess(true);
      setEmail(""); // Clear the input
    } catch (error) {
      console.error("Subscription error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // The core CSS that creates the "Liquid Glass" effect
  const liquidGlassStyle = `
    bg-black/20 
    backdrop-blur-[40px] 
    border border-white/[0.08] 
    shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.05)]
  `;

  return (
    <div className="min-h-screen text-white selection:bg-[#fbbf24]/30 relative pb-24 font-sans">
      {/* Animated Liquid Background */}
      <LiquidBackground />

      {/* TOP NAVIGATION */}
      <nav className="container mx-auto px-6 py-6 max-w-[1000px] relative z-20 flex justify-between items-center">
        <div className="font-extrabold text-xl tracking-tight flex items-center gap-2 drop-shadow-md">
          <div className="w-8 h-8 rounded-full  flex items-center justify-center text-black shadow-lg">
            <img
              src="/leadequator_logo.png"
              alt="Leadequator Logo"
              className="w-10 h-10 object-contain group-hover:scale-105 transition-transform duration-400 ease-out drop-shadow-lg"
            />
          </div>
          <div className="flex items-center tracking-tight">
            <span className="text-white">Lead</span>
            <span className="text-[#fbbf24]">equator</span>
          </div>
        </div>
        <Button
          variant="ghost"
          className="text-white hover:bg-[#fbbf24] transition-colors"
          onClick={() => (window.location.href = "/")}
        >
          Back to Main Site
        </Button>
      </nav>

      <main className="container mx-auto px-4 max-w-[900px] relative z-10 pt-8 md:pt-12">
        {/* ==========================================
            HERO SECTION (Liquid Glass Subscribe Box)
        ========================================== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`${liquidGlassStyle} rounded-[2.5rem] p-8 md:p-12 mb-16 relative overflow-hidden group`}
        >
          {/* Subtle Top Border Highlight that follows the glass curve */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#fbbf24]/50 to-transparent opacity-50" />

          <div className="text-center mb-10">
            <Badge
              variant="outline"
              className="bg-[#fbbf24]/20 text-[#fbbf24] border-[#fbbf24]/40 uppercase tracking-widest text-[10px] font-bold mb-6 shadow-[inset_0_0_10px_rgba(251,191,36,0.2)]"
            >
              <Sparkles className="w-3 h-3 mr-1.5 inline" /> The Official Newsletter
            </Badge>
            
            {/* UPDATED HEADLINE */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 drop-shadow-lg leading-tight">
              Understand AI, Business, and the Future — <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fbbf24] to-yellow-300">Before Everyone Else.</span>
            </h1>
            
            {/* UPDATED SUBHEADLINE */}
            <p className="text-lg md:text-xl font-medium text-zinc-300 max-w-3xl mx-auto drop-shadow-md leading-relaxed">
              Beyond Marketing is a weekly newsletter breaking down AI, business strategies, market trends, career opportunities, and emerging industries in simple, practical insights.
            </p>
          </div>

          <div className="max-w-md mx-auto mb-16">
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center text-center p-6 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl backdrop-blur-md shadow-inner"
                >
                  <CheckCircle2 className="w-12 h-12 text-emerald-300 mb-3 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                  <h3 className="text-xl font-bold text-white mb-1">
                    You're on the list!
                  </h3>
                  <p className="text-sm text-emerald-100">
                    Check your inbox to confirm your subscription.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubscribe}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col gap-3 relative z-10"
                >
                  <div className="relative group/input">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/70 group-focus-within/input:text-[#fbbf24] transition-colors" />
                    {/* UPDATED INPUT PLACEHOLDER */}
                    <Input
                      required
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 h-14 bg-black/40 border-white/[0.2] text-white text-base focus-visible:ring-[#fbbf24]/60 focus-visible:border-[#fbbf24]/80 rounded-xl transition-all shadow-inner placeholder:text-white/50"
                    />
                  </div>
                  {/* UPDATED BUTTON TEXT */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-14 text-base bg-gradient-to-r from-[#fbbf24] to-amber-400 text-black hover:opacity-90 font-bold rounded-xl shadow-[0_0_20px_rgba(251,191,36,0.4)] transition-all active:scale-[0.98]"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />{" "}
                        Subscribing...
                      </>
                    ) : (
                      <>
                        Subscribe Free{" "}
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                  
                  {/* UPDATED MICRO TEXT */}
                  <div className="flex items-center justify-center gap-2 mt-2 text-xs text-white/80 font-medium">
                    <ShieldCheck className="w-4 h-4 text-emerald-300" /> 1 powerful insight every week. No spam.
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          <div className="mb-14 relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px flex-1 bg-white/[0.15]" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-white">
                What You'll Get
              </h3>
              <div className="h-px flex-1 bg-white/[0.15]" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {WHAT_YOU_GET.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.05] border border-white/[0.1] hover:bg-white/[0.1] hover:border-white/[0.2] transition-colors"
                >
                  <div className="p-2.5 bg-[#fbbf24]/20 rounded-xl shrink-0 shadow-inner">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">
                      {item.title}
                    </h4>
                    <p className="text-xs text-white/70 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px flex-1 bg-white/[0.15]" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-white">
                Who It's For
              </h3>
              <div className="h-px flex-1 bg-white/[0.15]" />
            </div>
            <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-6">
              {AUDIENCES.map((audience, i) => (
                <Badge
                  key={i}
                  variant="outline"
                  className="px-4 py-2 bg-black/30 backdrop-blur-md border-white/[0.2] hover:border-[#fbbf24] hover:bg-[#fbbf24]/20 text-white transition-colors font-medium text-xs sm:text-sm rounded-full cursor-default"
                >
                  {audience}
                </Badge>
              ))}
            </div>
            <p className="text-center text-white/80 text-sm font-medium">
              ...and anyone who wants to{" "}
              <span className="text-[#fbbf24] font-bold drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]">
                stay ahead of the curve.
              </span>
            </p>
          </div>
        </motion.div>

        {/* ==========================================
            NEW SECTION: THE PROBLEM / WHY SUBSCRIBE
        ========================================== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-20 text-center"
        >
           <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight drop-shadow-md mb-8">
              Why Thousands Are Reading <span className="text-[#fbbf24]">Beyond Marketing</span>
           </h2>
           <p className="text-xl text-zinc-300 mb-8 max-w-2xl mx-auto">
             Because the world is changing faster than most people realize.
           </p>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto mb-12 text-left">
              <div className="bg-white/[0.03] border border-white/[0.05] p-5 rounded-2xl flex items-center gap-4">
                 <div className="w-2 h-2 rounded-full bg-[#fbbf24] animate-pulse" />
                 <span className="font-medium text-zinc-200">AI is reshaping industries</span>
              </div>
              <div className="bg-white/[0.03] border border-white/[0.05] p-5 rounded-2xl flex items-center gap-4">
                 <div className="w-2 h-2 rounded-full bg-[#fbbf24] animate-pulse" />
                 <span className="font-medium text-zinc-200">New business models are emerging</span>
              </div>
              <div className="bg-white/[0.03] border border-white/[0.05] p-5 rounded-2xl flex items-center gap-4">
                 <div className="w-2 h-2 rounded-full bg-[#fbbf24] animate-pulse" />
                 <span className="font-medium text-zinc-200">Markets are shifting rapidly</span>
              </div>
              <div className="bg-white/[0.03] border border-white/[0.05] p-5 rounded-2xl flex items-center gap-4">
                 <div className="w-2 h-2 rounded-full bg-[#fbbf24] animate-pulse" />
                 <span className="font-medium text-zinc-200">Careers are evolving</span>
              </div>
           </div>

           <div className={`${liquidGlassStyle} rounded-3xl p-8 max-w-3xl mx-auto relative overflow-hidden`}>
              <div className="absolute top-0 left-0 w-2 h-full bg-red-500/80" />
              <h3 className="text-2xl font-bold text-white mb-2">The problem?</h3>
              <p className="text-zinc-400 text-lg mb-6">Most people hear about these shifts <span className="text-red-400 font-semibold">too late.</span></p>
              
              <div className="h-px w-full bg-white/[0.1] my-6" />

              <h3 className="text-2xl font-bold text-[#fbbf24] mb-2 flex justify-center items-center gap-2">
                 <Zap className="w-6 h-6" /> The Solution
              </h3>
              <p className="text-zinc-200 text-lg font-medium">Beyond Marketing helps you see them early.</p>
           </div>
        </motion.div>

        {/* ==========================================
            RECENT EDITIONS (Article Archive)
        ========================================== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center justify-between mb-8 px-2">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight drop-shadow-md">
              Read Past <span className="text-[#fbbf24]">Editions</span>
            </h2>
            <Button
              variant="link"
              className="text-white/80 hover:text-white transition-colors pr-0"
            >
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <div className="space-y-5">
            {RECENT_POSTS.map((post) => (
              <div
                key={post.id}
                className={`${liquidGlassStyle} group p-6 md:p-8 rounded-3xl hover:bg-white/[0.08] hover:border-white/[0.2] hover:shadow-[0_12px_40px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.1)] transition-all duration-500 cursor-pointer`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <Badge
                    variant="secondary"
                    className="w-fit bg-black/50 text-white border border-white/[0.1] group-hover:border-[#fbbf24]/50 transition-colors"
                  >
                    {post.tag}
                  </Badge>
                  <div className="flex items-center gap-4 text-xs font-medium text-white/70">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> {post.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> {post.readTime}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl md:text-2xl font-bold mb-3 text-white group-hover:text-[#fbbf24] transition-colors leading-snug drop-shadow-sm">
                  {post.title}
                </h3>

                <p className="text-white/80 text-sm md:text-base leading-relaxed mb-6">
                  {post.excerpt}
                </p>

                <div className="flex items-center text-sm font-bold text-white group-hover:text-[#fbbf24] transition-colors">
                  Read Article{" "}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ==========================================
            FINAL BOTTOM CTA
        ========================================== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center py-12"
        >
           <h2 className="text-3xl font-extrabold mb-4">📩 Join the Beyond Marketing Newsletter</h2>
           <p className="text-zinc-400 mb-8 font-medium">Stay informed. Stay ahead.</p>
           <Button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="h-14 px-8 text-base bg-[#fbbf24] text-black hover:bg-[#fbbf24]/90 font-bold rounded-xl shadow-[0_0_20px_rgba(251,191,36,0.3)] transition-all active:scale-[0.98]"
            >
              Subscribe Free <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
        </motion.div>

      </main>
    </div>
  );
}