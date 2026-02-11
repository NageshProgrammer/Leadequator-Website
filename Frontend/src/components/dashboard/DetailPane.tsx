// import React, { useState, useEffect } from "react";
// import { Card } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import {
//   X,
//   ExternalLink,
//   Copy,
//   Send,
//   Edit3,
//   CheckCircle2,
// } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";

// /* ================= TYPES ================= */

// export type DetailComment = {
//   id: string;
//   platform: string;
//   user: string;
//   followers: number;
//   timestamp: string;
//   post: string;
//   intent: number;
//   sentiment: "Positive" | "Neutral" | "Negative";
//   keywords: string[];
//   replyStatus: "Not Sent" | "Sent";
//   url?: string;
//   replyOption1?: string | null;
//   replyOption2?: string | null;
// };

// interface DetailPaneProps {
//   comment: DetailComment;
//   onClose: () => void;
//   onSend?: (id: string) => void;
// }

// /* ================= LABEL ================= */

// const Label = ({ children }: { children: React.ReactNode }) => (
//   <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
//     {children}
//   </div>
// );

// /* ================= COMPONENT ================= */

// export const DetailPane = ({
//   comment,
//   onClose,
//   onSend,
// }: DetailPaneProps) => {
//   const { toast } = useToast();

//   const [replyText, setReplyText] = useState("");
//   const [editingOption, setEditingOption] = useState<number | null>(null);
//   const [option1Text, setOption1Text] = useState("");
//   const [option2Text, setOption2Text] = useState("");

//   useEffect(() => {
//     if (comment) {
//       setReplyText(
//         comment.replyOption1 ||
//           "Thanks for sharing! We'd love to help. Let me know if you'd like more details."
//       );
//       setOption1Text(comment.replyOption1 || "");
//       setOption2Text(comment.replyOption2 || "");
//       setEditingOption(null);
//     }
//   }, [comment]);

//   const getIntentColor = (score: number) => {
//     if (score >= 80) return "bg-green-500 text-white";
//     if (score >= 60) return "bg-yellow-500 text-black";
//     return "bg-muted text-muted-foreground";
//   };

//   const handleCopy = (text: string) => {
//     navigator.clipboard.writeText(text);
//     toast({
//       title: "Copied to clipboard",
//       description: "Draft is ready to paste.",
//     });
//   };

//   const handleCopyAndOpen = (text: string) => {
//     if (!comment.url) {
//       toast({ title: "No URL found", variant: "destructive" });
//       return;
//     }

//     navigator.clipboard.writeText(text);
//     window.open(comment.url, "_blank", "noopener,noreferrer");

//     if (onSend) onSend(comment.id);

//     toast({
//       title: "Copied & Opening",
//       description: "Paste your reply on the platform.",
//     });
//   };

//   return (
//     <Card className="w-full h-full bg-card border-border flex flex-col">
//       {/* Header */}
//       <div className="p-6 border-b flex items-center justify-between">
//         <div className="flex items-center gap-2">
//           <h3 className="text-xl font-bold">Post Detail</h3>
//           {comment.replyStatus === "Sent" && (
//             <Badge className="bg-green-500/10 text-green-500 border-green-500/20 gap-1">
//               <CheckCircle2 className="h-3 w-3" /> Sent
//             </Badge>
//           )}
//         </div>
//         <Button variant="ghost" size="icon" onClick={onClose}>
//           <X className="h-4 w-4" />
//         </Button>
//       </div>

//       <ScrollArea className="flex-1">
//         <div className="p-6 space-y-6">
//           {/* Author */}
//           <div className="flex items-center justify-between">
//             <div>
//               <div className="font-semibold text-lg">{comment.user}</div>
//               <div className="text-sm text-muted-foreground">
//                 {comment.platform} • {comment.followers || 0} interactions
//               </div>
//             </div>
//             <Badge variant="secondary" className="text-xs">
//               {comment.timestamp}
//             </Badge>
//           </div>

//           <Separator />

//           {/* Post */}
//           <div>
//             <Label>Post Content</Label>
//             <div className="p-4 bg-muted/30 rounded-lg">
//               <p className="text-sm whitespace-pre-wrap">
//                 {comment.post}
//               </p>
//             </div>
//           </div>

//           <Separator />

