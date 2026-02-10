import React, { useState, useEffect } from "react";
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
  CheckCircle2,
  ExternalLink as OpenIcon
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

/* ================= TYPES ================= */

export type DetailComment = {
  id: string;
  platform: string;
  user: string; 
  followers: number;
  timestamp: string;
  post: string; 
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
  onSend?: (id: string) => void; 
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
  
  // State for the main text editor
  const [replyText, setReplyText] = useState("");
  
  // States for inline editing of suggested replies
  const [editingOption, setEditingOption] = useState<number | null>(null);
  const [option1Text, setOption1Text] = useState("");
  const [option2Text, setOption2Text] = useState("");

  // Sync state when comment changes
  useEffect(() => {
    if (comment) {
      setReplyText(comment.replyOption1 || "Thanks for sharing! We'd love to help.");
      setOption1Text(comment.replyOption1 || "");
      setOption2Text(comment.replyOption2 || "");
      setEditingOption(null);
    }
  }, [comment]);

  const getIntentColor = (score: number) => {
    if (score >= 80) return "bg-green-500 text-white";
    if (score >= 60) return "bg-yellow-500 text-black";
    return "bg-muted text-muted-foreground";
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Draft is ready to be pasted.",
    });
  };

  const handleCopyAndOpen = (text: string) => {
    if (!comment.url) {
      toast({ title: "No URL found", variant: "destructive" });
      return;
    }
    navigator.clipboard.writeText(text);
    window.open(comment.url, "_blank", "noopener,noreferrer");
    if (onSend) onSend(comment.id);
    
    toast({
      title: "Copied & Opening...",
      description: "Paste your reply on the platform.",
    });
  };

  const handleSendAction = () => {
    handleCopyAndOpen(replyText);
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
                {comment.platform} • {comment.followers?.toLocaleString() || 0} likes
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

          <Separator />

          {/* Draft Area */}
          <div className="space-y-3">
            <Label>Active Editor</Label>
            <Card className="p-4 bg-background border-border shadow-sm">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="w-full bg-transparent outline-none text-sm resize-none min-h-[100px]"
              />
              <div className="flex justify-end gap-2 mt-2 pt-2 border-t">
                <Button size="sm" variant="outline" onClick={() => handleCopy(replyText)}>
                  <Copy className="h-3 w-3 mr-1" /> Copy
                </Button>
                <Button size="sm" className="bg-yellow-400 text-black hover:bg-yellow-500" onClick={handleSendAction}>
                  <Send className="h-3 w-3 mr-1" /> Copy & Send
                </Button>
              </div>
            </Card>
          </div>

          <Separator />

          {/* Suggested AI Replies */}
          <div className="space-y-4">
            <Label>Suggested AI Replies</Label>
            <div className="grid gap-4">
              {[
                { id: 1, label: "Option A", text: option1Text, setText: setOption1Text },
                { id: 2, label: "Option B", text: option2Text, setText: setOption2Text },
              ].map((option) => (
                option.text || editingOption === option.id ? (
                  <Card key={option.id} className="p-4 bg-muted/20 border-dashed border-border group">
                    <div className="flex justify-between items-center mb-2">
                      <Badge variant="outline" className="text-[9px] uppercase">
                        {option.label}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7"
                        onClick={() => setEditingOption(editingOption === option.id ? null : option.id)}
                      >
                        <Edit3 className={`h-3.5 w-3.5 ${editingOption === option.id ? "text-yellow-500" : "text-muted-foreground"}`} />
                      </Button>
                    </div>

                    {editingOption === option.id ? (
                      <textarea
                        value={option.text}
                        onChange={(e) => option.setText(e.target.value)}
                        className="w-full bg-background border rounded p-2 text-xs min-h-[80px] mb-2 outline-none focus:ring-1 focus:ring-yellow-400"
                      />
                    ) : (
                      <p className="text-xs text-muted-foreground leading-snug mb-3 italic">
                        "{option.text}"
                      </p>
                    )}

                    <div className="flex gap-2">
                      {/* <Button 
                        size="sm" 
                        variant="secondary" 
                        className="h-7 text-[10px] flex-1"
                        onClick={() => setReplyText(option.text)}
                      >
                        Use in Editor
                      </Button> */}
                      <Button 
                        size="sm" 
                        className="h-7 text-[10px] flex-1 bg-yellow-400/90 hover:bg-yellow-400 text-black"
                        onClick={() => handleCopyAndOpen(option.text)}
                      >
                        <OpenIcon className="h-3 w-3 mr-1" /> Copy & Open
                      </Button>
                    </div>
                  </Card>
                ) : null
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-border flex gap-3 bg-muted/5">
        <Button className="flex-1" variant="outline" onClick={onClose}>Close Detail</Button>
        <Button 
          className="flex-1 bg-secondary" 
          onClick={() => comment.url && window.open(comment.url, "_blank")}
        >
          <ExternalLink className="mr-2 h-4 w-4" /> View Original
        </Button>
      </div>
    </Card>
  );
};