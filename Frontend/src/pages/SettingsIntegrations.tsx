import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Webhook,
  Database,
  Mail,
  MessageSquare,
  Shield,
  Settings2,
  Lock,
} from "lucide-react";

const SettingsIntegrations = () => {
  const integrations = [
    { name: "HubSpot CRM", icon: Database, status: "Connected", description: "Sync leads and contacts automatically" },
    { name: "Slack", icon: MessageSquare, status: "Connected", description: "Real-time alerts for high-intent comments" },
    { name: "Webhook", icon: Webhook, status: "Configured", description: "Custom event streaming to your endpoint" },
    { name: "Email Notifications", icon: Mail, status: "Active", description: "Daily summaries and weekly reports" },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 bg-background min-h-screen">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          <Settings2 className="h-6 w-6 text-[#FFD700]" />
          Settings <span className="text-[#FFD700]">&</span> Integrations
        </h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Configure tracking, webhooks, and third-party tools.
        </p>
      </div>

      <Tabs defaultValue="tracking" className="w-full">
        {/* Responsive Tabs List - Scrolls horizontally on small screens */}
        <div className="overflow-x-auto pb-2 scrollbar-hide">
          <TabsList className="flex w-max md:w-full md:grid md:grid-cols-4 bg-zinc-900/50 p-1 border border-zinc-800">
            <TabsTrigger value="tracking" className="px-6 md:px-0">Tracking</TabsTrigger>
            <TabsTrigger value="webhooks" className="px-6 md:px-0">Webhooks</TabsTrigger>
            <TabsTrigger value="integrations" className="px-6 md:px-0">Integrations</TabsTrigger>
            <TabsTrigger value="security" className="px-6 md:px-0">Security</TabsTrigger>
          </TabsList>
        </div>

        {/* Link Tracking */}
        <TabsContent value="tracking" className="space-y-6 mt-4 md:mt-8">
          <Card className="p-4 md:p-6 bg-card border-border">
            <h3 className="text-lg md:text-xl font-bold mb-6 text-[#FFD700]">Link Tracking</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="short-domain" className="text-xs uppercase font-bold tracking-widest text-muted-foreground">Short Domain</Label>
                <Input id="short-domain" defaultValue="lq.link" className="bg-background h-11" />
                <p className="text-[11px] text-muted-foreground italic">Custom short domain for branded links.</p>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label className="text-xs uppercase font-bold tracking-widest text-muted-foreground">Default UTM Parameters</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {["source", "medium", "campaign", "content"].map((utm) => (
                    <div key={utm}>
                      <Label className="text-[10px] text-muted-foreground ml-1 mb-1 block">utm_{utm}</Label>
                      <Input 
                        defaultValue={utm === "content" ? "" : `lq_${utm}`} 
                        placeholder={utm === "content" ? "Auto-filled" : ""}
                        disabled={utm === "content"}
                        className="bg-background h-10" 
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <Label className="text-sm md:text-base font-semibold">Attribution Tracking</Label>
                    <p className="text-xs text-muted-foreground">Log IP and referrer for clicks.</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <Label className="text-sm md:text-base font-semibold">GDPR Mode</Label>
                    <p className="text-xs text-muted-foreground">Hash IPs and respect DNT headers.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Webhooks */}
        <TabsContent value="webhooks" className="space-y-6 mt-4">
          <Card className="p-4 md:p-6 bg-card border-border">
            <h3 className="text-lg md:text-xl font-bold mb-6 text-[#FFD700]">Webhooks</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="webhook-url" className="text-xs uppercase font-bold text-muted-foreground">Endpoint URL</Label>
                <Input id="webhook-url" placeholder="https://..." className="bg-background h-11" />
              </div>

              <div className="space-y-3">
                <Label className="text-xs uppercase font-bold text-muted-foreground">Events to Stream</Label>
                <div className="grid grid-cols-1 gap-2">
                  {["comment_received", "intent_scored", "reply_sent", "link_clicked"].map((ev) => (
                    <div key={ev} className="flex items-center justify-between p-3 bg-zinc-900/40 rounded-lg border border-border">
                      <code className="text-[10px] md:text-xs font-mono text-[#FFD700] uppercase tracking-tighter">{ev}</code>
                      <Switch defaultChecked />
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <Button className="w-full md:w-auto bg-[#FFD700] text-black hover:bg-[#FFD700]/90 font-bold px-8">
                  Test Connection
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Integrations Grid */}
        <TabsContent value="integrations" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrations.map((integration) => (
              <Card key={integration.name} className="p-4 md:p-6 bg-card border-border flex flex-col justify-between hover:border-[#FFD700]/30 transition-colors">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#FFD700]/10 flex items-center justify-center">
                        <integration.icon className="h-5 w-5 text-[#FFD700]" />
                      </div>
                      <h4 className="font-bold text-sm md:text-base">{integration.name}</h4>
                    </div>
                    <Badge variant="outline" className={integration.status === "Connected" ? "bg-emerald-500/10 text-emerald-500 border-none" : ""}>
                      {integration.status}
                    </Badge>
                  </div>
                  <p className="text-xs md:text-sm text-muted-foreground mb-6 leading-relaxed">
                    {integration.description}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" className="flex-1 text-xs">Configure</Button>
                  {integration.status === "Connected" && (
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-500/5 text-xs">Disconnect</Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="mt-4">
          <Card className="p-4 md:p-6 bg-card border-border">
            <h3 className="text-lg md:text-xl font-bold mb-6 text-[#FFD700] flex items-center gap-2">
              <Lock className="h-5 w-5" /> Security & Access
            </h3>
            <div className="space-y-6">
              {[
                { title: "2FA Authentication", desc: "Require code for admin login." },
                { title: "Author Blacklist", desc: "Ignore specific users." },
                { title: "Keywords Filter", desc: "Block replies for specific words." }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <Label className="text-sm md:text-base font-semibold">{item.title}</Label>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch />
                </div>
              ))}
              <div className="pt-4">
                <Input placeholder="Add comma separated keywords..." className="bg-background" />
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsIntegrations;