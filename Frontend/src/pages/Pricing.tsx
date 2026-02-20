import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import CongestedPricing from "@/[components]/plansection";
import { ScrollProgress } from "@/components/ui/scroll-progress";

const Pricing = () => {
  return (
    // ADDED: bg-black and overflow-x-hidden to lock the layout and prevent mobile side-scrolling
    <div className="min-h-screen  pt-24 pb-12 text-white selection:bg-[#fbbf24]/30 relative z-10 overflow-x-hidden">
      <ScrollProgress className="top-[65px]" />
      
      {/* Background Glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#fbbf24]/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Pricing Cards Component */}
        <CongestedPricing/>

        {/* FAQ Section */}
        <div className="mt-32">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.05] text-[#fbbf24] font-bold tracking-widest text-xs uppercase mb-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
              FAQ
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Pricing <span className="text-[#fbbf24]">Questions</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {[
              {
                q: "What determines custom pricing?",
                a: "Volume of conversations monitored, number of brands/workspaces, team size, and required integrations.",
              },
              {
                q: "Is there a free trial?",
                a: "We offer a 14-day Pilot program with limited scope to prove ROI before committing to full deployment.",
              },
              {
                q: "What's included in 'unlimited conversations'?",
                a: "Scale and Enterprise plans have no hard limits on monitoring or engagement volume. Fair use policies apply.",
              },
              {
                q: "Can I upgrade mid-contract?",
                a: "Yes, you can upgrade from Pilot → Scale → Enterprise at any time with pro-rated pricing.",
              },
            ].map((faq, index) => (
              <div 
                key={index} 
                className="p-8 bg-[#050505]/60 backdrop-blur-xl border border-white/[0.05] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] rounded-[2rem] hover:border-white/[0.1] transition-colors"
              >
                <h3 className="text-xl font-bold mb-3 text-zinc-100">{faq.q}</h3>
                <p className="text-zinc-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center bg-[#050505]/80 backdrop-blur-xl border border-white/[0.08] shadow-[0_20px_40px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.05)] rounded-[3rem] p-16 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-[#fbbf24]/10 to-transparent opacity-50 pointer-events-none" />
          
          <h2 className="text-4xl font-bold mb-4 text-white relative z-10">
            Ready to See ROI in 30 Days?
          </h2>
          <p className="text-zinc-400 text-xl mb-10 max-w-2xl mx-auto relative z-10">
            Start with a Pilot program and scale when you see results.
          </p>
          <Link to="/sign-up" className="relative z-10">
            <Button
              className="bg-[#fbbf24] text-black hover:bg-[#fbbf24]/90 font-bold rounded-2xl px-10 h-14 text-lg shadow-[0_0_20px_rgba(251,191,36,0.2)] hover:scale-105 transition-all duration-300"
            >
              Request Pilot Program
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Pricing;