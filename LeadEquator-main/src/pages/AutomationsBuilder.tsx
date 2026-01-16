import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Zap, Plus, Settings, Play, Pause } from "lucide-react";

const AutomationsBuilder = () => {
  const automations = [
    {
      id: 1,
      name: "High-Intent Competitor Mentions",
      status: "Active",
      triggers: [
        "Intent score > 85",
        "Contains competitor name",
        "Negative sentiment",
      ],
      actions: [
        "Send AI-generated reply",
        "Create lead in Salesforce",
        "Notify sales team via Slack",
      ],
      performance: { triggered: 42, converted: 18, rate: "42.9%" },
    },
    {
      id: 2,
      name: "LinkedIn C-Level Engagement",
      status: "Active",
      triggers: [
        "Platform = LinkedIn",
        "User title contains C-level keywords",
        "Intent score > 70",
      ],
      actions: [
        "Suggest reply (manual approval)",
        "Add to high-value pipeline",
        "Schedule follow-up reminder",
      ],
      performance: { triggered: 28, converted: 12, rate: "42.9%" },
    },
    {
      id: 3,
      name: "Reddit Purchase Intent",
      status: "Paused",
      triggers: [
        "Platform = Reddit",
        "Keywords: 'looking for', 'need help'",
        "Intent score > 75",
      ],
      actions: [
        "Send contextual reply",
        "Tag as warm lead",
        "Add to nurture sequence",
      ],
      performance: { triggered: 134, converted: 31, rate: "23.1%" },
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 animate-fade-in">
          <div>
            <h1 className="text-4xl font-bold mb-2">Automations Builder</h1>
            <p className="text-muted-foreground">
              Create IF/THEN rules to automate engagement and lead capture
            </p>
          </div>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            New Automation
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {[
            { label: "Active Automations", value: "12" },
            { label: "Total Triggers (30d)", value: "2,847" },
            { label: "Avg Conversion Rate", value: "34.2%" },
          ].map((stat, index) => (
            <Card
              key={index}
              className="p-6 bg-card border-border animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-3xl font-bold mb-1 text-primary">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </Card>
          ))}
        </div>

        {/* Automation Cards */}
        <div className="space-y-6">
          {automations.map((automation, index) => (
            <Card
              key={automation.id}
              className="p-6 bg-card border-border hover:shadow-lg transition-all animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0 animate-glow-pulse">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">
                      {automation.name}
                    </h3>
                    <Badge
                      variant={
                        automation.status === "Active" ? "default" : "secondary"
                      }
                      className={
                        automation.status === "Active"
                          ? "bg-green-500/20 text-green-500"
                          : "bg-muted text-muted-foreground"
                      }
                    >
                      {automation.status === "Active" ? (
                        <Play className="w-3 h-3 mr-1" />
                      ) : (
                        <Pause className="w-3 h-3 mr-1" />
                      )}
                      {automation.status}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={automation.status === "Active"}
                    className="data-[state=checked]:bg-primary"
                  />
                  <Button size="sm" variant="ghost">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* Triggers */}
                <div className="bg-background rounded-lg p-4 border border-border">
                  <h4 className="text-sm font-bold mb-3 text-primary">
                    IF (Triggers)
                  </h4>
                  <ul className="space-y-2">
                    {automation.triggers.map((trigger, i) => (
                      <li
                        key={i}
                        className="text-sm flex items-start text-muted-foreground"
                      >
                        <span className="text-primary mr-2">▸</span>
                        {trigger}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Actions */}
                <div className="bg-background rounded-lg p-4 border border-border">
                  <h4 className="text-sm font-bold mb-3 text-primary">
                    THEN (Actions)
                  </h4>
                  <ul className="space-y-2">
                    {automation.actions.map((action, i) => (
                      <li
                        key={i}
                        className="text-sm flex items-start text-muted-foreground"
                      >
                        <span className="text-primary mr-2">→</span>
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Performance */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex gap-8 text-sm">
                  <div>
                    <span className="text-muted-foreground">Triggered:</span>
                    <span className="font-bold ml-2">
                      {automation.performance.triggered}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Converted:</span>
                    <span className="font-bold ml-2">
                      {automation.performance.converted}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Rate:</span>
                    <span className="font-bold ml-2 text-primary">
                      {automation.performance.rate}
                    </span>
                  </div>
                </div>
                <Button size="sm" variant="secondary">
                  View Details
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Template Section */}
        <Card className="mt-12 p-8 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <div className="text-center">
            <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">
              Start with a Template
            </h3>
            <p className="text-muted-foreground mb-6">
              Pre-built automation workflows for common use cases
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              {[
                "Competitor Intercept",
                "High-Intent Qualifier",
                "Enterprise ABM",
                "Influencer Outreach",
              ].map((template, index) => (
                <Button
                  key={index}
                  variant="secondary"
                  className="bg-background border-border"
                >
                  {template}
                </Button>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AutomationsBuilder;
