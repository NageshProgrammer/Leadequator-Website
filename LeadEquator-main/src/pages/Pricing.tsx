import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { ShineBorder } from "@/components/ui/shine-border";
import { Link } from "react-router-dom";

const Pricing = () => {
  /* -------- FUNCTIONAL LOGIC ONLY -------- */

  const handlePlanAction = (planName: string) => {
    // later: route to contact form / API / modal
    alert(`Request submitted for ${planName} plan`);
  };

  const handlePilotCTA = () => {
    alert("Pilot Program request initiated");
  };

  const plans = [
    {
      name: "Pilot",
      price: "Custom",
      description: "Test the platform with limited scope",
      features: [
        "1 brand/product to monitor",
        "Up to 1,000 conversations/month",
        "AI-suggested replies (manual send)",
        "LinkedIn + Reddit monitoring",
        "Basic intent scoring",
        "Email support",
        "30-day pilot program",
      ],
      cta: "Request Pilot Quote",
      highlighted: false,
    },
    {
      name: "Scale",
      price: "Custom",
      description: "Full platform for growing teams",
      features: [
        "Up to 5 brands/products",
        "Unlimited conversations",
        "Auto-replies with approval workflows",
        "All 5 platforms (LinkedIn, Quora, Reddit, X, YouTube)",
        "Advanced intent scoring + sentiment",
        "CRM integrations (Salesforce, HubSpot)",
        "Competitor watch + alerts",
        "Analytics dashboard + reports",
        "Dedicated success manager",
        "Priority support",
      ],
      cta: "Request Scale Quote",
      highlighted: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For agencies and large organizations",
      features: [
        "Unlimited brands/workspaces",
        "Unlimited conversations",
        "White-label option for agencies",
        "Custom AI training on brand voice",
        "Multi-tenant workspace management",
        "SSO (Okta, Azure AD)",
        "Advanced security & compliance (SOC 2)",
        "Custom integrations + API access",
        "Dedicated infrastructure (optional)",
        "24/7 premium support + SLA",
        "Quarterly business reviews",
      ],
      cta: "Contact Sales",
      highlighted: false,
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl font-bold mb-6">
            Transparent <span className="text-primary">Enterprise Pricing</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            All plans include AI-powered engagement, real-time monitoring, and
            intent scoring. Pricing scales with your volume and team size.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`p-8 ${
                plan.highlighted
                  ? "bg-gradient-to-b from-primary/10 to-background border-primary shadow-xl shadow-primary/20 scale-105"
                  : "bg-card border-border"
              } transition-all hover:scale-105 animate-fade-in`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {plan.highlighted && (
                <div className="text-center mb-4">
                  <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-bold">
                    MOST POPULAR
                  </span>
                </div>
              )}
      
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold text-primary mb-2">
                  {plan.price}
                </div>
                <p className="text-muted-foreground text-sm">
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>


              <Link to="/onboarding">
              <Button
                className={`w-full ${
                  plan.highlighted
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/90"
                }`}
              >
                {plan.cta}
              </Button>
              </Link>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-24">
          <h2 className="text-4xl font-bold text-center mb-12">
            Pricing <span className="text-primary">Questions</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                q: "What determines custom pricing?",
                a: "Volume of conversations monitored, number of brands/workspaces, team size, and required integrations. Contact us for a tailored quote.",
              },
              {
                q: "Is there a free trial?",
                a: "We offer a 30-day Pilot program with limited scope to prove ROI before committing to full deployment.",
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
              <Card key={index} className="p-6 bg-card border-border">
                <h3 className="font-bold mb-2">{faq.q}</h3>
                <p className="text-muted-foreground text-sm">{faq.a}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-12">
          <h2 className="text-3xl font-bold mb-4">
            Ready to See ROI in 30 Days?
          </h2>
          <p className="text-muted-foreground text-lg mb-6">
            Start with a Pilot program and scale when you see results.
          </p>
          <Button
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handlePilotCTA}
          >
            Request Pilot Program
          </Button>
        </div>

      </div>
    </div>
  );
};

export default Pricing;
