import { ScrollProgress } from "@/components/ui/scroll-progress";

const RefundPolicy = () => {
  return (
    // Removed bg-black per your request. Kept overflow-x-hidden to prevent mobile scrolling bugs.
    <div className="min-h-screen text-white font-sans selection:bg-[#fbbf24]/30 pt-24 pb-12 relative z-10 overflow-x-hidden">
      <ScrollProgress className="top-[65px]" />
      
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#fbbf24]/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <div className="container mx-auto px-4 max-w-4xl relative z-20">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Refund & Cancellation</h1>
          <p className="text-[#fbbf24] font-medium mb-10 tracking-wide uppercase text-sm">
            Last updated: January 2026
          </p>

          <div className="p-8 md:p-12 bg-[#050505]/0 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8px_30px_rgb(0,0,0,0.2),inset_0_1px_0_0_rgba(255,255,255,0.05)] rounded-[2.5rem] space-y-10">
            <section>
              <h2 className="text-2xl font-bold mb-5 text-[#fbbf24]">
                1. Subscription Cancellation
              </h2>
              <p className="text-zinc-400 leading-relaxed mb-6 text-lg">
                You may cancel your Leadequator subscription at any time. To
                avoid future billing, cancellations must be processed before the
                start of the next billing cycle.
              </p>
              <ul className="space-y-4 text-zinc-400 text-lg">
                <li className="flex items-start">
                  <span className="text-[#fbbf24] mr-3 mt-1 text-xl leading-none">▸</span>
                  Cancel via your account dashboard settings
                </li>
                <li className="flex items-start">
                  <span className="text-[#fbbf24] mr-3 mt-1 text-xl leading-none">▸</span>
                  Access continues until the end of the paid period
                </li>
                <li className="flex items-start">
                  <span className="text-[#fbbf24] mr-3 mt-1 text-xl leading-none">▸</span>
                  No partial month refunds are provided for early cancellation
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-[#fbbf24]">
                2. Refund Eligibility
              </h2>
              <p className="text-zinc-400 leading-relaxed text-lg">
                As Leadequator provides immediate digital access to AI-driven
                intent data and engagement tools, we generally operate on a "No
                Refund" policy for active subscriptions. Exceptions are made
                only for technical service failures exceeding 48 hours.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-5 text-[#fbbf24]">
                3. Refund Process
              </h2>
              <p className="text-zinc-400 leading-relaxed mb-6 text-lg">
                Valid refund requests (due to billing errors or technical
                downtime) are processed within 5-7 business days of approval.
              </p>
              <ul className="space-y-4 text-zinc-400 text-lg">
                <li className="flex items-start">
                  <span className="text-[#fbbf24] mr-3 mt-1 text-xl leading-none">▸</span>
                  Refunds are issued to the original payment method
                </li>
                <li className="flex items-start">
                  <span className="text-[#fbbf24] mr-3 mt-1 text-xl leading-none">▸</span>
                  Transaction fees may be non-refundable per payment gateway terms
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-[#fbbf24]">
                4. Contact for Disputes
              </h2>
              <p className="text-zinc-400 leading-relaxed text-lg">
                For questions regarding your billing or to request a refund,
                please contact us at:
              </p>
              <p className="text-zinc-200 mt-2 text-lg font-medium tracking-wide">leadequatorofficial@gmail.com</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;