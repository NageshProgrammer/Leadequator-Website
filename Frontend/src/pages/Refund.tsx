import { Card } from "@/components/ui/card";
import { ScrollProgress } from "@/components/ui/scroll-progress";

const RefundPolicy = () => {
  return (
    <div className="min-h-screen pt-24 pb-12">
      <ScrollProgress className="top-[65px]" />
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="animate-fade-in">
          <h1 className="text-5xl font-bold mb-6">Refund & Cancellation</h1>
          <p className="text-muted-foreground mb-8">
            Last updated: January 2026
          </p>

          <Card className="p-8 bg-card border-border space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary">
                1. Subscription Cancellation
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You may cancel your Leadequator subscription at any time. To
                avoid future billing, cancellations must be processed before the
                start of the next billing cycle.
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-primary mr-2">▸</span>
                  Cancel via your account dashboard settings
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">▸</span>
                  Access continues until the end of the paid period
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">▸</span>
                  No partial month refunds are provided for early cancellation
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary">
                2. Refund Eligibility
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                As Leadequator provides immediate digital access to AI-driven
                intent data and engagement tools, we generally operate on a "No
                Refund" policy for active subscriptions. Exceptions are made
                only for technical service failures exceeding 48 hours.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary">
                3. Refund Process
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Valid refund requests (due to billing errors or technical
                downtime) are processed within 5-7 business days of approval.
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-primary mr-2">▸</span>
                  Refunds are issued to the original payment method
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">▸</span>
                  Transaction fees may be non-refundable per payment gateway
                  terms
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary">
                4. Contact for Disputes
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                For questions regarding your billing or to request a refund,
                please contact us at:
              </p>
              <p className="text-primary mt-2">leadequatorofficial@gmail.com</p>
            </section>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
