import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, TrendingUp, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Solutions = () => {
  const navigate = useNavigate();

  const solutions = [
    {
      icon: Users,
      title: "PR & Communications Teams",
      description:
        "Replace expensive PR agencies with AI-powered engagement at scale. Monitor brand mentions, respond to press queries, and build relationships with journalists and influencers.",
      useCases: [
        "Proactive crisis management and brand protection",
        "Journalist relationship building on social platforms",
        "Product launch amplification through organic engagement",
        "Thought leadership positioning in industry discussions",
      ],
      results: [
        "87% reduction in cost-per-engagement vs traditional PR",
        "3.2x increase in earned media mentions",
        "65% faster crisis response time",
      ],
    },
    {
      icon: TrendingUp,
      title: "Growth & Demand Gen Teams",
      description:
        "Turn social conversations into qualified pipeline without paid ads. Identify in-market buyers, engage authentically, and track attribution from conversation to closed-won.",
      useCases: [
        "Bottom-of-funnel lead capture from buying conversations",
        "Competitor displacement by intercepting complaints",
        "Community-led growth through authentic engagement",
        "Account-based marketing (ABM) with social signals",
      ],
      results: [
        "42% of pipeline from social engagement (no ad spend)",
        "$180K average deal size from intent-scored leads",
        "18% faster sales cycles with conversation context",
      ],
    },
    {
      icon: Briefcase,
      title: "Agencies & Consultancies",
      description:
        "Offer AI-powered social selling as a premium service to your clients. White-label dashboard, client reporting, and multi-tenant workspace management.",
      useCases: [
        "Managed social engagement service packages",
        "Lead generation retainers with measurable ROI",
        "Crisis monitoring and rapid response for clients",
        "Competitive intelligence as a service offering",
      ],
      results: [
        "$15K-50K monthly retainers per client engagement",
        "10+ clients managed by 1 account manager (vs 2-3 manual)",
        "95% client retention with transparent ROI reporting",
      ],
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 text-white bg-black selection:bg-[#fbbf24]/30 relative z-10 overflow-hidden">
      {/* Background Glow - Made slightly brighter so you can definitely see it */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#fbbf24]/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.1] text-[#fbbf24] font-bold tracking-widest text-xs uppercase mb-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
            Use Cases
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">
            Built for Teams That Need <span className="text-[#fbbf24] drop-shadow-[0_0_15px_rgba(251,191,36,0.3)]">Measurable Results</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed">
            Whether you're protecting brand reputation, generating pipeline, or
            serving clients, Leadequator delivers ROI that can be tracked to the
            dollar.
          </p>
        </div>

        {/* Solutions Cards */}
        <div className="space-y-12">
          {solutions.map((solution, index) => (
            <div
              key={index}
              className="p-8 md:p-12 bg-[#050505]/80 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8px_30px_rgb(0,0,0,0.2),inset_0_1px_0_0_rgba(255,255,255,0.05)] rounded-[2.5rem] transition-all duration-500 hover:border-white/[0.15] hover:shadow-[0_8px_40px_rgba(251,191,36,0.1)]"
            >
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="w-16 h-16 rounded-2xl bg-[#fbbf24]/10 border border-[#fbbf24]/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] flex items-center justify-center mb-8">
                    <solution.icon className="w-8 h-8 text-[#fbbf24]" />
                  </div>
                  <h2 className="text-3xl font-bold mb-4 text-white">
                    {solution.title}
                  </h2>
                  <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
                    {solution.description}
                  </p>

                  <h3 className="text-xl font-bold mb-4 text-zinc-100">Common Use Cases</h3>
                  <ul className="space-y-3 mb-10">
                    {solution.useCases.map((useCase, i) => (
                      <li
                        key={i}
                        className="flex items-start text-zinc-400"
                      >
                        <span className="text-[#fbbf24] mr-3 mt-1 text-lg leading-none">▸</span>
                        {useCase}
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="bg-[#fbbf24] text-black hover:bg-[#fbbf24]/90 font-bold rounded-2xl px-8 h-12 shadow-[0_0_20px_rgba(251,191,36,0.2)] hover:scale-105 transition-all duration-300"
                    onClick={() => navigate("/contact")}
                  >
                    Request Demo
                  </Button>
                </div>

                {/* Results Box */}
                <div className="bg-white/[0.02] rounded-[2rem] p-8 border border-white/[0.05] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)] h-full flex flex-col justify-center">
                  <h3 className="text-2xl font-bold mb-8 text-[#fbbf24] flex items-center gap-3">
                    <TrendingUp className="w-6 h-6" /> Typical Results
                  </h3>
                  <div className="space-y-8">
                    {solution.results.map((result, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#fbbf24]/10 border border-[#fbbf24]/20 flex flex-shrink-0 items-center justify-center text-[#fbbf24] font-bold text-lg shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]">
                          {i + 1}
                        </div>
                        <p className="text-zinc-200 font-medium text-lg leading-relaxed pt-2">
                          {result}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center bg-[#050505]/80 backdrop-blur-2xl border border-white/[0.1] shadow-[0_20px_40px_rgba(0,0,0,0.6),inset_0_1px_0_0_rgba(255,255,255,0.1)] rounded-[3rem] p-16 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-[#fbbf24]/15 to-transparent opacity-50 pointer-events-none" />
          <h2 className="text-4xl font-bold mb-4 text-white relative z-10">
            Not Sure Which Solution Fits?
          </h2>
          <p className="text-zinc-400 text-xl mb-10 max-w-2xl mx-auto relative z-10">
            Schedule a consultation to discuss your specific use case and ROI
            targets.
          </p>

          <Button
            className="bg-white text-black hover:bg-zinc-200 font-bold rounded-2xl px-10 h-14 text-lg shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-105 transition-all duration-300 relative z-10"
            onClick={() => navigate("/contact")}
          >
            Talk to Solutions Team
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Solutions;