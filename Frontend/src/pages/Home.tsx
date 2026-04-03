import { useState, useEffect, useRef } from "react";
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
import { motion, AnimatePresence } from "framer-motion"; 
import {
  CheckCircle,
  MousePointerClick,
  ShieldAlert,
  TrendingUp,
  MessageSquare,
  Ban,
  Infinity,
  Shield,
  Calendar,
  X,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

/* ==========================================
   ANIMATION VARIANTS (MULTI-DIRECTIONAL)
========================================== */
const smoothEase = [0.22, 1, 0.36, 1];

const VARIANTS = {
  container: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } }
  },
  fadeUp: {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: smoothEase } }
  },
  fadeDown: {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: smoothEase } }
  },
  slideFromLeft: {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: smoothEase } }
  },
  slideFromRight: {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: smoothEase } }
  },
  zoomIn: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: smoothEase } }
  }
};

const Home = () => {
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  
  // Widget Choreography States
  const [showEventPopup, setShowEventPopup] = useState(false);
  const [hasEventPopupShown, setHasEventPopupShown] = useState(false);
  const [showWhatsapp, setShowWhatsapp] = useState(false);
  const [whatsappFaded, setWhatsappFaded] = useState(false);
  const [showWaText, setShowWaText] = useState(false); // State for "Chat with us" text
  
  const fadeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const waTextTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Initial Load Sequences
  useEffect(() => {
    // Show event popup after 2.5s
    const popupTimer = setTimeout(() => {
      setShowEventPopup(true);
      setHasEventPopupShown(true);
    }, 2500); 

    // After 4 seconds, the first load sequence (Giant text) is done
    const loadTimer = setTimeout(() => {
      setIsFirstLoad(false);
    }, 4000);

    return () => {
      clearTimeout(popupTimer);
      clearTimeout(loadTimer);
    };
  }, []);

  // 2. Auto-Close Event Popup after 7 Seconds
  useEffect(() => {
    let autoCloseTimer: NodeJS.Timeout;
    if (showEventPopup) {
      autoCloseTimer = setTimeout(() => {
        setShowEventPopup(false);
      }, 7000);
    }
    return () => clearTimeout(autoCloseTimer);
  }, [showEventPopup]);

  // 3. Trigger WhatsApp Button When Event Popup Closes
  useEffect(() => {
    if (hasEventPopupShown && !showEventPopup && !showWhatsapp) {
      const waTimer = setTimeout(() => {
        setShowWhatsapp(true);
      }, 500); // Wait 0.5s for the exit animation of the event card to finish
      
      return () => clearTimeout(waTimer);
    }
  }, [showEventPopup, hasEventPopupShown, showWhatsapp]);

  // 4. WhatsApp Interactions (Fading & Text expansion)
  const startWhatsappFadeTimer = () => {
    if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
    fadeTimerRef.current = setTimeout(() => {
      setWhatsappFaded(true);
    }, 5000); // Fades after 5 seconds of no interaction
  };

  const handleWhatsappMouseEnter = () => {
    if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
    if (waTextTimerRef.current) clearTimeout(waTextTimerRef.current);
    
    setWhatsappFaded(false); // Instantly restore opacity on hover
    setShowWaText(true);     // Show "Chat with us" text
  };

  const handleWhatsappMouseLeave = () => {
    startWhatsappFadeTimer(); // Restart the 5s fade timer for the whole button
    
    // Start the 2s timer to hide the text
    waTextTimerRef.current = setTimeout(() => {
      setShowWaText(false);
    }, 200); 
  };

  // Start the timer as soon as WhatsApp button mounts
  useEffect(() => {
    if (showWhatsapp) {
      startWhatsappFadeTimer();
    }
    return () => {
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
      if (waTextTimerRef.current) clearTimeout(waTextTimerRef.current);
    };
  }, [showWhatsapp]);

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
    <div className="min-h-screen bg-white dark:bg-black overflow-x-hidden relative transition-colors duration-500">
      <ScrollProgress className="top-[69px]" />
      
      {/* =========================================================
          FLOATING WIDGETS CHOREOGRAPHY (Right Side)
      ========================================================= */}
      
      {/* WIDGET 1: WhatsApp Button (Appears AFTER Event Popup) */}
      <AnimatePresence>
        {showWhatsapp && (
          <motion.a
            initial={{ opacity: 0, scale: 0, rotate: -45 }}
            animate={{ opacity: whatsappFaded ? 0.4 : 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 260, damping: 20 }}
            onMouseEnter={handleWhatsappMouseEnter}
            onMouseLeave={handleWhatsappMouseLeave}
            href="https://wa.me/917976978561?text=Hi!%20I%20was%20just%20looking%20at%20the%20Leadequator%20website%20and%20I'm%20interested%20in%20learning%20how%20we%20can%20generate%20leads%20without%20running%20ads." 
            target="_blank"
            rel="noopener noreferrer"
            // Replaced fixed w-14 with horizontal padding to allow smooth pill expansion
            className="fixed bottom-6 right-6 z-[60] flex items-center justify-center h-14 px-3.5 bg-[#25D366] text-white rounded-full shadow-[0_4px_20px_rgba(37,211,102,0.4)] hover:shadow-[0_6px_25px_rgba(37,211,102,0.6)] transition-all duration-300 hover:scale-105"
            aria-label="Chat with us on WhatsApp"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              fill="currentColor"
              viewBox="0 0 16 16"
              className="shrink-0"
            >
              <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c-.003 1.396.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.886-.58-.45-.973-1.005-1.087-1.204-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
            </svg>
            
            {/* Animated "Chat with us" text */}
            <AnimatePresence>
              {showWaText && (
                <motion.span
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "auto", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden whitespace-nowrap font-bold text-sm"
                >
                  <span className="ml-2 block">Chat with us</span>
                </motion.span>
              )}
            </AnimatePresence>
          </motion.a>
        )}
      </AnimatePresence>

      {/* WIDGET 2: EVENTS PROMO POPUP (Appears First) */}
      <AnimatePresence>
        {showEventPopup && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9, filter: "blur(4px)" }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-6 right-6 z-50 w-[calc(100%-3rem)] md:w-full max-w-sm"
          >
            <div className="relative p-6 bg-white/90 dark:bg-[#050505]/80 backdrop-blur-2xl border border-black/10 dark:border-white/[0.08] shadow-2xl dark:shadow-[0_20px_40px_rgba(0,0,0,0.6),inset_0_1px_0_0_rgba(255,255,255,0.05)] rounded-2xl overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-zinc-200/50 dark:bg-amber-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-zinc-300/50 dark:group-hover:bg-amber-500/20 transition-colors duration-500" />
              
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowEventPopup(false)}
                className="absolute top-3 right-3 h-6 w-6 text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/[0.1] rounded-full z-10"
              >
                <X className="h-3 w-3" />
              </Button>

              <div className="flex items-start gap-4 relative z-10">
                <div className="p-3 rounded-xl bg-zinc-100 dark:bg-amber-500/10 border border-zinc-200 dark:border-amber-500/20 shadow-sm dark:shadow-[inset_0_1px_0_0_rgba(251,191,36,0.2)] shrink-0">
                  <Calendar className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-zinc-900 dark:text-white font-bold text-base mb-1 tracking-tight">
                    Upcoming Live Events
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400 text-xs leading-relaxed mb-4">
                    Join our upcoming events to learn how top teams use AI to scale organic outbound.
                  </p>
                  <Link to="/events" onClick={() => setShowEventPopup(false)}>
                    <Button size="sm" className="w-full bg-amber-500 text-black hover:bg-amber-400 font-bold rounded-lg shadow-[0_0_15px_rgba(251,191,36,0.2)] transition-all">
                      View Schedule <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================
          HERO SECTION
      ========================================================= */}
      <section className="bg-transparent text-black dark:text-white relative w-full overflow-hidden flex flex-col items-center justify-start pt-28 pb-40 md:pt-32 md:pb-56 xl:pt-32 xl:pb-0 xl:h-screen xl:min-h-[800px] transition-colors duration-500">
        
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] md:w-[800px] h-[400px] md:h-[500px] bg-[#fbbf24]/15 dark:bg-[#fbbf24]/5 rounded-full blur-[100px] md:blur-[120px] pointer-events-none z-0"></div>

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
          className="absolute top-[30%] md:top-[40%] xl:top-1/2 left-1/2 text-[16vw] md:text-[12vw] font-black bg-gradient-to-br from-zinc-300 via-zinc-400 to-zinc-500 dark:from-white dark:via-zinc-300 dark:to-zinc-400 bg-clip-text text-transparent whitespace-nowrap z-20 pointer-events-none select-none tracking-tighter"
        >
          LEADEQUATOR
        </motion.div>

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
          className="absolute top-[45%] md:top-[50%] lg:top-[55%] xl:top-auto xl:bottom-[-85%] left-1/2 w-[180%] md:w-[130%] lg:w-[100%] aspect-square z-10 pointer-events-none"
        >
          <Globe className="w-full h-full max-w-none" /> 
        </motion.div>
        
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-50px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: { 
              opacity: 1, 
              transition: { 
                staggerChildren: 0.15, 
                delayChildren: isFirstLoad ? 3.8 : 0.1 
              } 
            }
          }}
          className="max-w-5xl mx-auto text-center relative z-30 px-4 w-full"
        >
          <motion.div variants={VARIANTS.fadeDown} className="inline-flex items-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 backdrop-blur-md mb-6 md:mb-8 shadow-sm">
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-amber-500"></div>
            <span className="text-zinc-600 dark:text-zinc-300 text-xs md:text-sm font-medium">
              Introducing Organic Engagement Intelligence
            </span>
          </motion.div>

          <motion.h1 variants={VARIANTS.zoomIn} className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-tight mb-4 md:mb-6 flex flex-col sm:flex-row items-center justify-center gap-1 md:gap-4 drop-shadow-sm dark:drop-shadow-2xl">
            <span className="text-zinc-900 dark:text-white">Lead without</span>
            <SparklesText>
              <AuroraText>Ads.</AuroraText>
            </SparklesText>
          </motion.h1>

          <motion.div variants={VARIANTS.fadeUp} className="text-base md:text-2xl text-zinc-600 dark:text-zinc-200 mb-8 md:mb-8 max-w-3xl mx-auto drop-shadow-sm px-2">
            <TextGenerateEffectDemo />
          </motion.div>

          <motion.div variants={VARIANTS.fadeUp} className="flex flex-wrap justify-center gap-3 md:gap-8 mb-10 md:mb-12 text-xs md:text-sm">
            <div className="flex items-center gap-1.5 md:gap-2 bg-white/80 dark:bg-black/40 px-3 py-1.5 md:py-1 rounded-full backdrop-blur-sm border border-black/5 dark:border-white/5 text-zinc-700 dark:text-white shadow-sm">
              <CheckCircle className="w-3.5 h-3.5 md:w-4 md:h-4 text-amber-500" />
              Detect buying intent
            </div>
            <div className="flex items-center gap-1.5 md:gap-2 bg-white/80 dark:bg-black/40 px-3 py-1.5 md:py-1 rounded-full backdrop-blur-sm border border-black/5 dark:border-white/5 text-zinc-700 dark:text-white shadow-sm">
              <MousePointerClick className="w-3.5 h-3.5 md:w-4 md:h-4 text-amber-500" />
              Engage early
            </div>
            <div className="flex items-center gap-1.5 md:gap-2 bg-white/80 dark:bg-black/40 px-3 py-1.5 md:py-1 rounded-full backdrop-blur-sm border border-black/5 dark:border-white/5 text-zinc-700 dark:text-white shadow-sm">
              <ShieldAlert className="w-3.5 h-3.5 md:w-4 md:h-4 text-amber-500" />
              100% compliant
            </div>
          </motion.div>

          <motion.div variants={VARIANTS.fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14 md:mb-20">
            <Link to="/pricing">
              <InteractiveHoverButton className="justify-center">
                <span className="text-white">Start Finding Buyers Organically</span>
              </InteractiveHoverButton>
            </Link>
            <Link to="/working">
              <button className="bg-white/50 dark:bg-black/20 backdrop-blur-md text-zinc-800 dark:text-white border border-zinc-200 dark:border-zinc-700/50 px-8 py-3.5 md:py-4 rounded-full font-bold text-base md:text-lg hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-300 hover:bg-zinc-50 dark:hover:bg-black/40 shadow-sm transition-all">
                See How It Works
              </button>
            </Link>
          </motion.div>

          <motion.div variants={VARIANTS.fadeUp} className="border-t border-black/10 dark:border-white/10 pt-6 md:pt-8 pb-4 relative z-10 bg-zinc-50/80 dark:bg-black/30 backdrop-blur-md rounded-xl max-w-4xl mx-auto shadow-sm dark:shadow-none">
            <p className="text-zinc-500 dark:text-white/70 text-xs md:text-sm mb-4 md:mb-6 uppercase tracking-widest font-bold">
              Trusted by growth teams at
            </p>
            <div className="flex flex-wrap justify-center gap-6 md:gap-16 text-zinc-800 dark:text-white font-bold text-sm md:text-lg">
              <span>Startups</span>
              <span>Agencies</span>
              <span>SaaS Companies</span>
              <span>Consultants</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Value Props Section */}
      <section className="py-16 bg-zinc-50 dark:bg-card relative z-30 overflow-hidden transition-colors duration-500">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-50px" }}
          variants={VARIANTS.container}
          className="container mx-auto px-4 "
        >
          <motion.h2 variants={VARIANTS.fadeDown} className="text-4xl font-bold text-center md:flex mb-10 md:mb-4 justify-center gap-2 text-zinc-900 dark:text-white">
            Turn Conversations Into{" "}
            <span className="text-[#fbbf24]">
              <MorphingText texts={["Revenue", "Sales", "Deals", "Profit"]} />
            </span>
          </motion.h2>
          <motion.div variants={VARIANTS.fadeUp} className="flex">
            <CardHoverEffectDemo />
          </motion.div>
        </motion.div>
      </section>

      {/* Process Section */}
      <section className="py-24 relative z-30 bg-white dark:bg-black overflow-hidden transition-colors duration-500">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-50px" }}
          variants={VARIANTS.container}
          className="container mx-auto px-4"
        >
          <motion.h2 variants={VARIANTS.slideFromLeft} className="text-4xl font-bold text-center mb-16 flex flex-wrap items-center justify-center gap-4 text-zinc-900 dark:text-white">
            From Noise to{" "}
            <span className="text-[#fbbf24]">
              <HyperText>Qualified Leads</HyperText>
            </span>
          </motion.h2>
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
              <motion.div key={item.step} variants={VARIANTS.fadeUp}>
                <Card className="p-6 bg-zinc-50 dark:bg-card border-black/5 dark:border-border relative overflow-hidden group h-full shadow-sm dark:shadow-none">
                  <ShineBorder shineColor={["#b45309", "#fbbf24", "#fde68a", "#d97706"]} />
                  <div className="text-6xl font-bold text-[#fbbf24]/20 mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-zinc-900 dark:text-white">{item.title}</h3>
                  <p className="text-zinc-600 dark:text-muted-foreground text-sm">{item.desc}</p>
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-[#fbbf24] transform scale-x-0 group-hover:scale-x-100 transition-transform" />
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* SECTION 2: THE VALUE */}
      <section className="py-24 px-4 md:px-8 bg-zinc-100/50 dark:bg-zinc-900/20 border-t border-black/5 dark:border-zinc-800 relative z-30 overflow-hidden transition-colors duration-500">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-50px" }}
          variants={VARIANTS.container}
          className="max-w-7xl mx-auto"
        >
          <motion.div variants={VARIANTS.fadeDown} className="text-center mb-16">
            <span className="text-amber-500 font-bold tracking-widest text-xs uppercase mb-4 block">
              The Value
            </span>
            <PointerHighlightDemo />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {valueItems.map((item, index) => (
              <motion.div key={index} variants={VARIANTS.fadeUp}>
                <Card className="relative overflow-hidden p-8 bg-white dark:bg-zinc-900/40 text-center hover:bg-zinc-50 dark:hover:bg-zinc-900/60 transition-all border-black/5 dark:border-zinc-800 h-full shadow-sm dark:shadow-none">
                  <ShineBorder shineColor={["#b45309", "#fbbf24", "#fde68a", "#d97706"]} />

                  <div className="flex justify-center mb-6">
                    <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                      {item.icon}
                    </div>
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-amber-500 mb-2">
                    {item.bigText}
                  </div>
                  <div className="text-zinc-900 dark:text-white font-bold mb-4">{item.subText}</div>
                  <p className="text-zinc-500 text-xs leading-relaxed px-2">
                    {item.desc}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-amber-500/10 to-amber-500/5 relative z-30 overflow-hidden">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-50px" }}
          variants={VARIANTS.container}
          className="container mx-auto px-4 text-center"
        >
          <motion.div variants={VARIANTS.zoomIn}>
            <Shield className="w-16 h-16 text-[#fbbf24] mx-auto mb-6" />
          </motion.div>
          <motion.h2 variants={VARIANTS.slideFromRight} className="text-4xl font-bold mb-6 text-zinc-900 dark:text-white">
            Ready to Transform Your Lead Generation?
          </motion.h2>
          <motion.p variants={VARIANTS.slideFromLeft} className="text-xl text-zinc-600 dark:text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join enterprise brands already using Leadequator to turn social
            conversations into measurable pipeline.
          </motion.p>
          <motion.div variants={VARIANTS.fadeUp}>
            <Link to="/contact">
              <Button size="lg" className="bg-[#fbbf24] text-black hover:bg-[#fbbf24]/90 shadow-lg shadow-[#fbbf24]/30 font-bold">
                Request Pilot Program
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};
export default Home;