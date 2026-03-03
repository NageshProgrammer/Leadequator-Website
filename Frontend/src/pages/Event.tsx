import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  X, 
  CheckCircle2, 
  Sparkles, 
  Loader2,
  Building2,
  Mail,
  User,
  BellRing,
  Phone,
  ShieldCheck,
  Briefcase,
  AlertTriangle,
  XOctagon,
  Zap,
  Wrench,
  Settings,
  TrendingUp,
  Target,
  GraduationCap,
  DollarSign,
  MessageCircle,
  Gift
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* ==========================================
   MASTERCLASS DATA
========================================== */
const MASTERCLASS_EVENT = {
  id: "ai_masterclass_2026",
  title: "2-Day Intensive AI Business Masterclass",
  category: "Intensive Masterclass",
  spotsLeft: 50,
};

const MANUAL_PAINS = [
  "Creating content from scratch",
  "Managing repetitive operations",
  "Handling leads without automation",
  "Guessing instead of using data",
  "Wasting team hours on basic tasks"
];

const AGENDA_MODULES = [
  {
    id: 1,
    title: "The AI Shift: Why 2026 Will Redefine Business",
    icon: <Zap className="w-6 h-6 text-[#fbbf24]" />,
    points: [
      "How AI is changing industries faster than the internet did",
      "Jobs that will evolve vs roles that will disappear",
      "Where the biggest opportunities are emerging"
    ]
  },
  {
    id: 2,
    title: "25+ AI Tools You Can Start Using Immediately",
    icon: <Wrench className="w-6 h-6 text-[#fbbf24]" />,
    points: [
      "Free AI tools for content, images & videos",
      "AI for presentations, resumes & research",
      "AI tools for marketing & sales",
      "How to choose the right tool for your need"
    ]
  },
  {
    id: 3,
    title: "Automating Your Work: Build Systems, Not Stress",
    icon: <Settings className="w-6 h-6 text-[#fbbf24]" />,
    points: [
      "Creating AI-powered workflows",
      "Automating repetitive tasks",
      "Reducing manual dependency",
      "Increasing output without increasing effort"
    ]
  },
  {
    id: 4,
    title: "AI for Business Growth & Revenue",
    icon: <TrendingUp className="w-6 h-6 text-[#fbbf24]" />,
    points: [
      "Using AI to generate leads",
      "AI-driven sales support",
      "AI in customer communication",
      "Turning AI into a revenue multiplier"
    ]
  },
  {
    id: 5,
    title: "Solve Real Business Problems with AI",
    icon: <Target className="w-6 h-6 text-[#fbbf24]" />,
    points: [
      "Cost reduction strategies",
      "Process inefficiencies",
      "Scaling without increasing team size",
      "Real case-based discussions"
    ]
  },
  {
    id: 6,
    title: "AI for Working Professionals",
    icon: <Briefcase className="w-6 h-6 text-[#fbbf24]" />,
    points: [
      "How to 10x productivity at work",
      "Using AI to stand out in your job",
      "AI for reports, analysis & presentations",
      "Becoming irreplaceable in an AI-driven workplace"
    ]
  },
  {
    id: 7,
    title: "AI for Students & Career Builders",
    icon: <GraduationCap className="w-6 h-6 text-[#fbbf24]" />,
    points: [
      "Using AI for research & learning",
      "Building AI-assisted portfolios",
      "Skills that will dominate the next 5 years",
      "How to stay ahead of automation"
    ]
  },
  {
    id: 8,
    title: "Creating AI-Powered Income Streams",
    icon: <DollarSign className="w-6 h-6 text-[#fbbf24]" />,
    points: [
      "Freelancing with AI",
      "AI service models",
      "Consulting opportunities",
      "New-age digital income models"
    ]
  },
  {
    id: 9,
    title: "Live Q&A + Business Consultation",
    icon: <MessageCircle className="w-6 h-6 text-[#fbbf24]" />,
    points: [
      "Bring your business bottleneck",
      "Solve your career confusion",
      "Fix an automation problem or growth challenge",
      "Get practical, tailored guidance"
    ]
  }
];

