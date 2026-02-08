"use client";

import { buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check, Star, IndianRupee, DollarSign } from "lucide-react";
import { useState, useRef, useEffect } from "react"; // Added useEffect
import confetti from "canvas-confetti";
import NumberFlow from "@number-flow/react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Link, useNavigate } from "react-router-dom";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js"; // Import reducer hook
import { toast } from "sonner";

const plans = [
  {
    name: "PILOT",
    pricing: {
      USD: { monthly: 49, yearly: 25 },
      INR: { monthly: 3999, yearly: 1999 },
    },
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
    buttonText: "Activate Pilot",
    href: "/sign-up",
    isPopular: false,
  },
  {
    name: "SCALE",
    pricing: {
      USD: { monthly: 149, yearly: 75 },
      INR: { monthly: 11999, yearly: 5999 },
    },
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
    buttonText: "Get Scale Access",
    href: "/sign-up",
    isPopular: true,
  },
  {
    name: "ENTERPRISE",
    pricing: {
      USD: { monthly: "Custom", yearly: "Custom" },
      INR: { monthly: "Custom", yearly: "Custom" },
    },
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
  const [currency, setCurrency] = useState<"USD" | "INR">("USD");
  const navigate = useNavigate();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const switchRef = useRef<HTMLButtonElement>(null);

  // 1. Access the PayPal Script Reducer
  const [{ options }, dispatch] = usePayPalScriptReducer();

  // 2. Use Effect to Reload Script when Currency Changes
  useEffect(() => {
    dispatch({
      type: "resetOptions",
      value: {
        ...options,
        currency: currency,
      },
    });
  }, [currency]);

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
    <div className="container py-12">
      <div className="text-center mb-16 animate-fade-in">
        <h1 className="text-5xl font-bold mb-6">
          Transparent <span className="text-primary">Pricing</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          All plans include AI-powered engagement, real-time monitoring, and
          intent scoring.
        </p>
      </div>

      <div className="flex flex-col items-center gap-6 mb-12">
        {/* Currency Toggle */}
        <div className="bg-zinc-900 p-1 rounded-lg inline-flex">
          <button
            onClick={() => setCurrency("USD")}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2",
              currency === "USD"
                ? "bg-primary text-black shadow-lg"
                : "text-zinc-400 hover:text-white",
            )}
          >
            <DollarSign className="w-4 h-4" /> USD ($)
          </button>
          <button
            onClick={() => setCurrency("INR")}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2",
              currency === "INR"
                ? "bg-primary text-black shadow-lg"
                : "text-zinc-400 hover:text-white",
            )}
          >
            <IndianRupee className="w-4 h-4" /> INR (₹)
          </button>
        </div>

        {/* Monthly/Annual Toggle */}
        <div className="flex justify-center items-center gap-4">
          <Label htmlFor="billing-toggle" className="font-semibold text-white">
            Monthly
          </Label>
          <Switch
            id="billing-toggle"
            ref={switchRef as any}
            checked={!isMonthly}
            onCheckedChange={handleToggle}
          />
          <Label htmlFor="billing-toggle" className="font-semibold text-white">
            Annual <span className="text-primary">(Save 50%)</span>
          </Label>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 xl:gap-0 lg:gap-0">
        {plans.map((plan, index) => {
          const currentPrice = isMonthly
            ? plan.pricing[currency].monthly
            : plan.pricing[currency].yearly;
          const isCustom = currentPrice === "Custom";

          return (
            <motion.div
              key={index}
              initial={{ y: 50, opacity: 1 }}
              whileInView={
                isDesktop
                  ? {
                      y: plan.isPopular ? -20 : 0,
                      opacity: 1,
                      x: index === 2 ? -30 : index === 0 ? 30 : 0,
                      scale: index === 0 || index === 2 ? 0.94 : 1.0,
                    }
                  : {}
              }
              viewport={{ once: true }}
              transition={{
                duration: 1.6,
                type: "spring",
                stiffness: 100,
                damping: 30,
                delay: 0.4,
                opacity: { duration: 0.5 },
              }}
              className={cn(
                `bg-background relative rounded-2xl border-[1px] p-6 text-center lg:flex lg:flex-col lg:justify-center`,
                plan.isPopular ? "border-primary border-2" : "border-border",
                "flex flex-col",
                !plan.isPopular && "mt-5",
                index === 0 || index === 2
                  ? "z-0 translate-x-0 translate-y-0 -translate-z-[50px] rotate-y-[10deg] transform"
                  : "z-10",
                index === 0 && "origin-right",
                index === 2 && "origin-left",
              )}
            >
              {plan.isPopular && (
                <div className="bg-primary absolute -top-4 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 flex items-center gap-1">
                  <Star className="text-primary-foreground h-3 w-3 fill-current" />
                  <span className="text-primary-foreground text-xs font-bold uppercase">
                    Popular
                  </span>
                </div>
              )}

              <div className="flex-1">
                <p className="text-zinc-500 font-bold tracking-wider">
                  {plan.name}
                </p>
                <div className="mt-4 flex items-baseline gap-1">
                  {isCustom ? (
                    <span className="text-4xl font-bold text-white">
                      Custom
                    </span>
                  ) : (
                    <>
                      <span className="text-5xl font-bold text-white">
                        <NumberFlow
                          value={Number(currentPrice)}
                          format={{
                            style: "currency",
                            currency: currency,
                            minimumFractionDigits: 0,
                          }}
                        />
                      </span>
                      <span className="text-zinc-500 text-sm">
                        /{isMonthly ? "mo" : "yr"}
                      </span>
                    </>
                  )}
                </div>
                <p className="text-zinc-500 text-xs mt-1 mb-8">
                  {isCustom
                    ? "Tailored for enterprises"
                    : isMonthly
                      ? "billed monthly"
                      : "billed annually"}
                </p>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-sm text-zinc-300"
                    >
                      <Check className="text-primary h-5 w-5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto pt-6 border-t border-zinc-900">
                {isCustom ? (
                  <Link
                    to="/contact"
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "w-full py-6 text-lg border-zinc-700 hover:border-primary text-white",
                    )}
                  >
                    Contact Sales
                  </Link>
                ) : (
                  <div className="z-0">
                    <PayPalButtons
                      style={{
                        layout: "vertical",
                        label: "buynow",
                        height: 45,
                        tagline: false,
                      }}
                      forceReRender={[currentPrice, isMonthly, currency]}
                      createOrder={(data, actions) => {
                        return actions.order.create({
                          intent: "CAPTURE",
                          purchase_units: [
                            {
                              description: `${plan.name} Plan (${isMonthly ? "Monthly" : "Annual"})`,
                              amount: {
                                currency_code: currency, // Now matches script options
                                value: String(currentPrice),
                              },
                            },
                          ],
                        });
                      }}
                      onApprove={async (data, actions) => {
                        const toastId = toast.loading("Verifying payment...");
                        try {
                          if (!actions.order)
                            throw new Error("Order actions not available");

                          // 1. Capture Payment on PayPal Side
                          const details = await actions.order.capture();
                          console.log("PayPal Capture Success:", details);

                          // --- TEMPORARILY COMMENTED OUT BACKEND VERIFICATION ---
                          // const response = await fetch("http://localhost:5000/api/verify-payment", { ... });
                          // const verification = await response.json();
                          // if (!response.ok || !verification.success) throw new Error(...);

                          // 2. Just assume success for frontend testing
                          toast.success(
                            "Payment verified! Account upgrading...",
                            { id: toastId },
                          );
                          setTimeout(() => navigate("/onboarding"), 1500);
                        } catch (err: any) {
                          console.error("Payment Error:", err);
                          toast.error("Payment failed. Please try again.", {
                            id: toastId,
                          });
                        }
                      }}
                      onError={(err) => {
                        console.error("PayPal Popup Error:", err);
                        toast.error("Error: Check console for details.");
                      }}
                    />
                  </div>
                )}
                <p className="text-center text-xs text-zinc-500 mt-4">
                  {plan.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
