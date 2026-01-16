import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Video, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Resources = () => {
  // ✅ FIX: initialize navigate
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl font-bold mb-6">
            Learn How to Scale{" "}
            <span className="text-primary">Organic Engagement</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Expert insights, case studies, and best practices for AI-powered
            lead generation
          </p>
        </div>

        {/* Featured Resources */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Whitepaper */}
          <Card className="p-8 bg-card border-border hover:shadow-xl transition-all animate-fade-in">
            <FileText className="w-12 h-12 text-primary mb-4" />
            <h2 className="text-2xl font-bold mb-4">
              The PR Automation Playbook
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              A 32-page guide covering how enterprise brands replaced paid reach
              with AI-powered engagement. Includes frameworks, case studies, and
              ROI calculations.
            </p>
            <ul className="space-y-2 mb-6 text-sm">
              <li className="flex items-start">
                <span className="text-primary mr-2">▸</span>
                How to identify high-intent conversations at scale
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">▸</span>
                AI reply best practices that sound human
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">▸</span>
                Measuring conversation-to-revenue attribution
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">▸</span>
                3 real case studies: $2.4M pipeline in 6 months
              </li>
            </ul>
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              <Download className="mr-2 h-4 w-4" />
              Download Whitepaper
            </Button>
          </Card>

          {/* Webinar */}
          <Card
            className="p-8 bg-card border-border hover:shadow-xl transition-all animate-fade-in"
            style={{ animationDelay: "0.1s" }}
          >
            <Video className="w-12 h-12 text-primary mb-4" />
            <h2 className="text-2xl font-bold mb-4">
              Live Demo: Turn Reddit Threads Into Revenue
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Watch our 45-minute recorded webinar where we demonstrate live
              monitoring, AI reply generation, and CRM integration with real
              Reddit conversations.
            </p>
            <ul className="space-y-2 mb-6 text-sm">
              <li className="flex items-start">
                <span className="text-primary mr-2">▸</span>
                Live setup of monitoring streams (5 minutes)
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">▸</span>
                Intent scoring walkthrough with examples
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">▸</span>
                Automation builder demo (IF/THEN logic)
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">▸</span>
                Q&A with VP of Growth at enterprise client
              </li>
            </ul>
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              <Video className="mr-2 h-4 w-4" />
              Watch Webinar
            </Button>
          </Card>
        </div>

        {/* Additional Resources */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            More <span className="text-primary">Resources</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "ROI Calculator", desc: "Estimate your potential pipeline from social engagement", type: "Tool" },
              { title: "Case Study: B2B SaaS", desc: "How a growth team generated $1.2M in 90 days", type: "PDF" },
              { title: "Intent Scoring Guide", desc: "Understanding 0-100 scores and qualification", type: "Guide" },
              { title: "API Documentation", desc: "Integrate Leadequator with your stack", type: "Docs" },
              { title: "Best Practices", desc: "Writing AI replies that convert", type: "Article" },
              { title: "Video Tutorial", desc: "Setup automation in 10 minutes", type: "Video" },
            ].map((resource, index) => (
              <Card
                key={index}
                className="p-6 bg-background border-border hover:shadow-lg transition-all animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold">{resource.title}</h3>
                  <span className="text-xs text-primary font-semibold">
                    {resource.type}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {resource.desc}
                </p>
                <Button variant="secondary" size="sm" className="w-full">
                  Access
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="p-12 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to See It In Action?
          </h2>
          <p className="text-muted-foreground text-lg mb-6 max-w-2xl mx-auto">
            Request a personalized demo and we'll show you how Leadequator can
            generate pipeline for your specific use case.
          </p>
          <Button
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => navigate("/contact")}
          >
            Request Demo
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Resources;
