import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  Brain,
  MessageSquare,
  Eye,
  Zap,
  Lock,
  Database,
  Shield,
} from "lucide-react";

const Product = () => {
  const features = [
    {
      icon: Activity,
      title: "Real-Time Monitoring Streams",
      description:
        "Track conversations across LinkedIn, Quora, Reddit, X (Twitter), and YouTube. Filter by keywords, hashtags, influencer mentions, and competitor brands.",
      badge: "Core",
    },
    {
      icon: Brain,
      title: "Intent Scoring (0-100)",
      description:
        "AI analyzes conversation context, urgency signals, and buying language to score lead quality. Prioritize high-intent prospects automatically.",
      badge: "AI",
    },
    {
      icon: MessageSquare,
      title: "AI Reply Generation",
      description:
        "Generate contextual, human-like responses in your brand voice. Choose auto-send or suggest mode with approval workflows for compliance.",
      badge: "AI",
    },
    {
      icon: Eye,
      title: "Competitor Watch",
      description:
        "Monitor competitor mentions, complaints, and customer pain points. Receive alerts when opportunities arise to position your solution.",
      badge: "Intelligence",
    },
    {
      icon: Zap,
      title: "CRM & Integration Sync",
      description:
        "Seamless integration with Salesforce, HubSpot, Pipedrive. Auto-create leads with full conversation context and intent scores.",
      badge: "Integration",
    },
    {
      icon: Lock,
      title: "Enterprise Security",
      description:
        "GDPR & CCPA compliant. SSO via Okta/Azure AD. Role-based access controls. SOC 2 Type II certified. Data encryption at rest and in transit.",
      badge: "Security",
    },
    {
      icon: Database,
      title: "Analytics & Attribution",
      description:
        "Track conversation-to-lead conversion rates, engagement metrics, ROI by platform. Custom dashboards and exportable reports.",
      badge: "Analytics",
    },
    {
      icon: Shield,
      title: "Compliance & Moderation",
      description:
        "Built-in content moderation to avoid brand risk. Approval workflows for regulated industries. Audit trails for all AI-generated content.",
      badge: "Governance",
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl font-bold mb-6">
            Enterprise-Grade <span className="text-primary">AI Platform</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Built for PR teams, growth marketers, and agencies who need to scale
            organic engagement without sacrificing quality or compliance.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-8 bg-card border-border hover:shadow-xl transition-all hover:scale-105 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between mb-4">
                <feature.icon className="w-10 h-10 text-primary" />
                <Badge variant="secondary" className="text-xs">
                  {feature.badge}
                </Badge>
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>

        {/* Platform Capabilities */}
        <div className="mt-24">
          <h2 className="text-4xl font-bold text-center mb-12">
            Built for <span className="text-primary">Scale & Control</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 bg-background border-border">
              <h3 className="text-2xl font-bold mb-4">Automation Engine</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-primary mr-2">▸</span>
                  IF/THEN conditional logic for response triggers
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">▸</span>
                  Keyword + sentiment + intent score combinations
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">▸</span>
                  Schedule replies for optimal engagement times
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">▸</span>
                  A/B test reply variants and track performance
                </li>
              </ul>
            </Card>

            <Card className="p-8 bg-background border-border">
              <h3 className="text-2xl font-bold mb-4">Team Collaboration</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-primary mr-2">▸</span>
                  Multi-user workspaces with role permissions
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">▸</span>
                  Shared templates and brand voice guidelines
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">▸</span>
                  Internal notes and conversation assignments
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">▸</span>
                  Activity logs and performance leaderboards
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
