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
  import { useMediaQuery } from "@/hooks/use-media-query"; // Ensure you have this hook
  import { Link, useNavigate } from "react-router-dom";
  import { PayPalButtons } from "@paypal/react-paypal-js";
  import { toast } from "sonner";

  // Plan Configuration
  const plans = [
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
      buttonText: "Activate Pilot",
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
      buttonText: "Get Scale Access",
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
    const navigate = useNavigate();
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

        <div className="mb-10 flex justify-center items-center gap-4">
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

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 xl:gap-0 lg:gap-0">
          {plans.map((plan, index) => {
            const currentPrice = isMonthly ? plan.price : plan.yearlyPrice;
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
                              currency: "USD",
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
                        forceReRender={[currentPrice, isMonthly]}
                        createOrder={(data, actions) => {
                          return actions.order.create({
                            intent: "CAPTURE",
                            purchase_units: [
                              {
                                description: `${plan.name} Plan (${isMonthly ? "Monthly" : "Annual"})`,
                                amount: {
                                  currency_code: "USD",
                                  value: currentPrice,
                                },
                              },
                            ],
                          });
                        }}
                        onApprove={async (data, actions) => {
                          // 1. Start Loading UI
                          const toastId = toast.loading("Verifying payment...");

                          try {
                            if (!actions.order)
                              throw new Error("Order actions not available");

                            // 2. Capture Payment on PayPal Side
                            const details = await actions.order.capture();
                            console.log("PayPal Capture Success:", details);

                            // 3. SERVER-SIDE VERIFICATION
                            // We verify with our backend to ensure the price wasn't manipulated
                            const response = await fetch(
                              "http://localhost:5000/api/verify-payment",
                              {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                  orderID: data.orderID,
                                  planType: plan.name,
                                  userEmail: details.payer.email_address, // Or your logged-in user email
                                }),
                              },
                            );

                            const verification = await response.json();

                            if (!response.ok || !verification.success) {
                              throw new Error(
                                verification.message ||
                                  "Backend verification failed",
                              );
                            }

                            // 4. Success State
                            toast.success(
                              "Payment verified! Account upgrading...",
                              { id: toastId },
                            );

                            // 5. Redirect
                            setTimeout(() => {
                              navigate("/onboarding");
                            }, 1500);
                          } catch (err: any) {
                            console.error("Payment Process Error:", err);

                            // If backend fails but PayPal succeeded, we warn the user but don't block them entirely
                            // (or you can block them if security is strict)
                            if (
                              err.message === "Backend verification failed" ||
                              err.message.includes("fetch")
                            ) {
                              toast.warning(
                                "Payment received, but verification is taking longer than expected. Contact support.",
                                { id: toastId },
                              );
                              // Optional: Redirect anyway if you trust the client capture for now
                              // setTimeout(() => navigate("/onboarding"), 3000);
                            } else {
                              toast.error("Payment failed. Please try again.", {
                                id: toastId,
                              });
                            }
                          }
                        }}
                        onError={(err) => {
                          console.error("PayPal Popup Error:", err);
                          toast.error(
                            "The payment window was closed or encountered an error.",
                          );
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
