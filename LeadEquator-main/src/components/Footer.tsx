import { NavLink } from "@/components/NavLink";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">
              <span className="text-foreground">Lead</span>
              <span className="text-primary">equator</span>
            </h3>
            <p className="text-muted-foreground text-sm">
              AI that converts high-follower conversations into measurable leads.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-foreground">Product</h4>
            <ul className="space-y-2">
              <li>
                <NavLink to="/product" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Features
                </NavLink>
              </li>
              <li>
                <NavLink to="/pricing" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Pricing
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Dashboard
                </NavLink>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-foreground">Company</h4>
            <ul className="space-y-2">
              <li>
                <NavLink to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  About
                </NavLink>
              </li>
              <li>
                <NavLink to="/resources" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Resources
                </NavLink>
              </li>
              <li>
                <NavLink to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </NavLink>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-foreground">Legal</h4>
            <ul className="space-y-2">
              <li>
                <NavLink to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </NavLink>
              </li>
              <li>
                <NavLink to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </NavLink>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Leadequator. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
