import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface FilterPanelProps {
  onClose?: () => void;
}

export const FilterPanel = ({ onClose }: FilterPanelProps) => {
  return (
    <Card className="p-6 bg-card border-border space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Platform Filter */}
      <div className="space-y-3">
        <Label>Platform</Label>
        <div className="space-y-2">
          {["LinkedIn", "X (Twitter)", "Reddit", "Quora", "YouTube", "Facebook"].map((platform) => (
            <div key={platform} className="flex items-center space-x-2">
              <Checkbox id={platform} />
              <label
                htmlFor={platform}
                className="text-sm text-foreground cursor-pointer"
              >
                {platform}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Intent Score */}
      <div className="space-y-3">
        <Label>Intent Score</Label>
        <div className="space-y-2">
          <Slider defaultValue={[0, 100]} max={100} step={1} />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0</span>
            <span>100</span>
          </div>
        </div>
      </div>

      {/* Followers Threshold */}
      <div className="space-y-3">
        <Label>Min Followers</Label>
        <Input type="number" placeholder="5000" className="bg-background" />
      </div>

      {/* Sentiment */}
      <div className="space-y-3">
        <Label>Sentiment</Label>
        <div className="space-y-2">
          {["Positive", "Neutral", "Negative"].map((sentiment) => (
            <div key={sentiment} className="flex items-center space-x-2">
              <Checkbox id={sentiment} />
              <label
                htmlFor={sentiment}
                className="text-sm text-foreground cursor-pointer"
              >
                {sentiment}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Auto Reply Status */}
      <div className="space-y-3">
        <Label>Reply Status</Label>
        <div className="space-y-2">
          {["Not Sent", "Sent", "Pending", "Failed"].map((status) => (
            <div key={status} className="flex items-center space-x-2">
              <Checkbox id={status} />
              <label
                htmlFor={status}
                className="text-sm text-foreground cursor-pointer"
              >
                {status}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Date Range */}
      <div className="space-y-3">
        <Label>Date Range</Label>
        <div className="space-y-2">
          <Input type="date" className="bg-background" />
          <Input type="date" className="bg-background" />
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button variant="secondary" className="flex-1">
          Reset
        </Button>
        <Button className="flex-1 bg-primary text-primary-foreground">
          Apply
        </Button>
      </div>
    </Card>
  );
};
