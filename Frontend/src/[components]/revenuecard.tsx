import { HoverEffect } from "@/components/ui/card-hover-effect";
// 1. Import the icons you need
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
    <div className="max-w-5xl mx-auto px-8">
      <HoverEffect items={projects} />
    </div>
  );
}

// Define common styling for consistency
const iconClasses = "w-12 h-12 text-primary mb-2";

export const projects = [
  {
    title: "AI Engagement",
    // 2. Add the icon component to the data object
    icon: <Target className={iconClasses} />,
    description:
      "Automated monitoring of high-value conversations across LinkedIn, Quora, Reddit, X, and YouTube. AI-powered responses that sound human and contextual.",
    link: "#",
  },
  {
    title: "Intent Lead Capture",
    icon: <Zap className={iconClasses} />,
    description:
      "Real-time purchase intent scoring (0-100) identifies ready-to-buy prospects. Automatic lead qualification and CRM sync for immediate follow-up.",
    link: "#",
  },
  {
    title: "Competitor Conversion",
    icon: <TrendingUp className={iconClasses} />,
    description:
      "Monitor competitor mentions and intercept dissatisfied customers. Turn competitor complaints into your opportunities with smart positioning.",
    link: "#",
  },
  {
    title: "Revenue Attribution",
    icon: <DollarSign className={iconClasses} />,
    description:
      "Track the direct ROI of your social engagement. Visualize exactly how specific conversations and comments convert into signed deals and revenue.",
    link: "#",
  },
  {
    title: "Smart Filtering",
    icon: <Filter className={iconClasses} />,
    description:
      "Cut through the noise. Our AI filters out irrelevant chatter, ensuring your team only focuses on discussions with high commercial potential.",
    link: "#",
  },
  {
    title: "Automated Workflows",
    icon: <Workflow className={iconClasses} />,
    description:
      "Streamline your social selling process. Set up custom triggers and alerts to ensure you never miss a critical buying signal or follow-up opportunity.",
    link: "#",
  },
];