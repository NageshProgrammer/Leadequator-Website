import { Card } from "@/components/ui/card";
import { Target, Users, Lightbulb, Award } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl font-bold mb-6">
            Turning Conversations Into{" "}
            <span className="text-primary">Revenue</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We believe the future of B2B growth isn't paid ads—it's earned influence through authentic, AI-powered engagement at scale.
          </p>
        </div>

        {/* Mission */}
        <Card className="p-12 bg-card border-border mb-16 animate-fade-in">
          <div className="max-w-3xl mx-auto text-center">
            <Target className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Leadequator was founded on a simple observation: the best leads come from organic conversations where buyers are already expressing intent. Traditional PR agencies charge $20K/month for manual engagement that doesn't scale. Paid ads get blocked, ignored, and waste budget on cold prospects. We built Leadequator to automate what great PR teams do—monitor high-value conversations, respond contextually, and convert interest into revenue—but at enterprise scale with measurable ROI.
            </p>
          </div>
        </Card>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-center mb-12">
            What We <span className="text-primary">Stand For</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Lightbulb,
                title: "Authenticity Over Automation",
                desc: "Our AI generates human-like replies that add value to conversations, not spammy sales pitches. We believe in earning trust, not gaming algorithms.",
              },
              {
                icon: Users,
                title: "Customer Success First",
                desc: "We don't just sell software—we partner with you to hit your pipeline targets. Every customer gets a dedicated success manager and quarterly ROI reviews.",
              },
              {
                icon: Award,
                title: "Transparency & Compliance",
                desc: "GDPR/CCPA compliant by design. Full audit trails for AI-generated content. We're SOC 2 Type II certified because enterprise trust matters.",
              },
            ].map((value, index) => (
              <Card
                key={index}
                className="p-8 bg-background border-border hover:shadow-xl transition-all animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <value.icon className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {value.desc}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-center mb-12">
            Leadership <span className="text-primary">Team</span>
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                name: "Alex Chen",
                role: "CEO & Co-Founder",
                bio: "Former VP of Growth at Series C SaaS. Built demand gen engine that scaled to $50M ARR.",
              },
              {
                name: "Sarah Martinez",
                role: "CTO & Co-Founder",
                bio: "Ex-Google ML Engineer. Led NLP and sentiment analysis for social products at scale.",
              },
              {
                name: "Mike Johnson",
                role: "VP of Product",
                bio: "15 years building enterprise B2B tools. Previously PM at Salesforce and HubSpot.",
              },
              {
                name: "Emma Lee",
                role: "VP of Customer Success",
                bio: "Former agency leader. Scaled customer success org from 5 to 50 people at last startup.",
              },
            ].map((member, index) => (
              <Card
                key={index}
                className="p-6 bg-card border-border text-center hover:shadow-lg transition-all animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-20 h-20 rounded-full bg-primary/20 text-primary font-bold text-2xl flex items-center justify-center mx-auto mb-4">
                  {member.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <h3 className="font-bold mb-1">{member.name}</h3>
                <p className="text-sm text-primary mb-3">{member.role}</p>
                <p className="text-sm text-muted-foreground">{member.bio}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats */}
        <Card className="p-12 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <h2 className="text-3xl font-bold text-center mb-12">
            By The Numbers
          </h2>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { value: "$142M", label: "Pipeline Generated" },
              { value: "340+", label: "Enterprise Customers" },
              { value: "18.2M", label: "Conversations Monitored" },
              { value: "99.7%", label: "Uptime SLA" },
            ].map((stat, index) => (
              <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default About;
