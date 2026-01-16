import { Card } from "@/components/ui/card";

const Terms = () => {
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="animate-fade-in">
          <h1 className="text-5xl font-bold mb-6">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">
            Last updated: January 2025
          </p>

          <Card className="p-8 bg-card border-border space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary">
                1. Acceptance of Terms
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing or using Leadequator's services, you agree to be bound by these Terms of Service. If you do not agree, you may not use our platform. These terms apply to all users, including Pilot, Scale, and Enterprise customers.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary">
                2. Service Description
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Leadequator provides AI-powered social media monitoring, intent detection, automated engagement, and lead generation tools. Services include conversation tracking, AI reply generation, CRM integration, and analytics dashboards.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary">
                3. User Responsibilities
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You are responsible for:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-primary mr-2">▸</span>
                  Maintaining the confidentiality of your account credentials
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">▸</span>
                  Ensuring all AI-generated replies comply with platform policies (LinkedIn, Reddit, etc.)
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">▸</span>
                  Using the service in a lawful and ethical manner
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">▸</span>
                  Not using the service to spam, harass, or violate others' rights
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary">
                4. Acceptable Use Policy
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You may not use Leadequator to:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-primary mr-2">▸</span>
                  Violate any laws, regulations, or third-party rights
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">▸</span>
                  Engage in automated spamming or deceptive practices
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">▸</span>
                  Reverse engineer or attempt to access our proprietary algorithms
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">▸</span>
                  Misrepresent your identity or affiliation
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary">
                5. Payment & Subscriptions
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Pilot, Scale, and Enterprise plans are billed based on custom quotes. Payment terms are specified in your contract. We reserve the right to modify pricing with 30 days' notice for existing customers. Non-payment may result in service suspension.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary">
                6. Intellectual Property
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Leadequator retains all rights to our platform, algorithms, AI models, and proprietary technology. You retain ownership of your data (conversation data, leads, CRM integrations). We may use anonymized, aggregated data for service improvement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary">
                7. AI-Generated Content
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                AI-generated replies are suggestions based on conversation context. You are responsible for reviewing and approving all AI content before public posting (unless you've enabled auto-send). Leadequator is not liable for AI errors, offensive content, or compliance violations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary">
                8. Service Availability & SLA
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We strive for 99.7% uptime. Enterprise customers receive SLA guarantees specified in their contracts. We are not liable for downtime caused by third-party platforms (e.g., LinkedIn API outages).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary">
                9. Limitation of Liability
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Leadequator is not liable for indirect, incidental, or consequential damages arising from service use. Our total liability is limited to fees paid in the 12 months prior to the claim.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary">
                10. Termination
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Either party may terminate with 30 days' written notice. We may suspend or terminate accounts for violations of these terms. Upon termination, you retain access to export your data for 30 days.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary">
                11. Changes to Terms
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update these terms with 30 days' notice via email. Continued use after changes constitute acceptance.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary">
                12. Contact
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                For questions about these terms, contact:
              </p>
              <p className="text-primary mt-2">legal@leadequator.ai</p>
            </section>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Terms;
