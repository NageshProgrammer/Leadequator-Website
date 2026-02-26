"use client";

import { buttonVariants, Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check, Star, IndianRupee, DollarSign, LogIn, Loader2, CreditCard } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import confetti from "canvas-confetti";
import NumberFlow from "@number-flow/react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useUser } from "@clerk/clerk-react";
import { load } from "@cashfreepayments/cashfree-js"; 
import { PayPalScriptProvider, PayPalButtons, FUNDING } from "@paypal/react-paypal-js"; 

// 🔧 API CONFIGURATION
const API_BASE = import.meta.env.MODE === "development" 
  ? "http://localhost:5000" 
  : "https://api.leadequator.live";

const plans = [
  {
    name: "PILOT",
    pricing: { USD: { monthly: 49, yearly: 25 }, INR: { monthly: 1, yearly: 1999 } },
    period: "30-day pilot",
    features: [
      "1 brand/product to monitor", "Up to 1,000 conversations/month", "AI-suggested replies (manual send)",
      "LinkedIn + Reddit monitoring", "Basic intent scoring", "Email support", "30-day pilot program"
    ],
    description: "Test the platform with limited scope",
    isPopular: false,
  },
  {
    name: "SCALE",
    pricing: { USD: { monthly: 149, yearly: 75 }, INR: { monthly: 11999, yearly: 5999 } },
    period: "per month",
    features: [
      "Up to 5 brands/products", "Unlimited conversations", "Auto-replies with approval workflows",
      "All 5 platforms (LinkedIn, Quora, Reddit, X, YouTube)", "Advanced intent scoring + sentiment",
      "CRM integrations (Salesforce, HubSpot)", "Competitor watch + alerts", "Analytics dashboard + reports"
    ],
    description: "Full platform for growing teams",
    isPopular: true,
  },
  {
    name: "ENTERPRISE",
    pricing: { USD: { monthly: "Custom", yearly: "Custom" }, INR: { monthly: "Custom", yearly: "Custom" } },
    period: "per month",
    features: [
      "Unlimited brands/workspaces", "White-label option for agencies", "Custom AI training on brand voice",
      "Multi-tenant workspace management", "SSO (Okta, Azure AD)", "Advanced security & compliance (SOC 2)",
      "Custom integrations + API access", "24/7 premium support + SLA"
    ],
    description: "For agencies and large organizations",
    isPopular: false,
  },
];

