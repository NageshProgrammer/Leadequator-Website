import { HoverEffect } from "@/components/ui/card-hover-effect";
import {
  Target,
  Zap,
  TrendingUp,
  DollarSign,
  Filter,
  Workflow,
} from "lucide-react";

export function CardHoverEffectDemo() {
  return (
    <div className="max-w-5xl mx-auto px-8 py-3 relative z-10">
      {/* Optional: Add a subtle background glow behind the grid to make the glass pop */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#fbbf24]/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      
      <HoverEffect items={projects} />
    </div>
  );
}

// 1. Create a Premium Icon Wrapper
const IconGlassBadge = ({ children }) => (
  <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.02] border border-white/[0.05] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] group-hover:bg-[#fbbf24]/10 group-hover:border-[#fbbf24]/30 group-hover:shadow-[0_0_30px_rgba(251,191,36,0.15),inset_0_1px_0_0_rgba(255,255,255,0.1)] transition-all duration-500 ease-out">
    {children}
  </div>
);

// 2. Updated Icon Classes (lighter default, yellow on hover)
const iconClasses = "w-7 h-7 text-gray-400 group-hover:text-[#fbbf24] transition-colors duration-500 ease-out";

export const projects = [
  {
    title: "AI Engagement",
    icon: (
      <IconGlassBadge>
        <Target className={iconClasses} />
      </IconGlassBadge>
    ),
    description:
      "Automated monitoring of high-value conversations across LinkedIn, Quora, Reddit, X, and YouTube. AI-powered responses that sound human and contextual.",
    link: "#",
  },
  {
    title: "Intent Lead Capture",
    icon: (
      <IconGlassBadge>
        <Zap className={iconClasses} />
      </IconGlassBadge>
    ),
    description:
      "Real-time purchase intent scoring (0-100) identifies ready-to-buy prospects. Automatic lead qualification and CRM sync for immediate follow-up.",
    link: "#",
  },
  {
    title: "Competitor Conversion",
    icon: (
      <IconGlassBadge>
        <TrendingUp className={iconClasses} />
      </IconGlassBadge>
    ),
    description:
      "Monitor competitor mentions and intercept dissatisfied customers. Turn competitor complaints into your opportunities with smart positioning.",
    link: "#",
  },
  {
    title: "Revenue Attribution",
    icon: (
      <IconGlassBadge>
        <DollarSign className={iconClasses} />
      </IconGlassBadge>
    ),
    description:
      "Track the direct ROI of your social engagement. Visualize exactly how specific conversations and comments convert into signed deals and revenue.",
    link: "#",
  },
  {
    title: "Smart Filtering",
    icon: (
      <IconGlassBadge>
        <Filter className={iconClasses} />
      </IconGlassBadge>
    ),
    description:
      "Cut through the noise. Our AI filters out irrelevant chatter, ensuring your team only focuses on discussions with high commercial potential.",
    link: "#",
  },
  {
    title: "Automated Workflows",
    icon: (
      <IconGlassBadge>
        <Workflow className={iconClasses} />
      </IconGlassBadge>
    ),
    description:
      "Streamline your social selling process. Set up custom triggers and alerts to ensure you never miss a critical buying signal or follow-up opportunity.",
    link: "#",
  },
];