//           {/* Analysis */}
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <Label>Intent</Label>
//               <Badge className={getIntentColor(comment.intent)}>
//                 {comment.intent}%
//               </Badge>
//             </div>
//             <div>
//               <Label>Sentiment</Label>
//               <Badge variant="secondary">{comment.sentiment}</Badge>
//             </div>
//           </div>

//           {/* Keywords */}
//           <div>
//             <Label>Matched Keywords</Label>
//             <div className="flex flex-wrap gap-2 mt-2">
//               {comment.keywords.length > 0 ? (
//                 comment.keywords.map((k) => (
//                   <Badge key={k} variant="outline" className="text-xs">
//                     {k}
//                   </Badge>
//                 ))
//               ) : (
//                 <span className="text-xs text-muted-foreground italic">
//                   No keywords extracted
//                 </span>
//               )}
//             </div>
//           </div>

//           <Separator />

//           {/* Active Draft */}
//           <div>
//             <Label>Active Reply Draft</Label>
//             <Card className="p-4 bg-background mt-2">
//               <textarea
//                 value={replyText}
//                 onChange={(e) => setReplyText(e.target.value)}
//                 className="w-full bg-transparent outline-none text-sm resize-none min-h-[120px]"
//               />

//               <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
//                 <Button
//                   size="sm"
//                   variant="outline"
//                   onClick={() => handleCopy(replyText)}
//                 >
//                   <Copy className="h-3 w-3 mr-1" /> Copy
//                 </Button>

//                 <Button
//                   size="sm"
//                   className="bg-yellow-400 text-black hover:bg-yellow-500"
//                   onClick={() => handleCopyAndOpen(replyText)}
//                 >
//                   <Send className="h-3 w-3 mr-1" /> Copy & Send
//                 </Button>
//               </div>
//             </Card>
//           </div>

//           <Separator />

//           {/* Suggested Replies */}
//           <div>
//             <Label>Suggested AI Replies</Label>

//             {[ 
//               { id: 1, text: option1Text, setText: setOption1Text },
//               { id: 2, text: option2Text, setText: setOption2Text },
//             ].map((option) =>
//               option.text ? (
//                 <Card
//                   key={option.id}
//                   className="p-4 mt-3 bg-muted/20 border-dashed"
//                 >
//                   <div className="flex justify-between items-center mb-2">
//                     <Badge variant="outline" className="text-xs">
//                       Option {option.id}
//                     </Badge>

//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       onClick={() =>
//                         setEditingOption(
//                           editingOption === option.id ? null : option.id
//                         )
//                       }
//                     >
//                       <Edit3 className="h-3 w-3" />
//                     </Button>
//                   </div>

//                   {editingOption === option.id ? (
//                     <textarea
//                       value={option.text}
//                       onChange={(e) =>
//                         option.setText(e.target.value)
//                       }
//                       className="w-full bg-background border rounded p-2 text-xs min-h-[80px]"
//                     />
//                   ) : (
//                     <p className="text-xs italic mb-3">
//                       "{option.text}"
//                     </p>
//                   )}

//                   <Button
//                     size="sm"
//                     className="w-full bg-yellow-400 text-black hover:bg-yellow-500"
//                     onClick={() =>
//                       handleCopyAndOpen(option.text!)
//                     }
//                   >
//                     <ExternalLink className="h-3 w-3 mr-1" />
//                     Copy & Open
//                   </Button>
//                 </Card>
//               ) : null
//             )}
//           </div>
//         </div>
//       </ScrollArea>

//       {/* Footer */}
//       <div className="p-4 border-t flex gap-3">
//         <Button variant="outline" className="flex-1" onClick={onClose}>
//           Close
//         </Button>

//         {comment.url && (
//           <Button
//             className="flex-1"
//             onClick={() =>
//               window.open(comment.url, "_blank")
//             }
//           >
//             <ExternalLink className="mr-2 h-4 w-4" />
//             View Original
//           </Button>
//         )}
//       </div>
//     </Card>
//   );
// };
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

const Label = ({ children }: { children: React.ReactNode }) => (
  <div className="text-[10px] md:text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
    {children}
  </div>
);

