import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  ArrowRight, 
  X, 
  CheckCircle2, 
  Sparkles, 
  Video, 
  Loader2,
  Building2,
  Mail,
  User,
  BellRing,
  Phone // 👇 Added Phone Icon
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/* ==========================================
   TYPES & DUMMY DATA
========================================== */
interface Event {
  id: string;
  title: string;
  location: string;
  type: "Virtual" | "In-Person";
  category: string;
  description: string;
  speaker: string;
  spotsLeft: number;
}

const UPCOMING_EVENTS: Event[] = [
  {
    id: "evt_1",
    title: "Mastering AI-Driven Outbound",
    location: "Zoom / Virtual",
    type: "Virtual",
    category: "Masterclass",
    description: "Learn how to configure Leadequator's intent engine to automatically discover and engage 10x more qualified leads. Live Q&A included.",
    speaker: "Jatan Wani, CEO",
    spotsLeft: 45,
  },
  {
    id: "evt_2",
    title: "The Future of B2B Lead Gen",
    location: "Google Meet",
    type: "Virtual",
    category: "Webinar",
    description: "A deep dive into how large language models are replacing traditional scraping tools. We'll show real case studies of 300% ROI increases.",
    speaker: "Nasur ul Zain Azran, CTO",
    spotsLeft: 120,
  },
  {
    id: "evt_3",
    title: "Leadequator Founders Meetup",
    location: "London, UK",
    type: "In-Person",
    category: "Networking",
    description: "An exclusive, invite-only dinner for Leadequator Pro and Enterprise users. Network with top growth marketers and our founding team.",
    speaker: "Jacob, Head of Growth",
    spotsLeft: 12,
  },
  {
    id: "evt_4",
    title: "Building Custom AI Workflows",
    location: "Virtual",
    type: "Virtual",
    category: "Workshop",
    description: "Technical workshop for developers and ops teams. Learn how to connect Leadequator via webhooks to your custom CRM infrastructure.",
    speaker: "Nagesh Yalparatte",
    spotsLeft: 200,
  }
];

