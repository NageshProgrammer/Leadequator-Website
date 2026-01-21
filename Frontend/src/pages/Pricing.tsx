import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import CongestedPricing from "@/[components]/plansection";
import { ScrollProgress } from "@/components/ui/scroll-progress";

const Pricing = () => {
  /* -------- FUNCTIONAL LOGIC -------- */

  const handlePilotCTA = () => {
    // This logic remains for the bottom button if you prefer an alert, 
    // but typically you'd wrap this in a Link as well.
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
      path: "/sign-up/", // Redirects to Sign Up as requested
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
      path: "/sign-up/",
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
      path: "/contact", // Redirects to Contact as requested
      highlighted: false,
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12">
      <ScrollProgress className="top-[65px]" />
      <div className="container mx-auto px-4">
        
        

        {/* Pricing Cards */}
        
          <CongestedPricing/>



        {/* FAQ Section */}
        <div className="mt-24">
          <h2 className="text-4xl font-bold text-center mb-12">
            Pricing <span className="text-primary">Questions</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
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
          <Link to="/sign-up">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
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