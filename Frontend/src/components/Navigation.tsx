"use client";
import { useState, useEffect } from "react";
import { NavLink as RouterNavLink, Link } from "react-router-dom"; 
import { Button } from "@/components/ui/button";
import { ShimmerButton } from "./ui/shimmer-button";
import { UserButton, SignedIn, SignedOut, SignIn, SignUp } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
import { Menu, X, ShieldCheck, CheckCircle2, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Helper component to handle scroll-to-top while preserving other onClick events
const NavLink = ({ to, children, className, onClick }) => {
  const handleClick = (e) => {
    window.scrollTo(0, 0); // Scroll to top
    if (onClick) onClick(e); // Fire any other passed functions (like closeMenu)
  };

  return (
    <RouterNavLink
      to={to}
      onClick={handleClick}
      className={({ isActive }) =>
        `transition-all duration-300 ease-out flex items-center justify-center ${
          isActive 
            ? "text-[#fbbf24] bg-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] rounded-full" 
            : "text-gray-300 hover:text-white hover:bg-white/[0.04] rounded-full"
        } ${className}`
      }
    >
      {children}
    </RouterNavLink>
  );
};

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Custom Auth Modal State
  const [authModal, setAuthModal] = useState(null); // "signin" | "signup" | null

  // Add a liquid glass shadow/border transition on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when modal or mobile menu is open
  useEffect(() => {
    if (isOpen || authModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen, authModal]);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/problems", label: "Problems" },
    { to: "/solutions", label: "Solutions" },
    { to: "/working", label: "How it works" },
    { to: "/pricing", label: "Pricing" },
    { to: "/contact", label: "Contact Us" },
  ];

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ease-out ${
          scrolled 
            ? "bg-[#050505]/40 backdrop-blur-[40px] backdrop-saturate-[150%] border-b border-white/[0.06] shadow-[0_4px_30px_rgba(0,0,0,0.1)]" 
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            
            {/* Logo */}
            <Link 
              to="/" 
              onClick={() => window.scrollTo(0, 0)}
              className="text-2xl font-bold flex items-center gap-2 group cursor-pointer relative z-50 shrink-0"
            >
              <img
                src="/leadequator_logo.png"
                alt="Leadequator Logo"
                className="w-10 h-10 object-contain group-hover:scale-105 transition-transform duration-400 ease-out drop-shadow-lg"
              />
              <div className="flex items-center tracking-tight">
                <span className="text-white">Lead</span>
                <span className="text-[#fbbf24]">equator</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden xl:flex items-center gap-2">
              <div className="flex items-center p-1.5 rounded-full bg-white/[0.02] border border-white/[0.05] shadow-[inset_0_1px_1px_rgba(255,255,255,0.03)] backdrop-blur-md">
                {navLinks.map((link) => (
                  <NavLink 
                    key={link.to} 
                    to={link.to} 
                    className="text-sm font-medium px-4 py-2"
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>

              <div className="flex items-center gap-4 pl-4 ml-2 border-l border-white/[0.08]">
                <SignedOut>
                  {/* Triggers Auth Modal instead of linking to route */}
                  <button onClick={() => setAuthModal("sign-in")}>
                    <ShimmerButton 
                      shimmerColor="#fbbf24" 
                      borderRadius="9999px" 
                      className="h-10 px-6 text-sm font-medium bg-white/[0.03] border border-white/[0.05]"
                    >
                      Login
                    </ShimmerButton>
                  </button>
                  <NavLink to="/pricing">
                    <Button className="bg-[#fbbf24] text-black hover:bg-[#fbbf24]/90 font-semibold rounded-full px-6 h-10 shadow-[0_0_20px_rgba(251,191,36,0.25)] hover:shadow-[0_0_25px_rgba(251,191,36,0.4)] transition-all duration-300 hover:scale-105 active:scale-95">
                      Start a Free Trial
                    </Button>
                  </NavLink>
                </SignedOut>
                <SignedIn>
                  <Link to="/onboarding" onClick={() => window.scrollTo(0, 0)}>
                    <Button variant="outline" className="border-white/[0.08] bg-white/[0.02] text-white hover:bg-white/[0.08] hover:text-[#fbbf24] rounded-full h-10 px-6 backdrop-blur-md transition-all">
                      Dashboard
                    </Button>
                  </Link>
                  <div className="p-2 mt-2">
                    <UserButton afterSignOutUrl="/"/>
                  </div>
                </SignedIn>
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="xl:hidden relative z-50 p-2.5 rounded-full text-gray-300 bg-white/[0.03] border border-white/[0.05] hover:text-white hover:bg-white/[0.1] active:scale-95 transition-all duration-300 shrink-0"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Floating Liquid Glass Mobile Menu */}
        <div 
          className={`xl:hidden fixed left-4 right-4 origin-top transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isOpen 
              ? "top-[90px] opacity-100 scale-100 pointer-events-auto" 
              : "top-[80px] opacity-0 scale-95 pointer-events-none"
          }`}
        >
          <div className="bg-[#111111]/90 backdrop-blur-[50px] backdrop-saturate-[200%] border border-white/[0.1] rounded-[2rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.7),inset_0_1px_0_0_rgba(255,255,255,0.05)] overflow-hidden">
            <div className="flex flex-col p-4 space-y-2">
              
              {/* Links Section */}
              <div className="flex flex-col p-2 bg-white/[0.02] rounded-3xl border border-white/[0.03]">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className="text-base font-medium px-4 py-3.5 w-full justify-start rounded-2xl"
                    onClick={closeMenu}
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>

              {/* Action Section */}
              <div className="flex flex-col space-y-3 pt-2">
                <SignedOut>
                  {/* Triggers Auth Modal on mobile */}
                  <button onClick={() => { closeMenu(); setAuthModal("signin"); }} className="w-full">
                    <ShimmerButton 
                      className="w-full h-14 text-base rounded-2xl bg-white/[0.03] border border-white/[0.05]" 
                      shimmerColor="#fbbf24"
                    >
                      Login
                    </ShimmerButton>
                  </button>
                  <button onClick={() => { closeMenu(); setAuthModal("signup"); }} className="w-full">
                    <Button className="w-full h-14 text-base font-bold bg-[#fbbf24] text-black hover:bg-[#fbbf24]/90 rounded-2xl shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:scale-[1.02] transition-transform">
                      Start a Free Trial
                    </Button>
                  </button>
                </SignedOut>

                <SignedIn>
                  <Link to="/onboarding" onClick={() => { window.scrollTo(0, 0); closeMenu(); }} className="w-full">
                    <Button variant="outline" className="w-full h-14 text-base border-white/[0.08] bg-white/[0.02] text-white rounded-2xl hover:bg-white/[0.08]">
                      Go to Dashboard
                    </Button>
                  </Link>
                  <div className="flex items-center justify-between px-5 py-4 mt-2 bg-white/[0.03] rounded-2xl border border-white/[0.05]">
                    <span className="text-sm text-gray-300 font-medium">Account Settings</span>
                    <UserButton afterSignOutUrl="/" />
                  </div>
                </SignedIn>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* ========================================== */}
      {/* AUTHENTICATION POPUP MODAL (Leadequator)   */}
      {/* ========================================== */}
      <AnimatePresence>
        {authModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050505]/80 backdrop-blur-[10px] p-4 sm:p-6"
            onClick={() => setAuthModal(null)} // Click backdrop to close
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()} // Prevent bubbling
              className="relative w-full max-w-5xl flex flex-col lg:flex-row bg-[#111111]/95 backdrop-blur-[50px] backdrop-saturate-[200%] border border-white/[0.1] rounded-3xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.7),inset_0_1px_0_0_rgba(255,255,255,0.05)] overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => setAuthModal(null)}
                className="absolute top-4 right-4 z-[120] p-2 text-gray-400 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] rounded-full transition-colors border border-white/[0.05]"
              >
                <X size={20} />
              </button>

              {/* LEFT PANEL - BRANDING */}
              <div className="hidden lg:flex w-1/2 flex-col p-12 relative bg-[#0a0a0a] border-r border-white/[0.05]">
                {/* Subtle gold glow behind text */}
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[300px] h-[300px] bg-[#fbbf24]/10 blur-[100px] rounded-full pointer-events-none" />

                {/* Internal Logo */}
                <div className="flex items-center gap-3 mb-12 relative z-10">
                  <img src="/leadequator_logo.png" className="w-8 h-8 object-contain" alt="Logo" />
                  <span className="text-white font-bold text-xl tracking-tight">Leadequator</span>
                </div>

                {/* Heading & Subtitle */}
                <div className="relative z-10 flex-1">
                  <h2 className="text-4xl xl:text-5xl font-bold text-white leading-[1.1] mb-6 tracking-tight">
                    Start converting <br/>conversations into <br/>customers.
                  </h2>
                  <p className="text-gray-400 text-lg mb-10 leading-relaxed max-w-md">
                    Join the conversations where real buyers already exist — without ads or automation risk.
                  </p>

                  {/* Feature List from Screenshot */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-full border border-[#fbbf24]/30 bg-[#fbbf24]/10 text-[#fbbf24]">
                        <ShieldCheck size={20} />
                      </div>
                      <span className="text-white font-medium">No bots. No auto-commenting.</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-full border border-[#fbbf24]/30 bg-[#fbbf24]/10 text-[#fbbf24]">
                        <CheckCircle2 size={20} />
                      </div>
                      <span className="text-white font-medium">100% platform-compliant</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-full border border-[#fbbf24]/30 bg-[#fbbf24]/10 text-[#fbbf24]">
                        <Users size={20} />
                      </div>
                      <span className="text-white font-medium">Built for founders, agencies & growth teams</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT PANEL - CLERK FORM */}
              <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-10 relative min-h-[500px]">
                
                {/* Mobile Branding (Only visible when Left Panel is hidden) */}
                <div className="lg:hidden absolute top-6 left-6 flex items-center gap-2">
                  <img src="/leadequator_logo.png" className="w-6 h-6 object-contain" alt="Logo" />
                  <span className="font-bold text-lg text-white">Leadequator</span>
                </div>

                {/* Clerk Component Wrapper */}
                <div className="w-full max-w-[400px] mt-8 lg:mt-0 flex justify-center">
                  {authModal === "sign-in" ? (
                    <SignIn
                      routing="hash"
                      signUpUrl="/sign-up"
                      appearance={{
                        baseTheme: dark,
                        variables: { colorPrimary: '#fbbf24' },
                        elements: {
                          card: "bg-transparent shadow-none w-full p-7",
                          headerTitle: "text-white text-2xl font-bold",
                          headerSubtitle: "text-gray-400",
                          socialButtonsBlockButton: "bg-white/[0.03] border-white/[0.08] text-white hover:bg-white/[0.08] transition-all",
                          dividerLine: "bg-white/[0.08]",
                          dividerText: "text-gray-500",
                          formFieldLabel: "text-gray-300",
                          formFieldInput: "bg-white/[0.03] border-white/[0.08] text-white focus:border-[#fbbf24] focus:ring-[#fbbf24]/20",
                          formButtonPrimary: "bg-[#fbbf24] text-black font-bold hover:bg-[#fbbf24]/90",
                          footerActionText: "text-gray-400",
                          footerActionLink: "text-[#fbbf24] hover:text-[#fbbf24]/80 font-medium"
                        }
                      }}
                    />
                  ) : (
                    <SignUp
                      routing="hash"
                      signInUrl="/sign-in"
                      appearance={{
                        baseTheme: dark,
                        variables: { colorPrimary: '#fbbf24' },
                        elements: {
                          card: "bg-transparent shadow-none w-full p-0",
                          headerTitle: "text-white text-2xl font-bold",
                          headerSubtitle: "text-gray-400",
                          socialButtonsBlockButton: "bg-white/[0.03] border-white/[0.08] text-white hover:bg-white/[0.08] transition-all",
                          dividerLine: "bg-white/[0.08]",
                          dividerText: "text-gray-500",
                          formFieldLabel: "text-gray-300",
                          formFieldInput: "bg-white/[0.03] border-white/[0.08] text-white focus:border-[#fbbf24] focus:ring-[#fbbf24]/20",
                          formButtonPrimary: "bg-[#fbbf24] text-black font-bold hover:bg-[#fbbf24]/90",
                          footerActionText: "text-gray-400",
                          footerActionLink: "text-[#fbbf24] hover:text-[#fbbf24]/80 font-medium"
                        }
                      }}
                    />
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;