/* ==========================================
   ANIMATION VARIANTS
========================================== */
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
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
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  
  // 👇 Added phone to form state
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", company: "", role: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (selectedEvent) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; }
  }, [selectedEvent]);

  const handleOpenModal = (event: Event) => {
    setSelectedEvent(event);
    setIsSuccess(false);
    setFormData({ name: "", email: "", phone: "", company: "", role: "" });
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;
    
    setIsSubmitting(true);

    try {
      const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
      
      const response = await fetch(`${API_BASE}/api/events/waitlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId: selectedEvent.id,
          name: formData.name,
          email: formData.email,
          phone: formData.phone, // 👇 Added phone to payload
          company: formData.company,
          role: formData.role
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit waitlist data");
      }

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
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#fbbf24]/[0.04] rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-[20%] -left-[10%] w-[400px] h-[400px] bg-amber-600/[0.03] rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="container mx-auto px-4 max-w-[1200px] relative z-10 pt-8 md:pt-12">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16 md:mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#fbbf24]/10 border border-[#fbbf24]/20 text-[#fbbf24] text-xs font-bold uppercase tracking-widest mb-6 shadow-[inset_0_1px_0_0_rgba(251,191,36,0.2)]">
            <Sparkles className="w-3.5 h-3.5" />
            Leadequator Live
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
            Upcoming <span className="text-[#fbbf24] drop-shadow-[0_0_15px_rgba(251,191,36,0.2)]">Events</span>
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl font-medium leading-relaxed">
            Join the waitlist for our exclusive masterclasses, webinars, and networking events to master AI-driven growth.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
        >
          {UPCOMING_EVENTS.map((event) => (
            <motion.div 
              key={event.id}
              variants={itemVariants}
              className={`group flex flex-col sm:flex-row gap-6 p-6 sm:p-8 ${glassCardStyle} hover:bg-white/[0.02] hover:border-white/[0.15] hover:shadow-[0_15px_40px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.05)] hover:-translate-y-1 transition-all duration-500 overflow-hidden relative`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#fbbf24]/0 to-[#fbbf24]/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="flex-shrink-0 flex sm:flex-col items-center sm:items-center sm:justify-center gap-4 sm:gap-0 bg-black/40 border border-white/[0.05] rounded-2xl p-4 sm:w-24 sm:h-24 shadow-inner group-hover:border-[#fbbf24]/30 transition-colors duration-500">
                <span className="text-[#fbbf24] font-black tracking-widest text-[10px] uppercase mb-0.5">Date</span>
                <span className="text-white font-extrabold text-2xl sm:text-3xl leading-none">TBA</span>
              </div>

              <div className="flex-1 flex flex-col">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Badge variant="outline" className="bg-white/[0.03] text-zinc-300 border-white/[0.1] font-semibold text-[10px] uppercase tracking-widest">
                    {event.category}
                  </Badge>
                  <Badge variant="outline" className={`${event.type === 'Virtual' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'} font-semibold text-[10px] uppercase tracking-widest`}>
                    {event.type === 'Virtual' ? <Video className="w-3 h-3 mr-1" /> : <MapPin className="w-3 h-3 mr-1" />}
                    {event.type}
                  </Badge>
                </div>

                <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-[#fbbf24] transition-colors duration-300">
                  {event.title}
                </h3>
                
                <p className="text-zinc-400 text-sm leading-relaxed mb-6 line-clamp-2">
                  {event.description}
                </p>

                <div className="mt-auto flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center text-xs text-zinc-500 font-medium">
                      <Clock className="w-3.5 h-3.5 mr-1.5 text-zinc-600" /> Time: <span className="ml-1 text-zinc-400">To Be Announced</span>
                    </div>
                    <div className="flex items-center text-xs text-zinc-500 font-medium">
                      <User className="w-3.5 h-3.5 mr-1.5 text-zinc-600" /> {event.speaker}
                    </div>
                  </div>

                  <Button 
                    onClick={() => handleOpenModal(event)}
                    className="bg-white/[0.05] text-white hover:bg-[#fbbf24] hover:text-black border border-white/[0.1] hover:border-[#fbbf24] font-bold rounded-xl shadow-sm transition-all"
                  >
                    Join Waitlist
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedEvent && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
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
              // 👇 Increased max-width to accommodate extra field nicely
              className="relative w-full max-w-xl bg-[#09090b]/95 backdrop-blur-3xl border border-white/[0.1] shadow-[0_20px_60px_rgba(0,0,0,0.8),inset_0_1px_0_0_rgba(255,255,255,0.05)] rounded-[2.5rem] overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar"
              onClick={(e) => e.stopPropagation()} 
            >
              <div className="flex items-center justify-between p-6 md:px-8 pb-4 border-b border-white/[0.08] bg-black/20 sticky top-0 z-10 backdrop-blur-md">
                <div>
                  <Badge variant="outline" className="bg-[#fbbf24]/10 text-[#fbbf24] border-[#fbbf24]/20 text-[10px] uppercase tracking-widest mb-2">
                    {selectedEvent.category} Waitlist
                  </Badge>
                  <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight leading-tight">
                    {selectedEvent.title}
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
                      We'll notify <span className="text-white">{formData.email}</span> the moment the official date and time are announced for this event.
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

                    {/* 👇 Phone Number Field Added Here */}
                    <div className="space-y-1.5">
                        <Label className={labelStyle}>Phone Number <span className="text-zinc-600 normal-case tracking-normal ml-1">(Optional)</span></Label>
                        <div className="relative">
                          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                          <Input 
                            type="tel"
                            placeholder="+1 (555) 000-0000" 
                            className={inputStyle}
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <Label className={labelStyle}>Company</Label>
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
                      <div className="space-y-1.5">
                        <Label className={labelStyle}>Job Title</Label>
                        <div className="relative">
                          <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                          <Input 
                            required 
                            type="text"
                            placeholder="Founder / Marketer" 
                            className={inputStyle}
                            value={formData.role}
                            onChange={(e) => setFormData({...formData, role: e.target.value})}
                          />
                        </div>
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
                        Waitlist is capped at {selectedEvent.spotsLeft} entries
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