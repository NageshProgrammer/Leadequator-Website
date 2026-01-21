import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { UserButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LayoutDashboard,
  Radio,
  Clock,
  Users,
  FileText,
  Settings,
  Search,
  Menu,
  Home,
  ArrowUpCircle,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { NavLink } from "@/components/NavLink";

export const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Mock Data
  const creditsUsed = 800; 
  const totalCredits = 1000;
  
  // 1. Calculate Remaining Percentage
  const creditPercentageUsed = (creditsUsed / totalCredits) * 100;
  const remainingPercentage = 100 - creditPercentageUsed;

  // 2. Determine Color State
  const getStatusColor = () => {
    if (remainingPercentage <= 20) return "text-red-500";
    if (remainingPercentage <= 50) return "text-yellow-500";
    return "text-green-500"; // Changed to green for explicit "good" state, or use text-primary
  };

  const getBarColor = () => {
    if (remainingPercentage <= 20) return "bg-red-500";
    if (remainingPercentage <= 50) return "bg-yellow-500";
    return "bg-green-500"; // Or bg-primary
  };

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: LayoutDashboard, label: "Overview", path: "/dashboard" },
    { icon: Radio, label: "Monitor Stream", path: "/monitor-stream" },
    { icon: Clock, label: "Comment Timeline", path: "/comment-timeline" },
    { icon: Users, label: "Leads & Tracking", path: "/leads-pipeline" },
    { icon: FileText, label: "Reports", path: "/reports" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <div className="min-h-screen bg-background flex overflow-x-visible overflow-y-hidden">
      {/* ================= SIDEBAR ================= */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-card border-r border-border transition-all duration-300
        fixed left-0 top-0 h-screen z-40 flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-border flex items-center justify-between pb-6">
          {sidebarOpen && (
            <h1 className="text-xl font-bold text-foreground hover:cursor-default">Leadequator</h1>
          )}
          <Button
            variant="ghost"
            size="sm"
            className={!sidebarOpen ? "mx-auto" : ""}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-4 w-4 " />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/dashboard"}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted/50 transition-colors ${
                !sidebarOpen ? "justify-center" : ""
              }`}
              activeClassName="bg-muted text-primary font-medium"
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className={`p-4 border-t border-border mt-auto flex flex-col gap-6 ${!sidebarOpen ? "items-center" : ""}`}>
          
          {/* Upgrade Button */}
          <Link to="/pricings" className="w-full flex justify-center">
            <Button 
              variant="default" 
              className={`bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground border-dashed border border-primary/50 transition-all ${
                sidebarOpen ? "w-full justify-start gap-3" : "h-10 w-10 p-0 justify-center rounded-full"
              }`}
            >
              <ArrowUpCircle className="h-5 w-5 flex-shrink-0" />
              {sidebarOpen && <span className="font-semibold">Upgrade Plan</span>}
            </Button>
          </Link>

          {/* Credits Progress Section */}
          <div className={`w-full flex flex-col items-center ${sidebarOpen ? "px-2" : ""}`}>
            {sidebarOpen ? (
              <div className="w-full space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground font-medium flex items-center gap-1">
                    <Zap className={`h-3 w-3 fill-current ${getStatusColor()}`} /> Credits
                  </span>
                  <span className={`font-bold ${getStatusColor()}`}>
                    {Math.round(remainingPercentage)}% remaining
                  </span>
                </div>
                {/* Logic Fix: value is now remainingPercentage 
                   Color Fix: [&>div]:bg-... overrides the default inner bar color
                */}
                <Progress 
                  value={creditPercentageUsed} 
                  className={`h-1.5 bg-muted [&>div]:${getBarColor()}`} 
                />
                <p className="text-[10px] text-muted-foreground text-right">
                  {creditsUsed} / {totalCredits} used
                </p>
              </div>
            ) : (
              /* Circular Progress Bar for Collapsed State */
              <div className="relative h-10 w-10 flex items-center justify-center" title={`${Math.round(remainingPercentage)}% remaining`}>
                <svg className="h-full w-full transform -rotate-90">
                  {/* Background Circle */}
                  <circle
                    cx="20"
                    cy="20"
                    r="16"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="transparent"
                    className="text-muted/20"
                  />
                  {/* Foreground Circle (Dynamic Color) */}
                  <circle
                    cx="20"
                    cy="20"
                    r="16"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="transparent"
                    strokeDasharray={100}
                    // Logic Fix: This makes the line shrink as percentage decreases
                    strokeDashoffset={100 - remainingPercentage} 
                    strokeLinecap="round"
                    className={`transition-all duration-500 ${getStatusColor()}`}
                  />
                </svg>
                <Zap className={`absolute h-3 w-3 fill-current ${getStatusColor()}`} />
              </div>
            )}
          </div>

          {/* User Button Profile */}
          <div className={`flex items-center w-full ${sidebarOpen ? "gap-3 px-2" : "justify-center"}`}>
            <UserButton 
              afterSignOutUrl="/" 
              appearance={{
                elements: {
                  userButtonAvatarBox: "h-9 w-9"
                }
              }}
            />
            {sidebarOpen && (
              <div className="flex flex-col overflow-hidden">
                <p className="text-sm font-medium text-foreground truncate">My Account</p>
                <p className="text-xs text-muted-foreground truncate">Manage Settings</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        <header className="bg-card border-b border-border px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-foreground hover:cursor-default">Lead Equator</h2>
              <Badge variant="secondary" className="bg-primary/20 text-primary hover:cursor-default">
                Pilot
              </Badge>
            </div>
            
            <div className="flex items-center gap-4 flex-1 max-w-2xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input placeholder="Search comments..." className="pl-10 bg-background" />
              </div>
              <Select defaultValue="utc">
                <SelectTrigger className="w-32 bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="utc">UTC</SelectItem>
                  <SelectItem value="pst">PST</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto overflow-x-visible p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};