import { Card } from "@/components/ui/card";
import { ScrollProgress } from "@/components/ui/scroll-progress";

const ShippingPolicy = () => {
  return (
    <div className="min-h-screen pt-24 pb-12">
        <ScrollProgress className="top-[65px]" />
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="animate-fade-in">
          <h1 className="text-5xl font-bold mb-6">Shipping & Delivery</h1>
          <p className="text-muted-foreground mb-8">
            Last updated: January 2026
          </p>

          <Card className="p-8 bg-card border-border space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary">
                1. Digital Service Delivery
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Leadequator provides purely digital Software-as-a-Service (SaaS) products. 
                There is no physical shipping or handling involved.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary">
                2. Delivery Timeline
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Service activation is automated and instant following a successful transaction.
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-primary mr-2">▸</span>
                  Confirmation email sent within minutes of payment
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">▸</span>
                  Dashboard access granted immediately upon account setup
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary">
                3. Non-Delivery Issues
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                In rare cases of API delays or server issues, if access is not granted within 
                2 hours of payment, please reach out to our support team with your transaction ID.
              </p>
              <p className="text-primary mt-2">leadequatorofficial@gmail.com</p>
            </section>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;