import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  X,
  ExternalLink,
  Copy,
  Send,
  Edit3,
  CheckCircle2,
  MessageSquare,
  BarChart3,
  Sparkles
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

/* ================= LABEL ================= */

const Label = ({ children }: { children: React.ReactNode }) => (
  <div className="text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest mb-2 block">
    {children}
  </div>
);

/* ================= COMPONENT ================= */

export const DetailPane = ({
  comment,
  onClose,
  onSend,
}: DetailPaneProps) => {
  const { toast } = useToast();

  const [replyText, setReplyText] = useState("");
  const [editingOption, setEditingOption] = useState<number | null>(null);
  const [option1Text, setOption1Text] = useState("");
  const [option2Text, setOption2Text] = useState("");

  useEffect(() => {
    if (comment) {
      setReplyText(
        comment.replyOption1 ||
          "Thanks for sharing! We'd love to help. Let me know if you'd like more details."
      );
      setOption1Text(comment.replyOption1 || "");
      setOption2Text(comment.replyOption2 || "");
      setEditingOption(null);
    }
  }, [comment]);

  const getIntentColor = (score: number) => {
    if (score >= 70) return "text-green-400";
    if (score >= 50) return "text-[#fbbf24]";
    return "text-zinc-400";
  };

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case "Positive": return "bg-green-500/10 text-green-400 border-green-500/20";
      case "Negative": return "bg-red-500/10 text-red-400 border-red-500/20";
      default: return "bg-zinc-500/10 text-zinc-300 border-zinc-500/20";
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Draft is ready to paste.",
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
      title: "Copied & Opening",
      description: "Paste your reply on the platform.",
    });
  };

  // Reusable input styling
  const textAreaStyle = "w-full bg-black/40 border border-white/[0.08] text-zinc-200 focus:border-[#fbbf24]/50 focus:ring-1 focus:ring-[#fbbf24]/30 rounded-xl p-4 text-sm md:text-base leading-relaxed transition-all resize-none custom-scrollbar";

  return (
    <div className="flex flex-col h-full w-full bg-transparent text-white">
      
      {/* Header (Sticky) */}
      <div className="p-4 md:p-6 border-b border-white/[0.08] flex items-center justify-between sticky top-0 bg-[#09090b]/90 backdrop-blur-xl z-20">
        <div className="flex items-center gap-3">
          <h3 className="text-xl md:text-2xl font-extrabold tracking-tight">Post Detail</h3>
          {comment.replyStatus === "Sent" && (
            <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 gap-1.5 px-2.5 py-1 font-bold">
              <CheckCircle2 className="h-3.5 w-3.5" /> Sent
            </Badge>
          )}
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-zinc-400 hover:text-white hover:bg-white/[0.08] rounded-full transition-colors">
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Body (Scrollable) */}
      <div className="flex-1 p-4 md:p-6 space-y-6 md:space-y-8">
        
        {/* Author & Meta */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="font-bold text-lg md:text-xl text-white">{comment.user}</div>
            <div className="text-xs md:text-sm text-zinc-400 font-medium mt-1">
              <span className="text-[#fbbf24] capitalize">{comment.platform}</span> • {comment.followers || 0} interactions
            </div>
          </div>
          <Badge variant="outline" className="bg-white/[0.02] text-zinc-400 border-white/[0.1] text-xs px-3 py-1 font-semibold whitespace-nowrap w-fit">
            {comment.timestamp}
          </Badge>
        </div>

        {/* Post Content */}
        <div className="space-y-1">
          <Label><MessageSquare className="h-3 w-3 inline mr-1.5 -mt-0.5"/> Post Content</Label>
          <div className="p-4 md:p-5 bg-black/40 border border-white/[0.05] rounded-2xl shadow-inner">
            <p className="text-sm md:text-base text-zinc-300 whitespace-pre-wrap leading-relaxed italic">
              "{comment.post}"
            </p>
          </div>
        </div>

        {/* Analysis Grid */}
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          <div className="p-4 md:p-5 bg-white/[0.02] border border-white/[0.05] rounded-2xl flex flex-col justify-center">
            <Label><BarChart3 className="h-3 w-3 inline mr-1.5 -mt-0.5"/> Intent Score</Label>
            <span className={`text-3xl md:text-4xl font-black mt-1 ${getIntentColor(comment.intent)}`}>
              {comment.intent}%
            </span>
          </div>
          <div className="p-4 md:p-5 bg-white/[0.02] border border-white/[0.05] rounded-2xl flex flex-col justify-center">
            <Label>Sentiment</Label>
            <Badge className={`w-fit mt-2 px-3 py-1 shadow-none ${getSentimentBadge(comment.sentiment)}`}>
              {comment.sentiment}
            </Badge>
          </div>
        </div>

        {/* Keywords */}
        <div className="space-y-1">
          <Label>Matched Keywords</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {comment.keywords.length > 0 ? (
              comment.keywords.map((k) => (
                <Badge key={k} variant="outline" className="bg-white/[0.03] text-zinc-300 border-white/[0.1] px-3 py-1">
                  {k}
                </Badge>
              ))
            ) : (
              <span className="text-sm text-zinc-500 italic">
                No targeted keywords extracted.
              </span>
            )}
          </div>
        </div>

        <Separator className="bg-white/[0.08]" />

        {/* Active Draft */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Active Reply Draft</Label>
          </div>
          <div className="p-1 rounded-2xl bg-gradient-to-b from-white/[0.08] to-transparent">
            <div className="bg-[#09090b] rounded-[14px] p-1">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className={`${textAreaStyle} min-h-[140px] border-none bg-transparent`}
                placeholder="Write your response here..."
              />
              <div className="flex flex-col sm:flex-row justify-end gap-2 p-2 pt-0 mt-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full sm:w-auto bg-white/[0.03] border-white/[0.1] text-white hover:bg-white/[0.1] rounded-xl h-10"
                  onClick={() => handleCopy(replyText)}
                >
                  <Copy className="h-4 w-4 mr-2 text-zinc-400" /> Copy Text
                </Button>
                <Button
                  size="sm"
                  className="w-full sm:w-auto bg-[#fbbf24] text-black hover:bg-[#fbbf24]/90 font-bold rounded-xl h-10 shadow-[0_0_15px_rgba(251,191,36,0.15)] transition-all"
                  onClick={() => handleCopyAndOpen(replyText)}
                >
                  <Send className="h-4 w-4 mr-2" /> Copy & Open URL
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Suggested Replies */}
        {(!comment.replyOption1 && !comment.replyOption2) ? null : (
          <div className="space-y-3 pt-4">
            <Label className="flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5 text-[#fbbf24]"/> AI Suggested Variations</Label>
            
            <div className="grid grid-cols-1 gap-4">
              {[ 
                { id: 1, text: option1Text, setText: setOption1Text },
                { id: 2, text: option2Text, setText: setOption2Text },
              ].map((option) =>
                option.text ? (
                  <div
                    key={option.id}
                    className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.1] transition-colors group"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <Badge variant="outline" className="bg-[#fbbf24]/10 text-[#fbbf24] border-[#fbbf24]/20 text-[10px] uppercase tracking-wider px-2">
                        Variation {option.id}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-white/[0.1] rounded-lg"
                        onClick={() =>
                          setEditingOption(
                            editingOption === option.id ? null : option.id
                          )
                        }
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                    </div>

                    {editingOption === option.id ? (
                      <textarea
                        value={option.text}
                        onChange={(e) => option.setText(e.target.value)}
                        className={`${textAreaStyle} min-h-[100px] mb-4`}
                      />
                    ) : (
                      <p className="text-sm text-zinc-300 leading-relaxed italic mb-5 pr-2">
                        "{option.text}"
                      </p>
                    )}

                    <Button
                      size="sm"
                      variant="secondary"
                      className="w-full bg-white/[0.05] text-white border border-white/[0.1] hover:bg-[#fbbf24] hover:text-black hover:border-[#fbbf24] font-semibold rounded-xl h-10 transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                      onClick={() => handleCopyAndOpen(option.text!)}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Use This Variation
                    </Button>
                  </div>
                ) : null
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer (Sticky) */}
      <div className="p-4 md:p-6 border-t border-white/[0.08] flex flex-col sm:flex-row gap-3 bg-[#09090b]/90 backdrop-blur-xl sticky bottom-0 z-20 rounded-b-[2rem]">
        <Button 
          variant="outline" 
          className="flex-1 bg-transparent border-white/[0.1] text-white hover:bg-white/[0.05] rounded-xl h-12" 
          onClick={onClose}
        >
          Close Detail
        </Button>

        {comment.url && (
          <Button
            className="flex-1 bg-white/[0.05] text-white hover:bg-white/[0.1] border border-white/[0.1] rounded-xl h-12 transition-all"
            onClick={() => window.open(comment.url, "_blank")}
          >
            <ExternalLink className="mr-2 h-4 w-4 text-zinc-400" />
            View Original Source
          </Button>
        )}
      </div>
    </div>
  );
};