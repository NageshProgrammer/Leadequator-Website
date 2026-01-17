"use client";
import { useState } from "react";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { ShimmerButton } from "./ui/shimmer-button";
import { UserButton, useUser } from "@clerk/clerk-react";
import leadequatorLogo from '@/assets/leadequator_logo.png'; // adjust path as needed


const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/problems", label: "Problems" },
    { to: "/solutions", label: "Solutions" },
    { to: "/working", label: "How it works" },
    { to: "/features", label: "Features" },
    { to: "/pricing", label: "Pricing" },
    // { to: "/dashboard", label: "Dashboard" },
    // { to: "/resources", label: "Resources" },
    // { to: "/about", label: "About" },
    // { to: "/contact", label: "Contact" },
  ];

  const { user } = useUser();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <NavLink
            to="/"
            className="text-2xl font-bold flex items-center gap-1"
          >
            {/* Using Bot icon as placeholder for the logo */}
            <img
              src={leadequatorLogo}
              alt="Leadequator"
              className="w-16 h-16 object-contain"
            />

            <span className="text-foreground">Lead</span>
            <span className="text-primary">equator</span>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to}>
                {link.label}
              </NavLink>
            ))}

            <div className="flex items-center gap-4">
              {/* Separate Link for the Pilot Button */}
              <Link to="/pricing">
                <Button className="bg-primary">Start a Free Trial</Button>
              </Link>

              {/* Separate Logic for Auth */}
              {!user ? (
                <Link to="/sign-in">
                  <ShimmerButton shimmerColor="#fbbf24">Login</ShimmerButton>
                </Link>
              ) : (
                <UserButton afterSignOutUrl="/" />
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-foreground"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className="block py-2 text-muted-foreground"
                activeClassName="text-primary font-medium"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
            <Link to="/contact">
              <Button className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90">
                Request Pilot
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
