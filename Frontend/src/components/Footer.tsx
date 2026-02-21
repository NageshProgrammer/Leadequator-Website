import { NavLink as RouterNavLink } from "react-router-dom"; 

const FooterLink = ({ to, children }) => (
  <RouterNavLink 
    to={to} 
    onClick={() => window.scrollTo(0, 0)}
    className="text-sm text-zinc-400 hover:text-[#fbbf24] hover:translate-x-1 inline-flex transition-all duration-300"
  >
    {children}
  </RouterNavLink>
);

const Footer = () => {
  return (
    <footer className="bg-black/50 border-t border-white/[0.08] relative overflow-hidden">
      
      {/* Subtle Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#fbbf24]/5 rounded-t-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl pt-20 pb-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 pr-8">
            <RouterNavLink 
              to="/" 
              onClick={() => window.scrollTo(0, 0)}
              className="text-2xl font-bold flex items-center gap-2 mb-6 group cursor-pointer inline-flex"
            >
              <img
                src="/leadequator_logo.png"
                alt="Leadequator Logo"
                className="w-10 h-10 object-contain group-hover:scale-105 transition-transform duration-400 ease-out"
              />
              <div className="flex items-center tracking-tight">
                <span className="text-white">Lead</span>
                <span className="text-[#fbbf24]">equator</span>
              </div>
            </RouterNavLink>
            <p className="text-zinc-400 text-base leading-relaxed mb-6 max-w-sm">
              We are creating a new category: Organic Engagement Intelligence. AI that converts high-follower conversations into measurable leads.
            </p>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-xs">Product</h4>
            <ul className="space-y-4">
              <li><FooterLink to="/features">Features</FooterLink></li>
              <li><FooterLink to="/pricing">Pricing</FooterLink></li>
              <li><FooterLink to="/solutions">Solutions</FooterLink></li>
              <li><FooterLink to="/working">How it works</FooterLink></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-xs">Company</h4>
            <ul className="space-y-4">
              <li><FooterLink to="/about">About Us</FooterLink></li>
              <li><FooterLink to="/contact">Contact Support</FooterLink></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-xs">Legal</h4>
            <ul className="space-y-4">
              <li><FooterLink to="/privacy">Privacy Policy</FooterLink></li>
              <li><FooterLink to="/terms">Terms of Service</FooterLink></li>
              <li><FooterLink to="/shipping">Shipping & Delivery</FooterLink></li>
              <li><FooterLink to="/refund">Refund Policy</FooterLink></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/[0.08] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-zinc-500 font-medium">
            © {new Date().getFullYear()} Leadequator. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="https://x.com" target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-white transition-colors">
              <span className="sr-only">Twitter</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/></svg>
            </a>
            <a href="https://www.linkedin.com/company/leadequator/" target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-blue-500 transition-colors">
              <span className="sr-only">LinkedIn</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;