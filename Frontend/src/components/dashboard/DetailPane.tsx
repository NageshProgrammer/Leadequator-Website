import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { X, ExternalLink, Copy, Send, UserPlus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

/* ================= TYPES ================= */

export type DetailComment = {
  id: number;
  platform: string;
  user: string;
  followers: number;
  timestamp: string;
  content: string;
  intent: number;
  sentiment: "Positive" | "Neutral" | "Negative";
  keywords: string[];
  replyStatus: "Not Sent" | "Sent";
};

interface DetailPaneProps {
  comment: DetailComment;
  onClose: () => void;
  onSend: (id: number) => void;
}

/* ================= COMPONENT ================= */

export const DetailPane = ({ comment, onClose, onSend }: DetailPaneProps) => {
  const [replyText, setReplyText] = useState(
    "Thanks for sharing! We'd love to help. Check out Leadequator: [link]"
  );
  const [sending, setSending] = useState(false);

  const getIntentColor = (score: number) => {
    if (score >= 80) return "bg-green-500 text-white";
    if (score >= 60) return "bg-chart-2 text-foreground";
    return "bg-muted text-muted-foreground";
  };

  const handleSend = () => {
    if (sending) return;

    setSending(true);

    // simulate API / AI send delay
    setTimeout(() => {
      onSend(comment.id); // 🔥 THIS IS THE KEY TRIGGER
      setSending(false);
    }, 600);
  };

  return (
    <Card className="w-full h-full bg-card border-border flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border flex items-center justify-between">
        <h3 className="text-xl font-bold">Comment Detail</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {/* Author */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-lg">{comment.user}</div>
              <div className="text-sm text-muted-foreground">
                {comment.followers} followers • {comment.platform}
              </div>
            </div>
            <Badge variant="secondary">{comment.timestamp}</Badge>
          </div>

          <Separator />

          {/* Comment */}
          <div>
            <Label>Comment</Label>
            <p className="text-sm text-foreground mt-1">{comment.content}</p>
          </div>

          <Separator />

          {/* Intent & Sentiment */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Intent Score</Label>
              <Badge className={getIntentColor(comment.intent)}>
                {comment.intent}
              </Badge>
            </div>
            <div>
              <Label>Sentiment</Label>
              <Badge variant="secondary">{comment.sentiment}</Badge>
            </div>
          </div>

          {/* Keywords */}
          <div>
            <Label>Matched Keywords</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {comment.keywords.map((k) => (
                <Badge key={k} variant="outline">
                  {k}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Auto Reply Draft */}
          <div>
            <Label>Auto Reply</Label>
            <Card className="p-4 bg-background border-border mt-2">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="w-full bg-transparent outline-none text-sm resize-none"
                rows={4}
              />
            </Card>

            <div className="flex items-center gap-2 mt-3">
              <Badge
                variant={comment.replyStatus === "Sent" ? "default" : "secondary"}
                className={
                  comment.replyStatus === "Sent" ? "bg-green-500" : ""
                }
              >
                {comment.replyStatus}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Suggested Replies */}
          <div>
            <Label>Suggested AI Replies</Label>
            <div className="space-y-3 mt-3">
              {[
                "Short & Friendly",
                "Helpful & Educational",
                "Strong CTA",
              ].map((label) => (
                <Card key={label} className="p-3 bg-background border-border">
                  <Badge variant="outline" className="mb-2 text-xs">
                    {label}
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    Thanks for sharing! We'd love to help. Check out Leadequator.
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" variant="secondary">
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      className="bg-primary text-primary-foreground"
                      onClick={handleSend}
                      disabled={sending || comment.replyStatus === "Sent"}
                    >
                      <Send className="mr-2 h-3 w-3" />
                      {sending ? "Sending..." : "Send"}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Footer Actions */}
      <div className="p-6 border-t border-border flex gap-2">
        <Button variant="secondary" className="flex-1">
          <Copy className="mr-2 h-4 w-4" />
          Copy Reply
        </Button>
        <Button className="flex-1 bg-primary text-primary-foreground">
          <UserPlus className="mr-2 h-4 w-4" />
          Save as Lead
        </Button>
      </div>
    </Card>
  );
};

/* ================= LABEL ================= */

const Label = ({ children }: { children: React.ReactNode }) => (
  <div className="text-sm font-semibold mb-1">{children}</div>
);
