import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  X, 
  ExternalLink, 
  Copy, 
  Send, 
  Edit3, 
  CheckCircle2 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

/* ================= TYPES ================= */

export type DetailComment = {
  id: string;
  platform: string;
  user: string; 
  followers: number;
  timestamp: string;
  post: string; // Changed from content to post to match your previous component mapping
  intent: number;
  sentiment: "Positive" | "Neutral" | "Negative";
  keywords: string[];
  replyStatus: "Not Sent" | "Sent";
  url?: string;
  replyOption1?: string | null;
  replyOption2?: string | null;
};

interface DetailPaneProps {
  comment: DetailComment;
  onClose: () => void;
  onSend?: (id: string) => void; // Optional if not yet implemented in parent
}

/* ================= HELPER LABEL ================= */

const Label = ({ children }: { children: React.ReactNode }) => (
  <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
    {children}
  </div>
);

/* ================= COMPONENT ================= */

export const DetailPane = ({ comment, onClose, onSend }: DetailPaneProps) => {
  const { toast } = useToast();
  
  // Initialize state with suggested reply or default
  const [replyText, setReplyText] = useState(
    comment.replyOption1 || "Thanks for sharing! We'd love to help. Check out our solution: [link]"
  );

  const getIntentColor = (score: number) => {
    if (score >= 80) return "bg-green-500 text-white";
    if (score >= 60) return "bg-yellow-500 text-black";
    return "bg-muted text-muted-foreground";
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(replyText);
    toast({
      title: "Copied to clipboard",
      description: "You can now paste this reply manually.",
    });
  };

  /**
   * Primary Action:
   * 1. Copies draft to clipboard
   * 2. Opens URL in new tab
   * 3. Triggers onSend callback
   */
  const handleSendAction = () => {
    if (!comment.url) {
      toast({
        title: "No URL found",
        description: "Cannot open the source post because the URL is missing.",
        variant: "destructive",
      });
      return;
    }

    // 1. Copy text
    navigator.clipboard.writeText(replyText);

    // 2. Open URL
    window.open(comment.url, "_blank", "noopener,noreferrer");

    // 3. Mark as sent
    if (onSend) {
      onSend(comment.id);
    }

    toast({
      title: "Opening Platform...",
      description: "Draft copied! Paste it (Ctrl+V) into the comment section.",
    });
  };

  const useSuggested = (text: string) => {
    setReplyText(text);
    toast({
      title: "Draft Updated",
      description: "Suggested reply loaded into the editor.",
    });
  };

  return (
    <Card className="w-full h-full bg-card border-border flex flex-col rounded-none border-y-0 border-r-0">
      {/* Header */}
      <div className="p-6 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-bold">Post Detail</h3>
          {comment.replyStatus === "Sent" && (
            <Badge className="bg-green-500/10 text-green-500 border-green-500/20 gap-1">
              <CheckCircle2 className="h-3 w-3" /> Sent
            </Badge>
          )}
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {/* Author Section */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-lg text-foreground">{comment.user}</div>
              <div className="text-sm text-muted-foreground">
                {comment.platform} • {comment.followers.toLocaleString()} likes/interactions
              </div>
            </div>
            <Badge variant="outline" className="text-[10px] font-mono">
              {comment.timestamp}
            </Badge>
          </div>

          <Separator />

          {/* Post Content */}
          <div className="space-y-2">
            <Label>Post Content</Label>
            <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                {comment.post}
              </p>
            </div>
          </div>

          <Separator />

          {/* Analysis Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Intent Score</Label>
              <div className="flex items-center gap-2">
                <Badge className={`${getIntentColor(comment.intent)}`}>
                  {comment.intent}%
                </Badge>
                <span className="text-xs text-muted-foreground">Purchase Intent</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Sentiment</Label>
              <div className="mt-1">
                <Badge variant="secondary" className="capitalize">
                  {comment.sentiment}
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Matched Keywords</Label>
            <div className="flex flex-wrap gap-2">
              {comment.keywords.length > 0 ? (
                comment.keywords.map((k) => (
                  <Badge key={k} variant="outline" className="text-[10px] bg-background">
                    {k}
                  </Badge>
                ))
              ) : (
                <span className="text-xs text-muted-foreground italic">No keywords extracted</span>
              )}
            </div>
          </div>

          <Separator />

          {/* Draft Area */}
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <Label>Active Reply Draft</Label>
              <span className="text-[10px] text-muted-foreground italic">Auto-copies on send</span>
            </div>
            <Card className="p-4 bg-background border-border shadow-sm ring-1 ring-border/50">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="w-full bg-transparent outline-none text-sm resize-none min-h-[120px] placeholder:text-muted-foreground"
                placeholder="Draft your response here..."
              />
              
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${comment.replyStatus === "Sent" ? "bg-green-500" : "bg-amber-500"}`} />
                    <span className="text-xs font-medium">{comment.replyStatus}</span>
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={handleCopy} className="h-8">
                    <Copy className="h-3.5 w-3.5 mr-2" />
                    Copy
                  </Button>
                  <Button 
                    size="sm" 
                    className="h-8 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
                    onClick={handleSendAction}
                    disabled={comment.replyStatus === "Sent"}
                  >
                    <Send className="h-3.5 w-3.5 mr-2" />
                    Copy & Send
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          <Separator />

          {/* AI Suggestions */}
          <div className="space-y-4">
            <Label>Suggested AI Replies</Label>
            <div className="grid gap-3">
              {[
                { label: "Option A", text: comment.replyOption1 },
                { label: "Option B", text: comment.replyOption2 },
              ].map((option, idx) => (
                option.text && (
                  <Card key={idx} className="p-3 bg-muted/20 border-dashed border-border hover:bg-muted/40 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline" className="text-[9px] uppercase tracking-tighter">
                        {option.label}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 hover:bg-background" 
                        onClick={() => useSuggested(option.text!)}
                      >
                        <Edit3 className="h-3.5 w-3.5 text-muted-foreground" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground leading-snug">
                      "{option.text}"
                    </p>
                  </Card>
                )
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Footer Actions */}
      <div className="p-6 border-t border-border flex gap-3 bg-muted/10">
        <Button variant="outline" className="flex-1" onClick={handleCopy}>
          <Copy className="mr-2 h-4 w-4" />
          Copy All
        </Button>
        <Button 
          className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/80" 
          onClick={() => comment.url && window.open(comment.url, "_blank")}
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          View Original
        </Button>
      </div>
    </Card>
  );
};