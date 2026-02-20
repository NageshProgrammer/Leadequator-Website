import { ScrollProgress } from "@/components/ui/scroll-progress";

const Privacy = () => {
  return (
    <div className="min-h-screen  text-white font-sans selection:bg-[#fbbf24]/30 pt-24 pb-12 relative z-10 overflow-x-hidden">
      <ScrollProgress className="top-[65px]" />
      
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#fbbf24]/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <div className="container mx-auto px-4 max-w-4xl relative z-20">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Privacy Policy</h1>
          <p className="text-[#fbbf24] font-medium mb-10 tracking-wide uppercase text-sm">
            Last updated: January 2026
          </p>

          <div className="p-8 md:p-12 bg-[#050505]/0 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8px_30px_rgb(0,0,0,0.2),inset_0_1px_0_0_rgba(255,255,255,0.05)] rounded-[2.5rem] space-y-10">
            <section>
              <h2 className="text-2xl font-bold mb-5 text-[#fbbf24]">
                1. Information We Collect
              </h2>
              <p className="text-zinc-400 leading-relaxed mb-6 text-lg">
                Leadequator collects information that you provide directly, such as account registration details, company information, and conversation data from public social media platforms. We also collect usage data, including how you interact with our platform, to improve our services.
              </p>
              <ul className="space-y-4 text-zinc-400 text-lg">
                <li className="flex items-start">
                  <span className="text-[#fbbf24] mr-3 mt-1 text-xl leading-none">▸</span>
                  Account information (name, email, company)
                </li>
                <li className="flex items-start">
                  <span className="text-[#fbbf24] mr-3 mt-1 text-xl leading-none">▸</span>
                  Public social media conversation data
                </li>
                <li className="flex items-start">
                  <span className="text-[#fbbf24] mr-3 mt-1 text-xl leading-none">▸</span>
                  Usage analytics and platform interactions
                </li>
                <li className="flex items-start">
                  <span className="text-[#fbbf24] mr-3 mt-1 text-xl leading-none">▸</span>
                  CRM integration data (with your consent)
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-[#fbbf24]">
                2. How We Use Your Information
              </h2>
              <p className="text-zinc-400 leading-relaxed text-lg">
                We use your information to provide, maintain, and improve our services, including AI-powered conversation monitoring, intent scoring, and lead generation. Your data helps us personalize your experience and provide customer support.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-5 text-[#fbbf24]">
                3. Data Security & Compliance
              </h2>
              <p className="text-zinc-400 leading-relaxed mb-6 text-lg">
                Leadequator is committed to protecting your data. We are GDPR and CCPA compliant, SOC 2 Type II certified, and use industry-standard encryption for data at rest and in transit.
              </p>
              <ul className="space-y-4 text-zinc-400 text-lg">
                <li className="flex items-start">
                  <span className="text-[#fbbf24] mr-3 mt-1 text-xl leading-none">▸</span>
                  End-to-end encryption for sensitive data
                </li>
                <li className="flex items-start">
                  <span className="text-[#fbbf24] mr-3 mt-1 text-xl leading-none">▸</span>
                  Regular security audits and penetration testing
                </li>
                <li className="flex items-start">
                  <span className="text-[#fbbf24] mr-3 mt-1 text-xl leading-none">▸</span>
                  GDPR data subject rights (access, deletion, portability)
                </li>
                <li className="flex items-start">
                  <span className="text-[#fbbf24] mr-3 mt-1 text-xl leading-none">▸</span>
                  CCPA opt-out and data transparency
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-[#fbbf24]">
                4. Data Sharing & Third Parties
              </h2>
              <p className="text-zinc-400 leading-relaxed text-lg">
                We do not sell your personal information. We may share data with trusted service providers (e.g., cloud infrastructure, analytics) who are contractually obligated to protect your data. Integration partners (e.g., Salesforce, HubSpot) receive data only with your explicit consent.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-[#fbbf24]">
                5. Data Retention
              </h2>
              <p className="text-zinc-400 leading-relaxed text-lg">
                We retain your data for as long as your account is active or as needed to provide services. You can request deletion of your data at any time by contacting us at <span className="text-zinc-200">privacy@leadequator.ai</span>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-5 text-[#fbbf24]">
                6. Your Rights
              </h2>
              <ul className="space-y-4 text-zinc-400 text-lg">
                <li className="flex items-start">
                  <span className="text-[#fbbf24] mr-3 mt-1 text-xl leading-none">▸</span>
                  Access your personal data
                </li>
                <li className="flex items-start">
                  <span className="text-[#fbbf24] mr-3 mt-1 text-xl leading-none">▸</span>
                  Correct inaccurate information
                </li>
                <li className="flex items-start">
                  <span className="text-[#fbbf24] mr-3 mt-1 text-xl leading-none">▸</span>
                  Request data deletion (right to be forgotten)
                </li>
                <li className="flex items-start">
                  <span className="text-[#fbbf24] mr-3 mt-1 text-xl leading-none">▸</span>
                  Export your data (data portability)
                </li>
                <li className="flex items-start">
                  <span className="text-[#fbbf24] mr-3 mt-1 text-xl leading-none">▸</span>
                  Opt-out of marketing communications
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-[#fbbf24]">
                7. Cookies & Tracking
              </h2>
              <p className="text-zinc-400 leading-relaxed text-lg">
                We use cookies and similar technologies for analytics, personalization, and authentication. You can control cookie preferences through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-[#fbbf24]">
                8. Contact Us
              </h2>
              <p className="text-zinc-400 leading-relaxed text-lg">
                For privacy-related questions or to exercise your data rights, contact our Data Protection Officer at:
              </p>
              <p className="text-zinc-200 mt-2 text-lg font-medium tracking-wide">leadequatorofficial@gmail.com</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;