import { PointerHighlightDemo } from "@/[components]/pointer";
import { CardHoverEffectDemo } from "@/[components]/revenuecard";
import { TextGenerateEffectDemo } from "@/[components]/text-generate";
import { AuroraText } from "@/components/ui/aurora-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Globe } from "@/components/ui/globe";
import { HyperText } from "@/components/ui/hyper-text";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { MorphingText } from "@/components/ui/morphing-text";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { ShineBorder } from "@/components/ui/shine-border";
import { SparklesText } from "@/components/ui/sparkles-text";
import { motion } from "motion/react"; 
import {
  CheckCircle,
  MousePointerClick,
  ShieldAlert,
  TrendingUp,
  MessageSquare,
  Ban,
  Infinity,
  Shield,
} from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  // Data for Value Section
  const valueItems = [
    {
      icon: <TrendingUp className="w-6 h-6 text-amber-500" />,
      bigText: "3-5X",
      subText: "Higher Conversions",
      desc: "Trust-based engagement converts better than cold ads",
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-amber-500" />,
      bigText: "100%",
      subText: "Real Intent",
      desc: "Every lead is actively seeking solutions",
    },
    {
      icon: <Ban className="w-6 h-6 text-amber-500" />,
      bigText: "$0",
      subText: "Ad Spend",
      desc: "No bidding wars, no click fraud, no waste",
    },
    {
      icon: <Infinity className="w-6 h-6 text-amber-500" />,
      bigText: "∞",
      subText: "Organic Growth",
      desc: "Sustainable, compounding returns",
    },
  ];

  return (
    <div className="min-h-screen bg-black overflow-x-hidden">
      <ScrollProgress className="top-[65px]" />
      
      {/* =========================================================
          HERO SECTION
      ========================================================= */}
      <section className="bg-black text-white relative w-full h-screen min-h-[800px] overflow-hidden flex flex-col items-center justify-start pt-32">
        
        {/* --- LAYER 1: BACKGROUND GRADIENT --- */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

        {/* --- LAYER 2: GIANT TEXT ("LEAD EQUATOR") --- */}
        <motion.div 
          initial={{ x: "-50%", y: "-50%", opacity: 0 }}
          animate={{ 
            opacity: [0, 1, 1, 0] 
          }} 
          transition={{ 
            duration: 4, 
            times: [0, 0.2, 0.8, 1], 
            ease: "easeInOut" 
          }}
          // CHANGED: Made gradient significantly lighter (White -> Zinc-300 -> Zinc-400)
          className="absolute top-1/2 left-1/2 text-[12vw] font-black bg-gradient-to-br from-white via-zinc-300 to-zinc-400 bg-clip-text text-transparent whitespace-nowrap z-20 pointer-events-none select-none tracking-tighter"
        >
          LEADEQUATOR
        </motion.div>

        {/* --- LAYER 3: THE GLOBE --- */}
        <motion.div
          initial={{ x: "-50%", y: "100%", opacity: 0, filter: "blur(0px)", scale: 1.2 }}
          animate={{ 
            x: "-50%", 
            y: "0%", 
            opacity: 1, 
            scale: 1, 
            filter: "blur(2px)" 
          }} 
          transition={{ 
            y: { duration: 1.5, ease: "circOut" }, 
            opacity: { duration: 0.5 },
            scale: { delay: 3.5, duration: 1.0 }, 
            filter: { delay: 3.5, duration: 1.0 } 
          }}
          className="absolute bottom-[-75%] md:bottom-[-85%] left-1/2 w-full aspect-square z-10 pointer-events-none"
        >
          <Globe className="w-full h-full max-w-none" /> 
        </motion.div>
        
        {/* --- LAYER 4: MAIN CONTENT (Front) --- */}
        <motion.div 
          initial={{ opacity: 0, y: -50 }} 
          animate={{ opacity: 1, y: 0 }}   
          transition={{ delay: 3.8, duration: 0.8, ease: "easeOut" }} 
          className="max-w-5xl mx-auto text-center relative z-30 px-4"
        >
          {/* Introducing Label */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/80 border border-zinc-800 backdrop-blur-md mb-8">
            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
            <span className="text-zinc-300 text-sm font-medium">
              Introducing Organic Engagement Intelligence
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 sm:flex items-center justify-center gap-4 drop-shadow-2xl">
            Lead without{" "}
            <SparklesText>
              {" "}
              <AuroraText> Ads.</AuroraText>
            </SparklesText>
          </h1>

          {/* Subheadline */}
          <div className="text-xl md:text-2xl text-zinc-200 mb-8 max-w-3xl mx-auto drop-shadow-md">
            <TextGenerateEffectDemo />
          </div>

          {/* Feature Bullet Points */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-12 text-sm">
            <div className="flex items-center gap-2 bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm border border-white/5">
              <CheckCircle className="w-4 h-4 text-amber-500" />
              Detect buying intent
            </div>
            <div className="flex items-center gap-2 bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm border border-white/5">
              <MousePointerClick className="w-4 h-4 text-amber-500" />
              Engage early
            </div>
            <div className="flex items-center gap-2 bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm border border-white/5">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              100% compliant
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-20">
            <Link to="/pricing">
            <InteractiveHoverButton>
              <button>
              Start Finding Buyers Organically
              </button>
            </InteractiveHoverButton>
            </Link>
            <Link to="/working">
              <button className="bg-black/20 backdrop-blur-md text-white border border-zinc-700/50 px-8 py-4 rounded-full font-bold text-lg hover:border-amber-500 hover:text-amber-300 hover:bg-black/40 transition-all">
                See How It Works
              </button>
            </Link>
          </div>

          {/* Trusted By Section */}
          <div className="border-t border-white/10 pt-8 pb-4 relative z-10 bg-black/30 backdrop-blur-md rounded-xl max-w-4xl mx-auto">
            <p className="text-white/70 text-sm mb-6 uppercase tracking-widest font-bold">
              Trusted by growth teams at
            </p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-white font-bold text-lg">
              <span>Startups</span>
              <span>Agencies</span>
              <span>SaaS Companies</span>
              <span>Consultants</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Value Props Section */}
      <section className="py-16 bg-card relative z-30">
        <div className="container mx-auto px-4 ">
          <h2 className="text-4xl font-bold text-center md:flex mb-10 md:mb-4 justify-center gap-2">
            Turn Conversations Into{" "}
            <span className="text-primary">
              <MorphingText texts={["Revenue", "Sales", "Deals", "Profit"]} />
            </span>
          </h2>
          <div className="flex">
            <CardHoverEffectDemo />
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 flex items-center justify-center gap-4">
            From Noise to{" "}
            <span className="text-primary">
              <HyperText>Qualified Leads</HyperText>
            </span>
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Monitor",
                desc: "Track high-follower conversations across 5 platforms in real-time",
              },
              {
                step: "02",
                title: "Analyze",
                desc: "AI detects purchase intent and scores lead quality (0-100)",
              },
              {
                step: "03",
                title: "Engage",
                desc: "Generate contextual replies or auto-respond with brand voice",
              },
              {
                step: "04",
                title: "Convert",
                desc: "Qualified leads sync to CRM, track ROI and attribution",
              },
            ].map((item) => (
              <Card
                key={item.step}
                className="p-6 bg-card border-border relative overflow-hidden group"
              >
                <ShineBorder
                  shineColor={["#b45309", "#fbbf24", "#fde68a", "#d97706"]}
                />
                <div className="text-6xl font-bold text-primary/20 mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform" />
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          SECTION 2: THE VALUE (STATS) - UPDATED
      ========================================= */}
      <section className="py-24 px-4 md:px-8 bg-zinc-900/20 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-amber-500 font-bold tracking-widest text-xs uppercase mb-4 block">
              The Value
            </span>
            <PointerHighlightDemo />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {valueItems.map((item, index) => (
              <Card
                key={index}
                className="relative overflow-hidden p-8 bg-zinc-900/40 text-center hover:bg-zinc-900/60 transition-all border-zinc-800"
              >
                {/* Shine Border Added Here */}
                <ShineBorder
                  shineColor={["#b45309", "#fbbf24", "#fde68a", "#d97706"]}
                />

                <div className="flex justify-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                    {item.icon}
                  </div>
                </div>
                <div className="text-4xl md:text-5xl font-bold text-amber-500 mb-2">
                  {item.bigText}
                </div>
                <div className="text-white font-bold mb-4">{item.subText}</div>
                <p className="text-zinc-500 text-xs leading-relaxed px-2">
                  {item.desc}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container mx-auto px-4 text-center">
          <Shield className="w-16 h-16 text-primary mx-auto mb-6" />
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your Lead Generation?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join enterprise brands already using Leadequator to turn social
            conversations into measurable pipeline.
          </p>
          <Link to="/contact">
          <Button
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/30"
          >
            Request Pilot Program
          </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;