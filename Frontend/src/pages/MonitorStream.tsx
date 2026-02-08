import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, Sparkles, ExternalLink, Clock, User, AlertCircle } from "lucide-react";
import { FilterPanel } from "@/components/dashboard/FilterPanel";
import { DetailPane } from "@/components/dashboard/DetailPane";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/* ================= TYPES ================= */
type Thread = {
  id: number;
  platform: string;
  user: string;
  intent: number;
  sentiment: "Positive" | "Neutral" | "Negative";
  timestamp: string;
  content: string;
  engagement: { likes: number };
  keywords: string[];
  url?: string;
  replyStatus: "Not Sent" | "Sent";
};

const MonitorStream = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Thread | null>(null);
  const { toast } = useToast();

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    const loadQuora = async () => {
      setLoading(true);
      setError(null);
      try {
        // Try local proxy first, then fallback to localhost:8000
        const res = await fetch("/api/quora/posts").catch(() => fetch("http://localhost:8000/quora/posts"));
        
        if (!res.ok) throw new Error(`Server responded with ${res.status}`);
        
        const body = await res.json();
        const items = body?.data ?? body ?? [];
        
        const mapped = items.map((it: any, idx: number) => ({
          id: it.id ?? idx + 1,
          platform: it.platform ?? "Quora",
          user: it.author ?? it.userId ?? "Unknown",
          intent: Number(it.intent ?? 50),
          sentiment: it.intent >= 80 ? "Positive" : it.intent >= 60 ? "Neutral" : "Negative",
          timestamp: it.timestamp ?? new Date().toLocaleDateString(),
          content: it.content ?? it.question ?? it.title ?? "",
          url: it.url,
          engagement: { likes: Number(it.likes ?? 0) },
          keywords: it.keywords ?? [],
          replyStatus: it.replyStatus ?? "Not Sent",
        }));
        
        setThreads(mapped);
      } catch (e: any) {
        const errorMessage = e.message === "Failed to fetch" 
            ? "Cannot connect to AI service. Please ensure the backend is running." 
            : e.message;
            
        setError(errorMessage);
        toast({ 
          variant: "destructive", 
          title: "Failed to load posts", 
          description: errorMessage 
        });
      } finally {
        setLoading(false);
      }
    };
    loadQuora();
  }, [toast]);

  const getIntentColor = (intent: number) => {
    if (intent >= 85) return "bg-primary text-primary-foreground";
    if (intent >= 70) return "bg-emerald-500 text-white";
    return "bg-muted text-muted-foreground";
  };

  return (
    <div className="p-4 md:p-8 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Monitor Stream</h1>
            <p className="text-sm text-muted-foreground">Real-time conversation feed</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="w-full sm:w-auto">
            <Filter className="mr-2 h-4 w-4" />
            {showFilters ? "Hide" : "Filters"}
          </Button>
        </div>

        {/* Search Bar */}
        <Card className="p-3 md:p-4 bg-card">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search threads..." className="pl-10" />
            </div>
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-full md:w-32"><SelectValue placeholder="Platform" /></SelectTrigger>
                <SelectContent><SelectItem value="all">All</SelectItem></SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* ================= ERROR STATE ================= */}
        {error && (
            <Card className="p-8 border-destructive/50 bg-destructive/5 flex flex-col items-center text-center gap-4">
                <AlertCircle className="w-12 h-12 text-destructive" />
                <div className="space-y-2">
                    <h3 className="text-lg font-bold">Failed to fetch posts</h3>
                    <p className="text-sm text-muted-foreground max-w-md">{error}</p>
                </div>
                <Button onClick={() => window.location.reload()} variant="outline">Retry Connection</Button>
            </Card>
        )}

        {/* ================= MOBILE LIST VIEW (Visible only on Mobile) ================= */}
        {!error && (
            <div className="grid grid-cols-1 gap-4 md:hidden">
            {loading ? (
                <div className="text-center py-20 text-muted-foreground">Loading feed...</div>
            ) : threads.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">No threads found.</div>
            ) : (
                threads.map((t) => (
                <Card 
                    key={t.id} 
                    className="p-4 space-y-4 border-l-4 border-l-primary active:scale-[0.98] transition-transform"
                    onClick={() => setSelected(t)}
                >
                    <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-1">
                        <Badge variant="secondary" className="w-fit text-[10px]">{t.platform}</Badge>
                        <div className="flex items-center text-[10px] text-muted-foreground">
                        <Clock className="w-3 h-3 mr-1" /> {t.timestamp}
                        </div>
                    </div>
                    <Badge className={`${getIntentColor(t.intent)} text-xs`}>
                        {t.intent}% Intent
                    </Badge>
                    </div>

                    <div className="space-y-2">
                    <div className="flex items-center gap-2 font-semibold text-sm">
                        <User className="w-4 h-4 text-primary" /> {t.user}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed italic">
                        "{t.content}"
                    </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                    <Badge variant={t.replyStatus === "Sent" ? "default" : "outline"} className={t.replyStatus === "Sent" ? "bg-green-600" : ""}>
                        {t.replyStatus}
                    </Badge>
                    <div className="flex gap-2">
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); window.open(t.url || '#') }}>
                        <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button size="icon" className="h-8 w-8">
                        <Sparkles className="h-4 w-4" />
                        </Button>
                    </div>
                    </div>
                </Card>
                ))
            )}
            </div>
        )}

        {/* ================= DESKTOP TABLE VIEW (Hidden on Mobile) ================= */}
        {!error && (
            <div className="hidden md:block">
            <Card className="overflow-hidden border-border">
                <Table>
                <TableHeader className="bg-muted/50">
                    <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Comment</TableHead>
                    <TableHead>Intent</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                         <TableRow><TableCell colSpan={6} className="text-center py-10">Loading...</TableCell></TableRow>
                    ) : threads.map((t) => (
                    <TableRow key={t.id} className="cursor-pointer hover:bg-muted/30" onClick={() => setSelected(t)}>
                        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{t.timestamp}</TableCell>
                        <TableCell><Badge variant="secondary">{t.platform}</Badge></TableCell>
                        <TableCell className="font-medium text-sm">{t.user}</TableCell>
                        <TableCell className="max-w-md truncate text-sm">{t.content}</TableCell>
                        <TableCell><Badge className={getIntentColor(t.intent)}>{t.intent}</Badge></TableCell>
                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-end gap-1">
                            <Button size="sm" variant="ghost" onClick={() => window.open(t.url || '#')}><ExternalLink className="h-3 w-3" /></Button>
                            <Button size="sm" onClick={() => setSelected(t)}><Sparkles className="h-3 w-3" /></Button>
                        </div>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </Card>
            </div>
        )}
      </div>

      {/* DETAIL DRAWER / MODAL */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative w-full md:w-[500px] lg:w-[40%] h-[95vh] md:h-[90vh] bg-card rounded-t-2xl md:rounded-xl shadow-2xl overflow-hidden">
              <DetailPane
                comment={{
                  id: String(selected.id),
                  platform: selected.platform,
                  user: selected.user,
                  followers: selected.engagement.likes,
                  timestamp: selected.timestamp,
                  content: selected.content,
                  intent: selected.intent,
                  sentiment: selected.sentiment,
                  keywords: selected.keywords,
                  replyStatus: selected.replyStatus,
                }}
                onClose={() => setSelected(null)}
                onSend={(id) => {
                  setThreads(prev => prev.map(t => t.id === Number(id) ? { ...t, replyStatus: "Sent" } : t));
                  setSelected(null);
                  toast({ title: "Reply Sent", description: "Your response has been recorded." });
                }}
              />
          </div>
        </div>
      )}
    </div>
  );
};

export default MonitorStream;