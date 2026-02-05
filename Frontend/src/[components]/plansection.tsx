"use client";

import { buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";
import { useState, useRef } from "react";
import confetti from "canvas-confetti";
import NumberFlow from "@number-flow/react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate
import { PayPalButtons } from "@paypal/react-paypal-js";
import { toast } from "sonner"; // Assuming you use Sonner for notifications

const plans = [
  // ... (Keep your plans data exactly as is)
  {
    name: "PILOT",
    price: "49",
    yearlyPrice: "25",
    period: "30-day pilot",
    features: [
      "1 brand/product to monitor",
      "Up to 1,000 conversations/month",
      "AI-suggested replies (manual send)",
      "LinkedIn + Reddit monitoring",
      "Basic intent scoring",
      "Email support",
      "30-day pilot program",
    ],
    description: "Test the platform with limited scope",
    buttonText: "Request Pilot Quote",
    href: "/sign-up",
    isPopular: false,
  },
  {
    name: "SCALE",
    price: "149",
    yearlyPrice: "75",
    period: "per month",
    features: [
      "Up to 5 brands/products",
      "Unlimited conversations",
      "Auto-replies with approval workflows",
      "All 5 platforms (LinkedIn, Quora, Reddit, X, YouTube)",
      "Advanced intent scoring + sentiment",
      "CRM integrations (Salesforce, HubSpot)",
      "Competitor watch + alerts",
      "Analytics dashboard + reports",
    ],
    description: "Full platform for growing teams",
    buttonText: "Request Scale Quote",
    href: "/sign-up",
    isPopular: true,
  },
  {
    name: "ENTERPRISE",
    price: "Custom",
    yearlyPrice: "Custom",
    period: "per month",
    features: [
      "Unlimited brands/workspaces",
      "White-label option for agencies",
      "Custom AI training on brand voice",
      "Multi-tenant workspace management",
      "SSO (Okta, Azure AD)",
      "Advanced security & compliance (SOC 2)",
      "Custom integrations + API access",
      "24/7 premium support + SLA",
    ],
    description: "For agencies and large organizations",
    buttonText: "Contact Sales",
    href: "/contact",
    isPopular: false,
  },
];

export default function CongestedPricing() {
  const [isMonthly, setIsMonthly] = useState(true);
  const navigate = useNavigate(); // Initialize navigate hook
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const switchRef = useRef<HTMLButtonElement>(null);

  const handleToggle = (checked: boolean) => {
    setIsMonthly(!checked);
    if (checked && switchRef.current) {
      const rect = switchRef.current.getBoundingClientRect();
      confetti({
        particleCount: 70,
        spread: 80,
        origin: {
          x: (rect.left + rect.width / 2) / window.innerWidth,
          y: (rect.top + rect.height / 2) / window.innerHeight,
        },
      });
    }
  };

  return (
    <div className="container">
      {/* ... Header and Toggle (Keep existing code) */}
      <div className="text-center mb-16 animate-fade-in">
        <h1 className="text-5xl font-bold mb-6">
          Transparent <span className="text-primary">Enterprise Pricing</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          All plans include AI-powered engagement, real-time monitoring, and
          intent scoring.
        </p>
      </div>

      <div className="mb-10 flex justify-center items-center gap-4">
        <Label htmlFor="billing-toggle" className="font-semibold">Monthly</Label>
        <Switch
          id="billing-toggle"
          ref={switchRef as any}
          checked={!isMonthly}
          onCheckedChange={handleToggle}
        />
        <Label htmlFor="billing-toggle" className="font-semibold">
          Annual <span className="text-primary">(Save 50%)</span>
        </Label>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {plans.map((plan, index) => {
          const currentPrice = isMonthly ? plan.price : plan.yearlyPrice;
          const isCustom = currentPrice === "Custom";

          return (
            <motion.div
              key={index}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              className={cn(
                "relative rounded-2xl border p-6 flex flex-col bg-background h-full transition-all",
                plan.isPopular ? "border-primary border-2 shadow-xl scale-105 z-10" : "border-border"
              )}
            >
              {/* ... Popular Badge and Plan Info (Keep existing code) */}
              {plan.isPopular && (
                <div className="bg-primary absolute top-0 right-0 rounded-tr-xl rounded-bl-xl px-3 py-1 flex items-center gap-1">
                  <Star className="text-primary-foreground h-4 w-4 fill-current" />
                  <span className="text-primary-foreground text-xs font-bold uppercase">Popular</span>
                </div>
              )}

              <div className="flex-1">
                <p className="text-muted-foreground font-bold tracking-wider">{plan.name}</p>
                <div className="mt-4 flex items-baseline gap-1">
                  {isCustom ? (
                    <span className="text-4xl font-bold">Custom</span>
                  ) : (
                    <>
                      <span className="text-5xl font-bold">
                        <NumberFlow
                          value={Number(currentPrice)}
                          format={{ style: "currency", currency: "USD", minimumFractionDigits: 0 }}
                        />
                      </span>
                      <span className="text-muted-foreground text-sm">/{plan.period}</span>
                    </>
                  )}
                </div>
                <p className="text-muted-foreground text-xs mt-1 mb-6">
                  {isCustom ? "Tailored to your needs" : isMonthly ? "billed monthly" : "billed annually"}
                </p>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <Check className="text-primary h-4 w-4 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto pt-6 border-t border-border">
                {isCustom ? (
                  <Link
                    to="/contact"
                    className={cn(buttonVariants({ variant: "default" }), "w-full py-6 text-lg")}
                  >
                    Contact Sales
                  </Link>
                ) : (
                  <div className="z-0">
                    <PayPalButtons
                      style={{ layout: "vertical", label: "buynow", height: 45, tagline: false }}
                      forceReRender={[currentPrice, isMonthly]}
                      createOrder={(data, actions) => {
                        return actions.order.create({
                          intent: "CAPTURE",
                          purchase_units: [{
                            description: `${plan.name} Plan (${isMonthly ? 'Monthly' : 'Annual'})`,
                            amount: { currency_code: "USD", value: currentPrice }
                          }]
                        });
                      }}
                      onApprove={async (data, actions) => {
                        // 1. Show a loading toast
                        const promise = actions.order?.capture().then((details) => {
                            console.log("Payment Successful:", details);
                            // 2. Redirect to onboarding
                            navigate("/onboarding");
                        });

                        toast.promise(promise!, {
                            loading: 'Processing your payment...',
                            success: 'Payment successful! Redirecting...',
                            error: 'Payment captured but redirection failed. Please contact support.',
                        });
                      }}
                      onError={(err) => {
                        console.error("PayPal Error:", err);
                        toast.error("There was an error with the payment process.");
                      }}
                    />
                  </div>
                )}
                <p className="text-center text-xs text-muted-foreground mt-4">{plan.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}