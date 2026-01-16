import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Link,
  Webhook,
  Database,
  Mail,
  MessageSquare,
  Shield,
  Bell,
} from "lucide-react";

const SettingsIntegrations = () => {
  const integrations = [
    {
      name: "HubSpot CRM",
      icon: Database,
      status: "Connected",
      description: "Sync leads and contacts automatically",
    },
    {
      name: "Slack",
      icon: MessageSquare,
      status: "Connected",
      description: "Real-time alerts for high-intent comments",
    },
    {
      name: "Webhook",
      icon: Webhook,
      status: "Configured",
      description: "Custom event streaming to your endpoint",
    },
    {
      name: "Email Notifications",
      icon: Mail,
      status: "Active",
      description: "Daily summaries and weekly reports",
    },
  ];

  return (
    <div className="p-8 space-y-8 bg-background">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings & Integrations</h1>
        <p className="text-muted-foreground">
          Configure tracking, webhooks, and third-party integrations
        </p>
      </div>

      <Tabs defaultValue="tracking" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="tracking">Link Tracking</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* Link Tracking */}
        <TabsContent value="tracking" className="space-y-6">
          <Card className="p-6 bg-card border-border">
            <h3 className="text-xl font-bold mb-6">Link Tracking Configuration</h3>
            <div className="space-y-6">
              <div>
                <Label htmlFor="short-domain">Short Domain</Label>
                <Input
                  id="short-domain"
                  defaultValue="lq.link"
                  className="bg-background mt-2"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Custom short domain for branded tracking links
                </p>
              </div>

              <Separator />

              <div>
                <Label htmlFor="utm-source">Default UTM Parameters</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      utm_source
                    </Label>
                    <Input
                      defaultValue="leadequator"
                      className="bg-background mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      utm_medium
                    </Label>
                    <Input defaultValue="reply" className="bg-background mt-1" />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      utm_campaign
                    </Label>
                    <Input
                      defaultValue="pilot_comments"
                      className="bg-background mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      utm_content
                    </Label>
                    <Input
                      placeholder="Auto-filled with comment_id"
                      className="bg-background mt-1"
                      disabled
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label>Click Attribution Tracking</Label>
                  <p className="text-sm text-muted-foreground">
                    Log IP, user agent, and referrer for click events
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>GDPR Compliance Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Hash IP addresses and respect Do Not Track headers
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Webhooks */}
        <TabsContent value="webhooks" className="space-y-6">
          <Card className="p-6 bg-card border-border">
            <h3 className="text-xl font-bold mb-6">Webhook Configuration</h3>
            <div className="space-y-6">
              <div>
                <Label htmlFor="webhook-url">Webhook URL</Label>
                <Input
                  id="webhook-url"
                  placeholder="https://your-domain.com/webhook"
                  className="bg-background mt-2"
                />
              </div>

              <div>
                <Label>Event Types</Label>
                <div className="space-y-3 mt-3">
                  {[
                    { name: "comment_received", description: "New comment detected" },
                    { name: "intent_scored", description: "Intent analysis completed" },
                    { name: "reply_sent", description: "Auto reply posted" },
                    { name: "link_clicked", description: "Brand link clicked" },
                    { name: "lead_created", description: "Comment saved as lead" },
                  ].map((event) => (
                    <div
                      key={event.name}
                      className="flex items-center justify-between p-3 bg-background rounded border border-border"
                    >
                      <div>
                        <code className="text-sm font-mono text-primary">
                          {event.name}
                        </code>
                        <p className="text-xs text-muted-foreground mt-1">
                          {event.description}
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <Label htmlFor="webhook-secret">Webhook Secret</Label>
                <Input
                  id="webhook-secret"
                  type="password"
                  defaultValue="sk_live_..."
                  className="bg-background mt-2"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Used to sign webhook payloads (HMAC-SHA256)
                </p>
              </div>

              <Button className="bg-primary text-primary-foreground">
                Test Webhook
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Integrations */}
        <TabsContent value="integrations" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {integrations.map((integration) => (
              <Card key={integration.name} className="p-6 bg-card border-border">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <integration.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{integration.name}</h4>
                      <Badge
                        variant={
                          integration.status === "Connected" ? "default" : "secondary"
                        }
                        className={
                          integration.status === "Connected" ? "bg-green-500" : ""
                        }
                      >
                        {integration.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {integration.description}
                </p>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" className="flex-1">
                    Configure
                  </Button>
                  {integration.status === "Connected" && (
                    <Button variant="secondary" size="sm">
                      Disconnect
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="space-y-6">
          <Card className="p-6 bg-card border-border">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security & Compliance
            </h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>GDPR Compliance</Label>
                  <p className="text-sm text-muted-foreground">
                    Anonymize IPs, respect privacy headers
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>CCPA Compliance</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow data deletion requests
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label>Audit Log</Label>
                  <p className="text-sm text-muted-foreground">
                    Track all actions (reply sent, lead created, etc.)
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Require 2FA for admin accounts
                  </p>
                </div>
                <Switch />
              </div>

              <Separator />

              <div>
                <Label>Blocked Keywords</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Auto-replies will not be sent if these words appear
                </p>
                <Input
                  placeholder="spam, scam, illegal, ..."
                  className="bg-background"
                />
              </div>

              <div>
                <Label>Blacklisted Authors</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Never engage with these users
                </p>
                <Input placeholder="@username, @another" className="bg-background" />
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsIntegrations;
