"use client";
import { useState } from "react";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { ShimmerButton } from "./ui/shimmer-button";
import { UserButton, SignedIn, SignedOut } from "@clerk/clerk-react";

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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <NavLink to="/" className="text-2xl font-bold flex items-center gap-1">
            <img
              src="/leadequator_logo.png"
              alt="Leadequator"
              className="w-12 h-12 object-contain"
            />
            <span className="text-foreground">Lead</span>
            <span className="text-primary">equator</span>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to}>
                {link.label}
              </NavLink>
            ))}

            <div className="flex items-center gap-4">
              {/* Rendered only when user is NOT logged in */}
              <SignedOut>
                <Link to="/pricing">
                  <Button className="bg-primary">Start a Free Trial</Button>
                </Link>
                <Link to="/sign-in">
                  <ShimmerButton shimmerColor="#fbbf24">Login</ShimmerButton>
                </Link>
              </SignedOut>

              {/* Rendered only when user IS logged in */}
              <SignedIn>
                <Link to="/onboarding">
                  <Button variant="outline">Dashboard</Button>
                </Link>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-foreground"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-border animate-fade-in">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className="block py-2 text-muted-foreground"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
            
            <div className="mt-4 space-y-2">
              <SignedOut>
                <Link to="/contact" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-primary">Request Pilot</Button>
                </Link>
              </SignedOut>
              <SignedIn>
                <Link to="/onboarding" onClick={() => setIsOpen(false)}>
                  <Button className="w-full mb-4" variant="outline">Go to Dashboard</Button>
                </Link>
                <div className="flex justify-center">
                   <UserButton afterSignOutUrl="/" />
                </div>
              </SignedIn>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;