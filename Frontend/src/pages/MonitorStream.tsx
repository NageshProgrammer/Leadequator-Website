import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, Filter } from "lucide-react";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { DetailPane } from "@/components/dashboard/DetailPane";
import { useLeads } from "@/hooks/useLeads";

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/api/lead-discovery`;

const MonitorStream = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const { leads, loading, refresh } = useLeads();

  const [running, setRunning] = useState(false);
  const [selected, setSelected] = useState<any>(null);

  const runScraper = async () => {
    if (!user?.id) return;

    try {
      setRunning(true);

      const response = await fetch(`${API_BASE}/quora/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });

      if (!response.ok) throw new Error("Scraper failed");

      toast({
        title: "Scraping Started 🚀",
        description: "Fetching new conversations...",
      });

      await refresh();

    } catch {
      toast({
        title: "Scraper Failed",
        description: "Check backend connection.",
        variant: "destructive",
      });
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="p-8 bg-background min-h-screen space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Monitor Stream</h1>
        <div className="flex gap-3">
          <Button
            onClick={runScraper}
            disabled={running}
            className="bg-yellow-400 hover:bg-yellow-500 text-black"
          >
            {running && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Run Scraper
          </Button>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Intent</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              leads.map((lead) => (
                <TableRow key={lead._id}>
                  <TableCell>
                    {new Date(lead.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge>{lead.platform}</Badge>
                  </TableCell>
                  <TableCell>{lead.name}</TableCell>
                  <TableCell>{lead.intent}</TableCell>
                  <TableCell>{lead.status}</TableCell>
                  <TableCell>
                    <Button size="sm" onClick={() => setSelected(lead)}>
                      <Sparkles className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {selected && (
        <DetailPane
          comment={selected}
          onClose={() => setSelected(null)}
          onSend={() => refresh()}
        />
      )}
    </div>
  );
};

export default MonitorStream;
