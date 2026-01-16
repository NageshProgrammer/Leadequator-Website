import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import { DashboardLayout } from "./components/dashboard/DashboardLayout";
import Home from "./pages/Home";
import Product from "./pages/Product";
import Solutions from "./pages/Solutions";
import Pricing from "./pages/Pricing";
import DashboardOverview from "./pages/DashboardOverview";
import MonitorStream from "./pages/MonitorStream";
import LeadsPipeline from "./pages/LeadsPipeline";
import AutomationsBuilder from "./pages/AutomationsBuilder";
import CompetitorWatch from "./pages/CompetitorWatch";
import CommentTimeline from "./pages/CommentTimeline";
import Reports from "./pages/Reports";
import SettingsIntegrations from "./pages/SettingsIntegrations";
import Resources from "./pages/Resources";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import Problems from "./pages/Problems";
import Solution from "./pages/Solution";
import Working from "./pages/Working";
import Features from "./pages/Features";
import {
  RedirectToSignIn,
  SignedIn,
  SignedOut,
  SignIn,
  SignUp,
} from "@clerk/clerk-react";
import Provider from "../Provider";
import Onboarding from "./pages/Onboarding";
import ConversionHero from "./[components]/loginpagesideview";

const queryClient = new QueryClient();

const PublicLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex flex-col">
    <Navigation />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Provider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes - Anyone can see these */}
            <Route
              path="/"
              element={
                <PublicLayout>
                  <Home />
                </PublicLayout>
              }
            />
            <Route
              path="/working"
              element={
                <PublicLayout>
                  <Working />
                </PublicLayout>
              }
            />
            <Route
              path="/features"
              element={
                <PublicLayout>
                  <Features />
                </PublicLayout>
              }
            />
            <Route
              path="/solutions"
              element={
                <PublicLayout>
                  <Solution />
                </PublicLayout>
              }
            />
            <Route
              path="/pricing"
              element={
                <PublicLayout>
                  <Pricing />
                </PublicLayout>
              }
            />
            <Route
              path="/problems"
              element={
                <PublicLayout>
                  <Problems />
                </PublicLayout>
              }
            />

            <Route
              path="/onboarding"
              element={
                  <Onboarding />
              }
            />

            {/* Clerk Auth Pages - Explicit Redirects added */}
            <Route
              path="/sign-in/*"
              element={
                <div className="min-h-screen flex items-center w-screen bg-black">
                  <div className="hidden lg:flex w-1/2 items-center justify-center">
                    <ConversionHero />
                  </div>
                  <div className="w-full lg:w-1/2 flex items-center justify-center">
                  <SignIn
                    routing="path"
                    path="/sign-in"
                    signUpUrl="/sign-up"
                    forceRedirectUrl="/onboarding"
                  />                  
                  </div>
                </div>
              }
            />
            <Route
              path="/sign-up/*"
              element={
                <div className="min-h-screen w-screen flex bg-black">
                  
                  <div className="hidden lg:flex w-1/2 items-center justify-center">
                    <ConversionHero />
                  </div>

                  {/* Right side – Signup */}
                  <div className="w-full lg:w-1/2 flex items-center justify-center">
                    <SignUp
                      routing="path"
                      path="/sign-up"
                      signInUrl="/sign-in"
                      forceRedirectUrl="/onboarding"
                    />
                  </div>
                </div>
              }
            />

            {/* Protected Routes - ONLY signed-in users can see these */}
            <Route
              element={
                <>
                  <SignedIn>
                    <DashboardLayout />
                  </SignedIn>
                  <SignedOut>
                    <RedirectToSignIn />
                  </SignedOut>
                </>
              }
            >
              <Route path="/dashboard" element={<DashboardOverview />} />
              <Route path="/monitor-stream" element={<MonitorStream />} />
              <Route path="/comment-timeline" element={<CommentTimeline />} />
              <Route path="/leads-pipeline" element={<LeadsPipeline />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route
                path="/automations-builder"
                element={<AutomationsBuilder />}
              />
              <Route path="/competitor-watch" element={<CompetitorWatch />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<SettingsIntegrations />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
