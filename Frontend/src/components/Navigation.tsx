"use client";
import { useState } from "react";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ShimmerButton } from "./ui/shimmer-button";
import { UserButton, SignedIn, SignedOut } from "@clerk/clerk-react";
import { Menu, X } from "lucide-react";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

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
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <NavLink to="/" className="text-2xl font-bold flex items-center gap-2">
            <img
              src="/leadequator_logo.png"
              alt="Leadequator Logo"
              className="w-10 h-10 object-contain"
            />
            <div className="flex items-center">
              <span className="text-foreground">Lead</span>
              <span className="text-primary">equator</span>
            </div>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} className="text-sm font-medium transition-colors hover:text-primary">
                {link.label}
              </NavLink>
            ))}

            <div className="flex items-center gap-4">
              <SignedOut>
                <Link to="/pricing">
                  <Button className="bg-primary hover:bg-primary/90">Start a Free Trial</Button>
                </Link>
                <Link to="/sign-in">
                  <ShimmerButton shimmerColor="#fbbf24" borderRadius="8px">Login</ShimmerButton>
                </Link>
              </SignedOut>
              <SignedIn>
                <Link to="/onboarding">
                  <Button variant="outline" className="border-primary/20 hover:bg-primary/10">Dashboard</Button>
                </Link>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-md text-foreground hover:bg-accent transition-colors"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isOpen && (
          <div className="lg:hidden absolute top-16 left-0 right-0 bg-background/10 border-b border-border shadow-2xl animate-in slide-in-from-top duration-300">
            <div className="flex flex-col p-6 space-y-6 bg-gradient-to-b from-background to-background/90">
              
              {/* Links Section */}
              <div className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className="text-lg font-medium text-foreground/80 hover:text-primary transition-all border-l-2 border-transparent hover:border-primary pl-3"
                    onClick={closeMenu}
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>

              {/* Action Section */}
              <div className="flex flex-col space-y-3 pt-6 border-t border-border/50">
                <SignedOut>
                  <Link to="/pricing" onClick={closeMenu} className="w-full">
                    <Button className="w-full py-6 text-base font-semibold bg-primary hover:bg-primary/90 shadow-[0_0_15px_rgba(var(--primary),0.3)]">
                      Start a Free Trial
                    </Button>
                  </Link>
                  <Link to="/sign-in" onClick={closeMenu} className="w-full">
                    <ShimmerButton 
                      className="w-full h-12 text-base" 
                      shimmerColor="#fbbf24"
                    >
                      Login
                    </ShimmerButton>
                  </Link>
                </SignedOut>

                <SignedIn>
                  <Link to="/onboarding" onClick={closeMenu} className="w-full">
                    <Button variant="outline" className="w-full py-6 text-base border-primary/30">
                      Go to Dashboard
                    </Button>
                  </Link>
                  <div className="flex items-center justify-between px-2 pt-2">
                    <span className="text-sm text-muted-foreground font-medium">Account Settings</span>
                    <UserButton afterSignOutUrl="/" />
                  </div>
                </SignedIn>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;