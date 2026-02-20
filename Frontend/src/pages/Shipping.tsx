import { ScrollProgress } from "@/components/ui/scroll-progress";

const ShippingPolicy = () => {
  return (
    <div className="min-h-screen  text-white font-sans selection:bg-[#fbbf24]/30 pt-24 pb-12 relative z-10 overflow-x-hidden">
        <ScrollProgress className="top-[65px]" />
        
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#fbbf24]/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <div className="container mx-auto px-4 max-w-4xl relative z-20">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Shipping & Delivery</h1>
          <p className="text-[#fbbf24] font-medium mb-10 tracking-wide uppercase text-sm">
            Last updated: January 2026
          </p>

          <div className="p-8 md:p-12 bg-[#050505]/0 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8px_30px_rgb(0,0,0,0.2),inset_0_1px_0_0_rgba(255,255,255,0.05)] rounded-[2.5rem] space-y-10">
            <section>
              <h2 className="text-2xl font-bold mb-4 text-[#fbbf24]">
                1. Digital Service Delivery
              </h2>
              <p className="text-zinc-400 leading-relaxed text-lg">
                Leadequator provides purely digital Software-as-a-Service (SaaS) products. 
                There is no physical shipping or handling involved.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-5 text-[#fbbf24]">
                2. Delivery Timeline
              </h2>
              <p className="text-zinc-300 leading-relaxed mb-4 text-lg font-medium">
                Service activation is automated and instant following a successful transaction.
              </p>
              <ul className="space-y-4 text-zinc-400 text-lg">
                <li className="flex items-start">
                  <span className="text-[#fbbf24] mr-3 mt-1 text-xl leading-none">▸</span>
                  Confirmation email sent within minutes of payment
                </li>
                <li className="flex items-start">
                  <span className="text-[#fbbf24] mr-3 mt-1 text-xl leading-none">▸</span>
                  Dashboard access granted immediately upon account setup
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-[#fbbf24]">
                3. Non-Delivery Issues
              </h2>
              <p className="text-zinc-400 leading-relaxed text-lg mb-4">
                In rare cases of API delays or server issues, if access is not granted within 
                2 hours of payment, please reach out to our support team with your transaction ID.
              </p>
              <p className="text-zinc-200 text-lg font-medium tracking-wide">leadequatorofficial@gmail.com</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;