const INDUSTRIES = [
  "Manufacturing",
  "Trading & Distribution",
  "Retail",
  "Construction & Real Estate",
  "Information Technology (IT)",
  "SaaS (Software as a Service)",
  "Digital Marketing & Advertising",
  "Professional Services (Consulting, Legal, CA, etc.)",
  "Logistics & Transportation",
  "E-commerce",
  "Healthcare",
  "Hospitality & Food Services",
  "Education & EdTech",
  "Agriculture & Agro Processing",
  "Import–Export",
  "Financial Services",
  "Media & Entertainment",
  "Telecom",
  "Infrastructure",
  "Other"
];

/* ==========================================
   ANIMATION VARIANTS
========================================== */
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 30 }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    y: 20,
    transition: { duration: 0.2 }
  }
};

/* ==========================================
   MAIN COMPONENT
========================================== */
export default function EventsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", company: "", industry: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isModalOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; }
  }, [isModalOpen]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setIsSuccess(false);
    setFormData({ name: "", email: "", phone: "", company: "", industry: "" });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.industry) {
      alert("Please select an industry");
      return;
    }
    
    setIsSubmitting(true);

    try {
      const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
      
      const response = await fetch(`${API_BASE}/api/events/waitlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: MASTERCLASS_EVENT.id,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          industry: formData.industry 
        }),
      });

      if (!response.ok) throw new Error("Failed to submit waitlist data");
      setIsSuccess(true);
    } catch (error) {
      console.error("Waitlist submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const glassCardStyle = "bg-[#050505]/40 backdrop-blur-xl border border-white/[0.08] shadow-[0_8px_30px_rgb(0,0,0,0.12),inset_0_1px_0_0_rgba(255,255,255,0.05)] rounded-[2rem]";
  const inputStyle = "pl-10 bg-white/[0.02] border-white/[0.08] text-white focus-visible:ring-[#fbbf24]/30 focus-visible:border-[#fbbf24]/50 rounded-xl h-12 transition-all placeholder:text-zinc-600";
  const labelStyle = "text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest mb-2 block ml-1";

  return (
    <div className="min-h-[90vh] pt-14 pb-24 bg-black/10 text-white selection:bg-[#fbbf24]/30 relative overflow-hidden">
      
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#fbbf24]/[0.05] rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-[40%] -left-[10%] w-[500px] h-[500px] bg-red-600/[0.03] rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="container mx-auto px-4 max-w-[1200px] relative z-10 pt-8 md:pt-12">
        
        {/* ==========================================
            HERO SECTION
        ========================================== */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto mb-16 md:mb-20"
        >
          {/* Disclaimer Badge */}
          <div className="inline-flex items-center justify-center gap-2 md:gap-3 px-4 py-2 md:px-5 md:py-3 mb-8 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/5 border border-green-500/30 shadow-[0_0_25px_rgba(34,197,94,0.15)] backdrop-blur-md">
            <ShieldCheck className="w-4 h-4 md:w-5 md:h-5 text-green-400 shrink-0 drop-shadow-md" />
            <span className="text-xs md:text-sm text-green-100 font-medium">
              <strong className="text-white tracking-wide">100% Informative Session</strong> — No selling. No hidden agenda. No product pitch.
            </span>
          </div>

          <h2 className="text-[#fbbf24] font-black tracking-widest text-sm md:text-base uppercase mb-4 flex items-center justify-center gap-2">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
            AI Is Replacing Inefficient Businesses
          </h2>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
            Will Yours Be <span className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">Next?</span>
          </h1>

          <p className="text-zinc-300 text-lg md:text-2xl font-medium leading-relaxed mb-10 max-w-3xl mx-auto">
            Join the 2-Day Intensive AI Business Masterclass by Leadequator. A pure, implementation-focused session for serious business owners and professionals.
          </p>

          <Button 
            onClick={handleOpenModal}
            className="h-16 px-10 text-lg bg-[#fbbf24] text-black hover:bg-[#fbbf24]/90 font-black rounded-2xl shadow-[0_0_30px_rgba(251,191,36,0.3)] hover:shadow-[0_0_40px_rgba(251,191,36,0.5)] transition-all hover:-translate-y-1"
          >
            Join the Priority Waitlist <ArrowRight className="ml-2 h-6 w-6" />
          </Button>
          <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest mt-4">Dates TBA • Limited Spots</p>
        </motion.div>

        {/* ==========================================
            THE PROBLEM SECTION
        ========================================== */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-24 p-8 md:p-10 rounded-[2.5rem] bg-red-950/10 border border-red-500/20 backdrop-blur-xl shadow-[inset_0_1px_0_0_rgba(239,68,68,0.1)]"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">
            If You’re Still Doing This Manually…
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {MANUAL_PAINS.map((pain, i) => (
              <div key={i} className="flex items-center gap-3 text-zinc-300 font-medium">
                <XOctagon className="w-5 h-5 text-red-400 shrink-0" />
                {pain}
              </div>
            ))}
          </div>
          <div className="text-center mt-10 text-xl font-bold text-red-400">
            …You’re already behind.
          </div>
        </motion.div>

        {/* ==========================================
            AGENDA / MODULES GRID
        ========================================== */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Inside The Masterclass</h2>
          <p className="text-zinc-400">Everything you will learn and implement over the 2 days.</p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-24"
        >
          {AGENDA_MODULES.map((module) => (
            <motion.div 
              key={module.id}
              variants={itemVariants}
              className={`flex flex-col p-8 ${glassCardStyle} hover:bg-white/[0.02] hover:border-white/[0.15] hover:shadow-[0_15px_40px_rgba(0,0,0,0.4)] transition-all duration-500 group relative overflow-hidden`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#fbbf24]/5 rounded-full blur-3xl group-hover:bg-[#fbbf24]/10 transition-colors" />
              
              <div className="w-14 h-14 rounded-2xl bg-[#fbbf24]/10 border border-[#fbbf24]/20 flex items-center justify-center mb-6 shadow-inner">
                {module.icon}
              </div>
              
              <h3 className="text-xl font-bold text-white mb-4 leading-tight">
                <span className="text-[#fbbf24] mr-2">{module.id}.</span>
                {module.title}
              </h3>
              
              <ul className="space-y-3 mt-auto">
                {module.points.map((point, idx) => (
                  <li key={idx} className="flex items-start text-sm text-zinc-400 leading-relaxed">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-600 mt-1.5 mr-3 shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* ==========================================
            BONUS SECTION
        ========================================== */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto rounded-[2.5rem] bg-gradient-to-br from-[#fbbf24]/10 to-transparent border border-[#fbbf24]/30 p-8 md:p-12 text-center backdrop-blur-xl relative overflow-hidden"
        >
          <Sparkles className="absolute top-6 right-8 w-12 h-12 text-[#fbbf24]/20" />
          <Gift className="w-12 h-12 text-[#fbbf24] mx-auto mb-6" />
          <h3 className="text-3xl font-extrabold text-white mb-6">🎁 Exclusive Bonuses for Attendees</h3>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            {["AI Workflow Templates", "Ready-to-Use Prompt Library", "Automation Frameworks", "Tool Stack Cheat Sheet"].map((bonus, i) => (
              <div key={i} className="px-5 py-2.5 rounded-xl bg-black/40 border border-white/[0.08] text-zinc-200 font-semibold text-sm shadow-inner">
                {bonus}
              </div>
            ))}
          </div>
          
          <Button 
            onClick={handleOpenModal}
            className="mt-10 h-14 px-8 text-base bg-white text-black hover:bg-zinc-200 font-bold rounded-xl shadow-lg transition-all"
          >
            Join Waitlist to Secure Bonuses
          </Button>
        </motion.div>

      </div>

      {/* ==========================================
          REGISTRATION MODAL OVERLAY
      ========================================== */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
            />

            <motion.div 
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative w-full max-w-xl bg-[#09090b]/95 backdrop-blur-3xl border border-white/[0.1] shadow-[0_20px_60px_rgba(0,0,0,0.8),inset_0_1px_0_0_rgba(255,255,255,0.05)] rounded-[2.5rem] overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar"
              onClick={(e) => e.stopPropagation()} 
            >
              <div className="flex items-center justify-between p-6 md:px-8 pb-4 border-b border-white/[0.08] bg-black/20 sticky top-0 z-10 backdrop-blur-md">
                <div>
                  <Badge variant="outline" className="bg-[#fbbf24]/10 text-[#fbbf24] border-[#fbbf24]/20 text-[10px] uppercase tracking-widest mb-2">
                    Priority Waitlist
                  </Badge>
                  <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight leading-tight">
                    AI Business Masterclass
                  </h2>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleCloseModal} 
                  className="h-10 w-10 shrink-0 rounded-full text-zinc-400 hover:text-white hover:bg-white/[0.1] transition-colors"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="p-6 md:p-8">
                {isSuccess ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center text-center py-8"
                  >
                    <div className="w-20 h-20 bg-[#fbbf24]/10 border border-[#fbbf24]/20 rounded-full flex items-center justify-center mb-6 shadow-[inset_0_1px_0_0_rgba(251,191,36,0.2)]">
                      <CheckCircle2 className="w-10 h-10 text-[#fbbf24]" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">You're on the list!</h3>
                    <p className="text-zinc-400 font-medium mb-8 max-w-sm leading-relaxed">
                      We'll notify <span className="text-white">{formData.email}</span> the moment the official dates are announced.
                    </p>
                    <Button 
                      onClick={handleCloseModal}
                      className="w-full h-12 bg-white/[0.05] text-white hover:bg-white/[0.1] border border-white/[0.1] font-bold rounded-xl transition-colors"
                    >
                      Close Window
                    </Button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    
                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-[#fbbf24]/20 mb-8">
                      <BellRing className="w-5 h-5 text-[#fbbf24] mt-0.5 shrink-0 animate-pulse" />
                      <div className="text-sm font-medium text-zinc-300 leading-relaxed">
                        Dates are currently being finalized. Join the priority waitlist to guarantee your spot before public registration opens.
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <Label className={labelStyle}>Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                          <Input 
                            required 
                            type="text"
                            placeholder="John Doe" 
                            className={inputStyle}
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label className={labelStyle}>Work Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                          <Input 
                            required 
                            type="email"
                            placeholder="john@company.com" 
                            className={inputStyle}
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                          <Label className={labelStyle}>Phone Number</Label>
                          <div className="relative">
                            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <Input 
                              required
                              type="tel"
                              placeholder="+1 (555) 000-0000" 
                              className={inputStyle}
                              value={formData.phone}
                              onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            />
                          </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label className={labelStyle}>Company Name</Label>
                        <div className="relative">
                          <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                          <Input 
                            required 
                            type="text"
                            placeholder="Acme Corp" 
                            className={inputStyle}
                            value={formData.company}
                            onChange={(e) => setFormData({...formData, company: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className={labelStyle}>Industry</Label>
                      <div className="relative">
                        <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 z-10 pointer-events-none" />
                        <Select 
                          required
                          value={formData.industry} 
                          onValueChange={(val) => setFormData({...formData, industry: val})}
                        >
                          <SelectTrigger className={`${inputStyle} pl-10 text-left`}>
                            <SelectValue placeholder="Select your industry" />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-950 border-white/[0.1] text-white rounded-xl shadow-2xl max-h-[280px]">
                            {INDUSTRIES.map((ind) => (
                              <SelectItem 
                                key={ind} 
                                value={ind} 
                                className="focus:bg-[#fbbf24]/20 focus:text-[#fbbf24] cursor-pointer"
                              >
                                {ind}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="pt-6 mt-4 border-t border-white/[0.08]">
                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full h-14 text-base bg-[#fbbf24] text-black hover:bg-[#fbbf24]/90 font-bold rounded-xl shadow-[0_0_20px_rgba(251,191,36,0.2)] hover:shadow-[0_0_30px_rgba(251,191,36,0.4)] transition-all active:scale-[0.98]"
                      >
                        {isSubmitting ? (
                          <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Securing Spot...</>
                        ) : (
                          <>Join Priority Waitlist <ArrowRight className="ml-2 h-5 w-5" /></>
                        )}
                      </Button>
                      <p className="text-center text-[10px] text-zinc-500 mt-4 uppercase tracking-widest font-bold">
                        Waitlist is strictly capped at {MASTERCLASS_EVENT.spotsLeft} entries
                      </p>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}