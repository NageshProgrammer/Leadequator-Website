import { Card } from "@/components/ui/card";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { Target, Users, Lightbulb, Award } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen pt-24 pb-12 text-white bg-background selection:bg-[#fbbf24]/30 relative z-10 overflow-hidden">
      <ScrollProgress className="top-[65px]" />
      
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#fbbf24]/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Header */}
        <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.1] text-[#fbbf24] font-bold tracking-widest text-xs uppercase mb-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
            Our Story
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">
            Turning Conversations Into{" "}
            <span className="text-[#fbbf24] drop-shadow-[0_0_15px_rgba(251,191,36,0.3)]">Revenue</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed">
            We believe the future of B2B growth isn't paid ads—it's earned influence through authentic, AI-powered engagement at scale.
          </p>
        </div>

        {/* Mission - Large Premium Glass Card */}
        <div className="p-12 md:p-16 bg-[#050505]/20 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8px_30px_rgb(0,0,0,0.2),inset_0_1px_0_0_rgba(255,255,255,0.05)] rounded-[3rem] mb-24 relative overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-[#fbbf24]/50 to-transparent" />
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="w-20 h-20 rounded-2xl bg-[#fbbf24]/10 border border-[#fbbf24]/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] flex items-center justify-center mx-auto mb-8">
              <Target className="w-10 h-10 text-[#fbbf24]" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white">Our Mission</h2>
            <p className="text-lg md:text-xl text-zinc-300 leading-relaxed font-medium">
              Leadequator was founded on a simple observation: the best leads come from organic conversations where buyers are already expressing intent. Traditional PR agencies charge $20K/month for manual engagement that doesn't scale. Paid ads get blocked, ignored, and waste budget on cold prospects. We built Leadequator to automate what great PR teams do—monitor high-value conversations, respond contextually, and convert interest into revenue—but at enterprise scale with measurable ROI.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mb-24">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-16 tracking-tight">
            What We <span className="text-[#fbbf24]">Stand For</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Lightbulb,
                title: "Authenticity Over Automation",
                desc: "Our AI generates human-like replies that add value to conversations, not spammy sales pitches. We believe in earning trust, not gaming algorithms.",
              },
              {
                icon: Users,
                title: "Customer Success First",
                desc: "We don't just sell software—we partner with you to hit your pipeline targets. Every customer gets a dedicated success manager and quarterly ROI reviews.",
              },
              {
                icon: Award,
                title: "Transparency & Compliance",
                desc: "GDPR/CCPA compliant by design. Full audit trails for AI-generated content. We're SOC 2 Type II certified because enterprise trust matters.",
              },
            ].map((value, index) => (
              <div
                key={index}
                className="p-10 bg-[#050505]/20 backdrop-blur-xl border border-white/[0.05] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] rounded-[2.5rem] hover:border-white/[0.15] hover:shadow-[0_8px_40px_rgba(251,191,36,0.1)] hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center mb-6 group-hover:bg-[#fbbf24]/10 transition-colors">
                  <value.icon className="w-7 h-7 text-[#fbbf24]" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-zinc-100 group-hover:text-white transition-colors">{value.title}</h3>
                <p className="text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mb-24">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-16 tracking-tight">
            Leadership <span className="text-[#fbbf24]">Team</span>
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                name: "Alex Chen",
                role: "CEO & Co-Founder",
                bio: "Former VP of Growth at Series C SaaS. Built demand gen engine that scaled to $50M ARR.",
              },
              {
                name: "Sarah Martinez",
                role: "CTO & Co-Founder",
                bio: "Ex-Google ML Engineer. Led NLP and sentiment analysis for social products at scale.",
              },
              {
                name: "Mike Johnson",
                role: "VP of Product",
                bio: "15 years building enterprise B2B tools. Previously PM at Salesforce and HubSpot.",
              },
              {
                name: "Emma Lee",
                role: "VP of Customer Success",
                bio: "Former agency leader. Scaled customer success org from 5 to 50 people at last startup.",
              },
            ].map((member, index) => (
              <div
                key={index}
                className="p-8 bg-[#050505]/10 backdrop-blur-xl border border-white/[0.05] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] rounded-[2rem] text-center hover:border-white/[0.15] hover:shadow-[0_8px_30px_rgba(251,191,36,0.1)] hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="w-24 h-24 rounded-full bg-[#fbbf24]/10 border border-[#fbbf24]/20 text-[#fbbf24] font-bold text-3xl flex items-center justify-center mx-auto mb-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] group-hover:scale-105 transition-transform duration-300">
                  {member.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <h3 className="font-bold text-xl mb-1 text-zinc-100">{member.name}</h3>
                <p className="text-sm text-[#fbbf24] font-medium mb-4">{member.role}</p>
                <p className="text-sm text-zinc-400 leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="p-16 bg-[#050505]/20 backdrop-blur-2xl border border-white/[0.1] shadow-[0_20px_40px_rgba(0,0,0,0.6),inset_0_1px_0_0_rgba(255,255,255,0.1)] rounded-[3rem] relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-[#fbbf24]/10 to-transparent opacity-50 pointer-events-none" />
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-16 text-white relative z-10">
            By The Numbers
          </h2>
          <div className="grid md:grid-cols-4 gap-8 text-center relative z-10">
            {[
              { value: "$142M", label: "Pipeline Generated" },
              { value: "340+", label: "Enterprise Customers" },
              { value: "18.2M", label: "Conversations Monitored" },
              { value: "99.7%", label: "Uptime SLA" },
            ].map((stat, index) => (
              <div key={index} className="flex flex-col items-center justify-center">
                <div className="text-5xl font-black text-[#fbbf24] mb-4 drop-shadow-[0_0_15px_rgba(251,191,36,0.2)] tracking-tight">
                  {stat.value}
                </div>
                <div className="text-base font-semibold text-zinc-400 uppercase tracking-widest">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;