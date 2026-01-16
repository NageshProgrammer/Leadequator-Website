import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, AlertTriangle, TrendingDown, Search } from "lucide-react";

const CompetitorWatch = () => {
  const competitors = [
    { name: "CompetitorA", mentions: 342, negative: 28, opportunities: 12 },
    { name: "CompetitorB", mentions: 198, negative: 15, opportunities: 7 },
    { name: "CompetitorC", mentions: 156, negative: 31, opportunities: 15 },
  ];

  const alerts = [
    {
      id: 1,
      competitor: "CompetitorA",
      severity: "High",
      platform: "Reddit",
      user: "frustrated_user_42",
      sentiment: "Negative",
      content:
        "CompetitorA's support has been absolutely terrible. Been waiting 5 days for a response and their chatbot is useless. Anyone know better alternatives?",
      timestamp: "15 minutes ago",
      intent: 89,
    },
    {
      id: 2,
      competitor: "CompetitorB",
      severity: "Medium",
      platform: "X",
      user: "Sarah M.",
      sentiment: "Negative",
      content:
        "@CompetitorB pricing just increased by 40% with no new features. Time to look at competitors. What are you all using?",
      timestamp: "1 hour ago",
      intent: 82,
    },
    {
      id: 3,
      competitor: "CompetitorC",
      severity: "High",
      platform: "LinkedIn",
      user: "Mike Johnson",
      sentiment: "Negative",
      content:
        "After 2 years with CompetitorC, we're switching providers. The lack of innovation and poor customer success has been frustrating. Open to recommendations.",
      timestamp: "3 hours ago",
      intent: 91,
    },
  ];

  const getSeverityColor = (severity: string) => {
    if (severity === "High") return "bg-destructive/20 text-destructive";
    if (severity === "Medium") return "bg-yellow-500/20 text-yellow-500";
    return "bg-blue-500/20 text-blue-500";
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 animate-fade-in">
          <div>
            <h1 className="text-4xl font-bold mb-2">Competitor Watch</h1>
            <p className="text-muted-foreground">
              Monitor competitor mentions and intercept dissatisfied customers
            </p>
          </div>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Eye className="mr-2 h-4 w-4" />
            Add Competitor
          </Button>
        </div>

        {/* Competitor Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {competitors.map((competitor, index) => (
            <Card
              key={index}
              className="p-6 bg-card border-border hover:shadow-lg transition-all animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold">{competitor.name}</h3>
                <Badge variant="secondary" className="text-xs">
                  Monitored
                </Badge>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Total Mentions
                  </span>
                  <span className="font-bold">{competitor.mentions}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground flex items-center">
                    <TrendingDown className="w-4 h-4 mr-1 text-destructive" />
                    Negative
                  </span>
                  <span className="font-bold text-destructive">
                    {competitor.negative}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-1 text-primary" />
                    Opportunities
                  </span>
                  <span className="font-bold text-primary">
                    {competitor.opportunities}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Search & Filters */}
        <Card className="p-4 bg-card border-border mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search competitor mentions..."
                className="pl-10 bg-background"
              />
            </div>
            <Button variant="secondary">Filter by Severity</Button>
          </div>
        </Card>

        {/* Alerts Feed */}
        <div className="space-y-6">
          {alerts.map((alert, index) => (
            <Card
              key={alert.id}
              className="p-6 bg-card border-border hover:shadow-lg transition-all animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-destructive/20 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-destructive" />
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity} Priority
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {alert.competitor}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {alert.platform}
                        </Badge>
                        <Badge className="bg-primary text-primary-foreground">
                          Intent: {alert.intent}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-semibold">{alert.user}</span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-muted-foreground">
                          {alert.timestamp}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-foreground mb-4 leading-relaxed">
                    {alert.content}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="text-xs border-destructive/30 text-destructive"
                      >
                        {alert.sentiment}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        High conversion opportunity
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary">
                        View Full Thread
                      </Button>
                      <Button
                        size="sm"
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        Engage Now
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Conversion Stats */}
        <Card className="mt-12 p-8 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">34</div>
              <div className="text-sm text-muted-foreground">
                Competitor Conversions (30d)
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">$1.4M</div>
              <div className="text-sm text-muted-foreground">
                Pipeline from Competitor Watch
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">41%</div>
              <div className="text-sm text-muted-foreground">
                Win Rate on Intercepts
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CompetitorWatch;
