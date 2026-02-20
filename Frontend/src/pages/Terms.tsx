import { ScrollProgress } from "@/components/ui/scroll-progress";

const Terms = () => {
  return (
    <div className="min-h-screen  text-white font-sans selection:bg-[#fbbf24]/30 pt-24 pb-12 relative z-10 overflow-x-hidden">
      <ScrollProgress className="top-[65px]" />
      
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#fbbf24]/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <div className="container mx-auto px-4 max-w-4xl relative z-20">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Terms of Service</h1>
          <p className="text-[#fbbf24] font-medium mb-10 tracking-wide uppercase text-sm">
            Last updated: January 2026
          </p>

          <div className="p-8 md:p-12  backdrop-blur-2xl border border-white/[0.08] shadow-[0_8px_30px_rgb(0,0,0,0.2),inset_0_1px_0_0_rgba(255,255,255,0.05)] rounded-[2.5rem] space-y-10">
            <section>
              <h2 className="text-2xl font-bold mb-4 text-[#fbbf24]">
                1. Acceptance of Terms
              </h2>
              <p className="text-zinc-400 leading-relaxed text-lg">
                By accessing or using Leadequator's services, you agree to be bound by these Terms of Service. If you do not agree, you may not use our platform. These terms apply to all users, including Pilot, Scale, and Enterprise customers.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-[#fbbf24]">
                2. Service Description
              </h2>
              <p className="text-zinc-400 leading-relaxed text-lg">
                Leadequator provides AI-powered social media monitoring, intent detection, automated engagement, and lead generation tools. Services include conversation tracking, AI reply generation, CRM integration, and analytics dashboards.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-5 text-[#fbbf24]">
                3. User Responsibilities
              </h2>
              <p className="text-zinc-300 leading-relaxed mb-4 text-lg font-medium">
                You are responsible for:
              </p>
              <ul className="space-y-4 text-zinc-400 text-lg">
                <li className="flex items-start">
                  <span className="text-[#fbbf24] mr-3 mt-1 text-xl leading-none">▸</span>
                  Maintaining the confidentiality of your account credentials
                </li>
                <li className="flex items-start">
                  <span className="text-[#fbbf24] mr-3 mt-1 text-xl leading-none">▸</span>
                  Ensuring all AI-generated replies comply with platform policies (LinkedIn, Reddit, etc.)
                </li>
                <li className="flex items-start">
                  <span className="text-[#fbbf24] mr-3 mt-1 text-xl leading-none">▸</span>
                  Using the service in a lawful and ethical manner
                </li>
                <li className="flex items-start">
                  <span className="text-[#fbbf24] mr-3 mt-1 text-xl leading-none">▸</span>
                  Not using the service to spam, harass, or violate others' rights
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-5 text-[#fbbf24]">
                4. Acceptable Use Policy
              </h2>
              <p className="text-zinc-300 leading-relaxed mb-4 text-lg font-medium">
                You may not use Leadequator to:
              </p>
              <ul className="space-y-4 text-zinc-400 text-lg">
                <li className="flex items-start">
                  <span className="text-[#fbbf24] mr-3 mt-1 text-xl leading-none">▸</span>
                  Violate any laws, regulations, or third-party rights
                </li>
                <li className="flex items-start">
                  <span className="text-[#fbbf24] mr-3 mt-1 text-xl leading-none">▸</span>
                  Engage in automated spamming or deceptive practices
                </li>
                <li className="flex items-start">
                  <span className="text-[#fbbf24] mr-3 mt-1 text-xl leading-none">▸</span>
                  Reverse engineer or attempt to access our proprietary algorithms
                </li>
                <li className="flex items-start">
                  <span className="text-[#fbbf24] mr-3 mt-1 text-xl leading-none">▸</span>
                  Misrepresent your identity or affiliation
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-[#fbbf24]">
                5. Payment & Subscriptions
              </h2>
              <p className="text-zinc-400 leading-relaxed text-lg">
                Pilot, Scale, and Enterprise plans are billed based on custom quotes. Payment terms are specified in your contract. We reserve the right to modify pricing with 30 days' notice for existing customers. Non-payment may result in service suspension.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-[#fbbf24]">
                6. Intellectual Property
              </h2>
              <p className="text-zinc-400 leading-relaxed text-lg">
                Leadequator retains all rights to our platform, algorithms, AI models, and proprietary technology. You retain ownership of your data (conversation data, leads, CRM integrations). We may use anonymized, aggregated data for service improvement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-[#fbbf24]">
                7. AI-Generated Content
              </h2>
              <p className="text-zinc-400 leading-relaxed text-lg">
                AI-generated replies are suggestions based on conversation context. You are responsible for reviewing and approving all AI content before public posting (unless you've enabled auto-send). Leadequator is not liable for AI errors, offensive content, or compliance violations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-[#fbbf24]">
                8. Service Availability & SLA
              </h2>
              <p className="text-zinc-400 leading-relaxed text-lg">
                We strive for 99.7% uptime. Enterprise customers receive SLA guarantees specified in their contracts. We are not liable for downtime caused by third-party platforms (e.g., LinkedIn API outages).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-[#fbbf24]">
                9. Limitation of Liability
              </h2>
              <p className="text-zinc-400 leading-relaxed text-lg">
                Leadequator is not liable for indirect, incidental, or consequential damages arising from service use. Our total liability is limited to fees paid in the 12 months prior to the claim.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-[#fbbf24]">
                10. Termination
              </h2>
              <p className="text-zinc-400 leading-relaxed text-lg">
                Either party may terminate with 30 days' written notice. We may suspend or terminate accounts for violations of these terms. Upon termination, you retain access to export your data for 30 days.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-[#fbbf24]">
                11. Changes to Terms
              </h2>
              <p className="text-zinc-400 leading-relaxed text-lg">
                We may update these terms with 30 days' notice via email. Continued use after changes constitute acceptance.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-[#fbbf24]">
                12. Contact
              </h2>
              <p className="text-zinc-400 leading-relaxed text-lg">
                For questions about these terms, contact:
              </p>
              <p className="text-zinc-200 mt-2 text-lg font-medium tracking-wide">leadequatorofficial@gmail.com</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;