export const DetailPane = ({ comment, onClose, onSend }: DetailPaneProps) => {
  const { toast } = useToast();
  
  const [replyText, setReplyText] = useState("");
  const [editingOption, setEditingOption] = useState<number | null>(null);
  const [option1Text, setOption1Text] = useState("");
  const [option2Text, setOption2Text] = useState("");

  useEffect(() => {
    if (comment) {
      setReplyText(comment.replyOption1 || "Thanks for sharing! We'd love to help.");
      setOption1Text(comment.replyOption1 || "");
      setOption2Text(comment.replyOption2 || "");
      setEditingOption(null);
    }
  }, [comment]);

  const getIntentColor = (score: number) => {
    if (score >= 80) return "bg-[#FFD700] text-black hover:bg-[#FFD700]/80";
    if (score >= 60) return "bg-emerald-500 text-white";
    return "bg-zinc-700 text-zinc-300";
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied", description: "Draft copied to clipboard." });
  };

  const handleSendAction = () => {
    if (!comment.url) {
      toast({ title: "No URL found", variant: "destructive" });
      return;
    }
    navigator.clipboard.writeText(replyText);
    window.open(comment.url, "_blank", "noopener,noreferrer");
    if (onSend) onSend(comment.id);
    
    toast({ title: "Opening Link", description: "Paste your reply on the platform." });
  };

  return (
    <div className="w-full h-full bg-zinc-950 flex flex-col text-white">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-zinc-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-bold">Post Details</h3>
          {comment.replyStatus === "Sent" && (
            <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 gap-1">
              <CheckCircle2 className="h-3 w-3" /> Sent
            </Badge>
          )}
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-zinc-800 text-zinc-400">
          <X className="h-5 w-5" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 md:p-6 space-y-6">
          {/* Author Section */}
          <div className="flex justify-between items-start">
            <div>
              <div className="font-semibold text-lg text-[#FFD700]">{comment.user}</div>
              <div className="text-xs text-zinc-500 mt-1">
                {comment.platform} • {comment.followers?.toLocaleString() || 0} likes
              </div>
            </div>
            <Badge className={`text-xs ${getIntentColor(comment.intent)}`}>
              {comment.intent}% Intent
            </Badge>
          </div>

          <Separator className="bg-zinc-800" />

          {/* Post Content */}
          <div className="space-y-2">
            <Label>Post Content</Label>
            <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
              <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
                {comment.post}
              </p>
            </div>
          </div>

          {/* Editor */}
          <div className="space-y-2">
            <Label>Your Reply</Label>
            <div className="rounded-xl border border-zinc-700 bg-black overflow-hidden focus-within:ring-1 focus-within:ring-[#FFD700]">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="w-full bg-transparent p-4 outline-none text-sm text-zinc-200 resize-none min-h-[100px]"
                placeholder="Write your response..."
              />
              <div className="flex justify-end gap-2 p-2 border-t border-zinc-800 bg-zinc-900">
                <Button size="sm" variant="ghost" onClick={() => handleCopy(replyText)} className="text-zinc-400 hover:text-white">
                  <Copy className="h-4 w-4 mr-2" /> Copy
                </Button>
                <Button size="sm" className="bg-[#FFD700] text-black hover:bg-[#FFD700]/90 font-bold" onClick={handleSendAction}>
                  <Send className="h-4 w-4 mr-2" /> Copy & Open
                </Button>
              </div>
            </div>
          </div>

          {/* AI Suggestions */}
          {(option1Text || option2Text) && (
            <div className="space-y-3">
              <Label>AI Suggestions</Label>
              <div className="grid gap-3">
                {[
                  { id: 1, label: "Option A", text: option1Text },
                  { id: 2, label: "Option B", text: option2Text },
                ].map((opt) => (
                  opt.text && (
                    <div key={opt.id} className="p-3 bg-zinc-900/30 border border-dashed border-zinc-800 rounded-lg group hover:border-zinc-600 cursor-pointer" onClick={() => setReplyText(opt.text)}>
                        <div className="flex justify-between mb-2">
                            <Badge variant="outline" className="text-[10px] border-zinc-700 text-zinc-500">{opt.label}</Badge>
                            <Edit3 className="h-3 w-3 text-zinc-600 group-hover:text-[#FFD700]" />
                        </div>
                        <p className="text-xs text-zinc-400 line-clamp-3">{opt.text}</p>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};