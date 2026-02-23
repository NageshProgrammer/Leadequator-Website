import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SignedIn, SignIn, SignUp } from "@clerk/clerk-react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js"; // Import added

import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import { DashboardLayout } from "./components/dashboard/DashboardLayout";

import Home from "./pages/Home";
import Pricing from "./pages/Pricing";
import Problems from "./pages/Problems";
import Solution from "./pages/Solution";
import Working from "./pages/Working";
import Features from "./pages/Features";
import Onboarding from "./pages/Onboarding";
import DashboardOverview from "./pages/DashboardOverview";
import MonitorStream from "./pages/MonitorStream";
import LeadsPipeline from "./pages/LeadsPipeline";
import AutomationsBuilder from "./pages/AutomationsBuilder";
import CompetitorWatch from "./pages/CompetitorWatch";
import CommentTimeline from "./pages/CommentTimeline";
import Reports from "./pages/Reports";
import SettingsIntegrations from "./pages/SettingsIntegrations";
import NotFound from "./pages/NotFound";

import ConversionHero from "./[components]/loginpagesideview";
import Provider from "../Provider";
import LeadDiscovery from "./pages/LeadDiscovery";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Resources from "./pages/Resources";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import RefundPolicy from "./pages/Refund";
import ShippingPolicy from "./pages/Shipping";
import CongestedPricing from "./[components]/plansection";
import ComingSoon from "./pages/comingsoon";

const queryClient = new QueryClient();

// PayPal Configuration
const initialPayPalOptions = {
  clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || "test", 
  currency: "USD",
  intent: "capture",
};

const PublicLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex flex-col">
    <Navigation />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Provider>
          {/* PayPal Provider wraps the Router */}
          <PayPalScriptProvider options={initialPayPalOptions}>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* ================= PUBLIC ROUTES ================= */}
                <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
                <Route path="/working" element={<PublicLayout><Working /></PublicLayout>} />
                <Route path="/features" element={<PublicLayout><Features /></PublicLayout>} />
                <Route path="/solutions" element={<PublicLayout><Solution /></PublicLayout>} />
                <Route path="/pricing" element={<PublicLayout><Pricing /></PublicLayout>} />
                <Route path="/problems" element={<PublicLayout><Problems /></PublicLayout>} />
                <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
                <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
                <Route path="/resources" element={<PublicLayout><Resources /></PublicLayout>} />
                <Route path="/privacy" element={<PublicLayout><Privacy /></PublicLayout>} />
                <Route path="/terms" element={<PublicLayout><Terms /></PublicLayout>} />
                <Route path="/shipping" element={<PublicLayout><ShippingPolicy /></PublicLayout>} />
                <Route path="/refund" element={<PublicLayout><RefundPolicy /></PublicLayout>} />

                <Route path="/coming-soon" element={<ComingSoon />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/lead-discovery" element={<LeadDiscovery />} />

                {/* ================= AUTH ROUTES ================= */}
                <Route
                  path="/sign-in/*"
                  element={
                    <div className="min-h-screen flex bg-black">
                      <div className="hidden lg:flex w-1/2 items-center justify-center">
                        <ConversionHero />
                      </div>
                      <div className="w-full lg:w-1/2 flex items-center justify-center">
                        <SignIn
                          routing="path"
                          path="/sign-in"
                          signUpUrl="/sign-up"
                          forceRedirectUrl="/onboarding"
                          fallbackRedirectUrl="/onboarding"
                        />
                      </div>
                    </div>
                  }
                />

                <Route
                  path="/sign-up/*"
                  element={
                    <div className="min-h-screen flex bg-black">
                      <div className="hidden lg:flex w-1/2 items-center justify-center">
                        <ConversionHero />
                      </div>
                      <div className="w-full lg:w-1/2 flex items-center justify-center">
                        <SignUp
                          routing="path"
                          path="/sign-up"
                          signInUrl="/sign-in"
                          forceRedirectUrl="/onboarding"
                          fallbackRedirectUrl="/onboarding"
                        />
                      </div>
                    </div>
                  }
                />

                {/* ================= DASHBOARD (PROTECTED) ================= */}
                <Route element={<SignedIn><DashboardLayout /></SignedIn>}>
                  <Route path="/dashboard" element={<DashboardOverview />} />
                  <Route path="/monitor-stream" element={<MonitorStream />} />
                  <Route path="/comment-timeline" element={<CommentTimeline />} />
                  <Route path="/leads-pipeline" element={<LeadsPipeline />} />
                  <Route path="/automations-builder" element={<AutomationsBuilder />} />
                  <Route path="/competitor-watch" element={<CompetitorWatch />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/user-profile" element={<SettingsIntegrations />} />
                  <Route path="/pricings" element={<CongestedPricing />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </PayPalScriptProvider>
        </Provider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}