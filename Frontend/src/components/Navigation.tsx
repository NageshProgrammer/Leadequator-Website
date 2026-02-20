"use client";
import { useState, useEffect } from "react";
import { NavLink as RouterNavLink } from "react-router-dom"; 
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ShimmerButton } from "./ui/shimmer-button";
import { UserButton, SignedIn, SignedOut } from "@clerk/clerk-react";
import { Menu, X } from "lucide-react";

// Helper component for active link styling
const NavLink = ({ to, children, className, onClick }) => (
  <RouterNavLink
    to={to}
    onClick={onClick}
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

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Add a liquid glass shadow/border transition on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/problems", label: "Problems" },
    { to: "/solutions", label: "Solutions" },
    { to: "/working", label: "How it works" },
    { to: "/features", label: "Features" },
    { to: "/pricing", label: "Pricing" },
  ];

  const closeMenu = () => setIsOpen(false);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        scrolled 
          ? "bg-[#050505]/40 backdrop-blur-[40px] backdrop-saturate-[150%] border-b border-white/[0.06] shadow-[0_4px_30px_rgba(0,0,0,0.1)]" 
          : "bg-transparent border-b border-transparent"
      }`}
    >
      {/* 1. Added max-w-7xl here so the navbar perfectly aligns with the page content below it */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          
          {/* Logo */}
          {/* 2. Added shrink-0 so the logo never gets squished on weird screen sizes */}
          <Link to="/" className="text-2xl font-bold flex items-center gap-2 group cursor-pointer relative z-50 shrink-0">
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
          {/* 3. Changed lg:flex to xl:flex so it collapses to mobile menu before getting crowded */}
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
                <Link to="/sign-in">
                  <ShimmerButton 
                    shimmerColor="#fbbf24" 
                    borderRadius="9999px" 
                    className="h-10 px-6 text-sm font-medium bg-white/[0.03] border border-white/[0.05]"
                  >
                    Login
                  </ShimmerButton>
                </Link>
                <Link to="/pricing">
                  <Button className="bg-[#fbbf24] text-black hover:bg-[#fbbf24]/90 font-semibold rounded-full px-6 h-10 shadow-[0_0_20px_rgba(251,191,36,0.25)] hover:shadow-[0_0_25px_rgba(251,191,36,0.4)] transition-all duration-300 hover:scale-105 active:scale-95">
                    Start a Free Trial
                  </Button>
                </Link>
              </SignedOut>
              <SignedIn>
                <Link to="/onboarding">
                  <Button variant="outline" className="border-white/[0.08] bg-white/[0.02] text-white hover:bg-white/[0.08] hover:text-[#fbbf24] rounded-full h-10 px-6 backdrop-blur-md transition-all">
                    Dashboard
                  </Button>
                </Link>
                <div className="ml-2 ring-2 ring-white/[0.08] p-0.5 rounded-full bg-white/[0.02] hover:ring-[#fbbf24]/50 transition-all">
                  <UserButton afterSignOutUrl="/" />
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
                <Link to="/sign-in" onClick={closeMenu} className="w-full">
                  <ShimmerButton 
                    className="w-full h-14 text-base rounded-2xl bg-white/[0.03] border border-white/[0.05]" 
                    shimmerColor="#fbbf24"
                  >
                    Login
                  </ShimmerButton>
                </Link>
                <Link to="/pricing" onClick={closeMenu} className="w-full">
                  <Button className="w-full h-14 text-base font-bold bg-[#fbbf24] text-black hover:bg-[#fbbf24]/90 rounded-2xl shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:scale-[1.02] transition-transform">
                    Start a Free Trial
                  </Button>
                </Link>
              </SignedOut>

              <SignedIn>
                <Link to="/onboarding" onClick={closeMenu} className="w-full">
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
  );
};

export default Navigation;