export default function CongestedPricing() {
  const [isMonthly, setIsMonthly] = useState(true);
  const [currency, setCurrency] = useState<"USD" | "INR">("USD");
  const [isCashfreeLoading, setIsCashfreeLoading] = useState(false);
  const navigate = useNavigate();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const switchRef = useRef<HTMLButtonElement>(null);
  
  const { isSignedIn, user, isLoaded } = useUser();

  const cashfreeRef = useRef<any>(null);
  useEffect(() => {
    const initializeCashfree = async () => {
      cashfreeRef.current = await load({
        mode: "production", // 🚀 LIVE MODE
      });
    };
    initializeCashfree();
  }, []);

  const handleToggle = (checked: boolean) => {
    setIsMonthly(!checked);
    if (checked && switchRef.current) {
      const rect = switchRef.current.getBoundingClientRect();
      confetti({
        particleCount: 70, spread: 80,
        origin: { x: (rect.left + rect.width / 2) / window.innerWidth, y: (rect.top + rect.height / 2) / window.innerHeight },
      });
    }
  };

  const handleCashfreePayment = async (planName: string, monthlyPrice: number | string) => {
    if (!user || !cashfreeRef.current) return;
    setIsCashfreeLoading(true);
    const toastId = toast.loading("Initializing secure payment gateway...");

    try {
      const totalChargeForPeriod = isMonthly ? Number(monthlyPrice) : Number(monthlyPrice) * 12;
      const currentCycle = isMonthly ? "MONTHLY" : "YEARLY";

      const rawPhone = user.primaryPhoneNumber?.phoneNumber || "";
      const cleanPhone = rawPhone.replace(/\D/g, '').slice(-10);
      const finalPhone = cleanPhone.length === 10 ? cleanPhone : "9999999999";

      const response = await fetch(`${API_BASE}/api/create-cashfree-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          userEmail: user.primaryEmailAddress?.emailAddress,
          userPhone: finalPhone, 
          planName: planName,
          amount: totalChargeForPeriod,
          currency: currency, 
          billingCycle: currentCycle,
        }),
      });

      if (!response.ok) throw new Error("Failed to create order");
      const { payment_session_id, order_id } = await response.json();

      toast.dismiss(toastId);

      const checkoutOptions = { paymentSessionId: payment_session_id, redirectTarget: "_modal" };

      cashfreeRef.current.checkout(checkoutOptions).then(async (result: any) => {
        if (result.error) {
          toast.error(`Payment failed: ${result.error.message}`);
        } else if (result.paymentDetails) {
          toast.loading("Verifying payment...", { id: toastId });
          const verifyRes = await fetch(`${API_BASE}/api/verify-cashfree`, {
             method: "POST",
             headers: { "Content-Type": "application/json" },
             body: JSON.stringify({ order_id, userId: user.id, planName, billingCycle: currentCycle, currency })
          });
          
          if (verifyRes.ok) {
             toast.success("Payment successful! Redirecting...", { id: toastId });
             setTimeout(() => navigate("/onboarding"), 1500);
          } else {
             toast.error("Payment received, but verification failed.", { id: toastId });
          }
        }
      });

    } catch (error) {
      toast.error("Could not initiate payment. Please try again.", { id: toastId });
    } finally {
      setIsCashfreeLoading(false);
    }
  };

  return (
    <div className="container py-12">
      <div className="text-center mb-16 animate-fade-in">
        <h1 className="text-5xl font-bold mb-6">Transparent <span className="text-primary">Pricing</span></h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">All plans include AI-powered engagement, real-time monitoring, and intent scoring.</p>
      </div>

      <div className="flex flex-col items-center gap-6 mb-12">
        <div className="bg-zinc-900 p-1 rounded-lg inline-flex">
            <button onClick={() => setCurrency("USD")} className={cn("px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2", currency === "USD" ? "bg-primary text-black shadow-lg" : "text-zinc-400 hover:text-white")}>
                <DollarSign className="w-4 h-4" /> USD ($)
            </button>
            <button onClick={() => setCurrency("INR")} className={cn("px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2", currency === "INR" ? "bg-primary text-black shadow-lg" : "text-zinc-400 hover:text-white")}>
                <IndianRupee className="w-4 h-4" /> INR (₹)
            </button>
        </div>

        <div className="flex justify-center items-center gap-4">
            <Label htmlFor="billing-toggle" className="font-semibold text-white">Monthly</Label>
            <Switch id="billing-toggle" ref={switchRef as any} checked={!isMonthly} onCheckedChange={handleToggle}/>
            <Label htmlFor="billing-toggle" className="font-semibold text-white">Annual <span className="text-primary">(Save 50%)</span></Label>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 xl:gap-0 lg:gap-0">
        {plans.map((plan, index) => {
          const currentPrice = isMonthly ? plan.pricing[currency].monthly : plan.pricing[currency].yearly;
          const isCustom = currentPrice === "Custom";

          return (
            <motion.div key={index} 
              initial={{ y: 50, opacity: 1 }}
              whileInView={isDesktop ? { y: plan.isPopular ? -20 : 0, opacity: 1, x: index === 2 ? -30 : index === 0 ? 30 : 0, scale: index === 0 || index === 2 ? 0.94 : 1.0 } : {}}
              viewport={{ once: true }}
              transition={{ duration: 1.6, type: "spring", stiffness: 100, damping: 30, delay: 0.4, opacity: { duration: 0.5 } }}
              className={cn(`bg-background relative rounded-2xl border-[1px] p-6 text-center lg:flex lg:flex-col lg:justify-center`, plan.isPopular ? "border-primary border-2" : "border-border", "flex flex-col", !plan.isPopular && "mt-5", index === 0 || index === 2 ? "z-0 translate-x-0 translate-y-0 -translate-z-[50px] rotate-y-[10deg] transform" : "z-10", index === 0 && "origin-right", index === 2 && "origin-left")}
            >
              {plan.isPopular && (
                <div className="bg-primary absolute -top-4 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 flex items-center gap-1">
                  <Star className="text-primary-foreground h-3 w-3 fill-current" />
                  <span className="text-primary-foreground text-xs font-bold uppercase">Popular</span>
                </div>
              )}

              <div className="flex-1">
                <p className="text-zinc-500 font-bold tracking-wider">{plan.name}</p>
                <div className="mt-4 flex items-baseline gap-1 justify-center">
                  {isCustom ? (
                    <span className="text-4xl font-bold text-white">Custom</span>
                  ) : (
                    <>
                      <span className="text-5xl font-bold text-white flex items-center justify-center gap-1">
                          <span>{currency === "USD" ? "$" : "₹"}</span>
                          <NumberFlow value={Number(currentPrice)} format={{ style: "decimal", minimumFractionDigits: 0 }} />
                      </span>
                      <span className="text-zinc-500 text-sm">/{isMonthly ? "mo" : "mo"}</span>
                    </>
                  )}
                </div>
                <p className="text-zinc-500 text-xs mt-1 mb-8">{isCustom ? "Tailored for enterprises" : isMonthly ? "billed monthly" : "billed annually"}</p>

                <ul className="space-y-4 mb-8 lg:pl-7">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-zinc-300">
                      <Check className="text-primary h-5 w-5 shrink-0" />
                      <span className="text-left">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto pt-6 border-t border-zinc-900">
                {isCustom ? (
                  <Link to="/contact" className={cn(buttonVariants({ variant: "outline" }), "w-full py-6 text-lg border-zinc-700 hover:border-primary text-white")}>
                    Contact Sales
                  </Link>
                ) : !isSignedIn ? (
                    <Link to="/sign-in" className={cn(buttonVariants({ variant: "default" }), "w-full py-6 text-lg bg-white text-black hover:bg-gray-200 flex items-center justify-center gap-2")}>
                      <LogIn className="w-5 h-5" />
                      {plan.name === "PILOT" ? "Start 14-Day Free Trial" : "Subscribe To Get Started"}
                    </Link>
                ) : (
                  <div className="z-0 min-h-[50px]">
                    {!isLoaded || !user?.id ? (
                      <div className="flex items-center justify-center w-full py-4 text-zinc-500">
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Loading Payment...
                      </div>
                    ) : currency === "USD" ? (
                      // SHOW PAYPAL FOR USD
                      <PayPalScriptProvider options={{ clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || "test", currency: "USD", intent: "capture" }}>
                        <PayPalButtons
                          fundingSource={FUNDING.PAYPAL}
                          style={{ layout: "vertical", label: "buynow", height: 45, tagline: false }}
                          forceReRender={[currentPrice, isMonthly]}
                          createOrder={(data, actions) => {
                            const total = isMonthly ? Number(currentPrice) : Number(currentPrice) * 12;
                            return actions.order.create({
                              intent: "CAPTURE",
                              purchase_units: [{
                                description: `${plan.name} Plan - ${isMonthly ? "Monthly" : "Annual"}`,
                                amount: { currency_code: "USD", value: total.toFixed(2) }
                              }]
                            });
                          }}
                          onApprove={async (data, actions) => {
                            const toastId = toast.loading("Verifying PayPal payment...");
                            try {
                              if (!actions.order) throw new Error("Actions missing");
                              const details = await actions.order.capture();
                              
                              const verifyRes = await fetch(`${API_BASE}/api/verify-paypal`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ 
                                  orderID: data.orderID, 
                                  userId: user.id, 
                                  planName: plan.name, 
                                  billingCycle: isMonthly ? "MONTHLY" : "YEARLY", 
                                  currency: "USD" 
                                })
                              });
                              
                              if (verifyRes.ok) {
                                toast.success("Payment successful! Redirecting...", { id: toastId });
                                setTimeout(() => navigate("/onboarding"), 1500);
                              } else {
                                throw new Error("Verification failed");
                              }
                            } catch (e) {
                              toast.error("Payment failed.", { id: toastId });
                            }
                          }}
                        />
                      </PayPalScriptProvider>
                    ) : (
                       // SHOW CASHFREE FOR INR
                       <Button 
                         disabled={isCashfreeLoading}
                         onClick={() => handleCashfreePayment(plan.name, currentPrice)}
                         className="w-full h-[45px] text-lg bg-primary hover:bg-primary/90 text-black font-semibold flex items-center justify-center gap-2 rounded-md transition-all"
                       >
                         {isCashfreeLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CreditCard className="w-5 h-5" />}
                         Proceed to Checkout
                       </Button>
                    )}
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