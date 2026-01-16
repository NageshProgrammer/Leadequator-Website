import { Card } from "@/components/ui/card";

const Privacy = () => {
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="animate-fade-in">
          <h1 className="text-5xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">
            Last updated: January 2025
          </p>

          <Card className="p-8 bg-card border-border space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary">
                1. Information We Collect
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Leadequator collects information that you provide directly, such as account registration details, company information, and conversation data from public social media platforms. We also collect usage data, including how you interact with our platform, to improve our services.
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-primary mr-2">▸</span>
                  Account information (name, email, company)
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">▸</span>
                  Public social media conversation data
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">▸</span>
                  Usage analytics and platform interactions
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">▸</span>
                  CRM integration data (with your consent)
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary">
                2. How We Use Your Information
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We use your information to provide, maintain, and improve our services, including AI-powered conversation monitoring, intent scoring, and lead generation. Your data helps us personalize your experience and provide customer support.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary">
                3. Data Security & Compliance
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Leadequator is committed to protecting your data. We are GDPR and CCPA compliant, SOC 2 Type II certified, and use industry-standard encryption for data at rest and in transit.
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-primary mr-2">▸</span>
                  End-to-end encryption for sensitive data
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">▸</span>
                  Regular security audits and penetration testing
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">▸</span>
                  GDPR data subject rights (access, deletion, portability)
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">▸</span>
                  CCPA opt-out and data transparency
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary">
                4. Data Sharing & Third Parties
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We do not sell your personal information. We may share data with trusted service providers (e.g., cloud infrastructure, analytics) who are contractually obligated to protect your data. Integration partners (e.g., Salesforce, HubSpot) receive data only with your explicit consent.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary">
                5. Data Retention
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We retain your data for as long as your account is active or as needed to provide services. You can request deletion of your data at any time by contacting us at privacy@leadequator.ai.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary">
                6. Your Rights
              </h2>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-primary mr-2">▸</span>
                  Access your personal data
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">▸</span>
                  Correct inaccurate information
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">▸</span>
                  Request data deletion (right to be forgotten)
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">▸</span>
                  Export your data (data portability)
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">▸</span>
                  Opt-out of marketing communications
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary">
                7. Cookies & Tracking
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We use cookies and similar technologies for analytics, personalization, and authentication. You can control cookie preferences through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary">
                8. Contact Us
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                For privacy-related questions or to exercise your data rights, contact our Data Protection Officer at:
              </p>
              <p className="text-primary mt-2">privacy@leadequator.ai</p>
            </section>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
