import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, TrendingUp, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Solutions = () => {
  // ✅ initialize navigate
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
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl font-bold mb-6">
            Built for Teams That Need{" "}
            <span className="text-primary">Measurable Results</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Whether you're protecting brand reputation, generating pipeline, or
            serving clients, Leadequator delivers ROI that can be tracked to the
            dollar.
          </p>
        </div>

        {/* Solutions Cards */}
        <div className="space-y-12">
          {solutions.map((solution, index) => (
            <Card
              key={index}
              className="p-8 md:p-12 bg-card border-border animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <solution.icon className="w-12 h-12 text-primary mb-4" />
                  <h2 className="text-3xl font-bold mb-4">
                    {solution.title}
                  </h2>
                  <p className="text-muted-foreground text-lg mb-6">
                    {solution.description}
                  </p>

                  <h3 className="text-xl font-bold mb-3">Common Use Cases</h3>
                  <ul className="space-y-2 mb-6">
                    {solution.useCases.map((useCase, i) => (
                      <li
                        key={i}
                        className="flex items-start text-muted-foreground"
                      >
                        <span className="text-primary mr-2 mt-1">▸</span>
                        {useCase}
                      </li>
                    ))}
                  </ul>

                  {/* ✅ Request Demo → Contact */}
                  <Button
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={() => navigate("/contact")}
                  >
                    Request Demo
                  </Button>
                </div>

                <div className="bg-background rounded-lg p-6 border border-border">
                  <h3 className="text-xl font-bold mb-4 text-primary">
                    Typical Results
                  </h3>
                  <div className="space-y-4">
                    {solution.results.map((result, i) => (
                      <div key={i} className="flex items-start">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                        <p className="text-foreground font-medium">
                          {result}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-12">
          <h2 className="text-3xl font-bold mb-4">
            Not Sure Which Solution Fits?
          </h2>
          <p className="text-muted-foreground text-lg mb-6">
            Schedule a consultation to discuss your specific use case and ROI
            targets.
          </p>

          {/* ✅ Talk to Solutions Team → Contact */}
          <Button
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
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
