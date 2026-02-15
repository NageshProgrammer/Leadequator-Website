import { useState } from "react";
import { Outlet } from "react-router-dom";
import { UserButton, useUser } from "@clerk/clerk-react"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { LayoutDashboard, Radio, Users, FileText, Search, Menu, Home, ArrowUpCircle, Zap, X, UserCog2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { NavLink } from "@/components/NavLink";
import { Link } from "react-router-dom";

// 👇 IMPORT CONTEXT
import { CreditProvider, useCredits } from "@/context/CreditContext";

// 1. Inner Component (Consumes Context)
const DashboardLayoutContent = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isLoaded } = useUser();
  
  // 👇 USE THE HOOK
  const { credits, loading: loadingCredits } = useCredits();

  // Logic
  const TOTAL_PLAN_CREDITS = 1000; 
  const remainingPercentage = (credits / TOTAL_PLAN_CREDITS) * 100;
  const usedPercentage = 100 - remainingPercentage;

  const getStatusColor = () => {
    if (remainingPercentage <= 20) return "text-red-500";
    if (remainingPercentage <= 50) return "text-yellow-500";
    return "text-green-500";
  };

  const getBarColor = () => {
    if (remainingPercentage <= 20) return "bg-red-500";
    if (remainingPercentage <= 50) return "bg-yellow-500";
    return "bg-green-500";
  };

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: LayoutDashboard, label: "Overview", path: "/dashboard" },
    { icon: Radio, label: "Monitor Stream", path: "/monitor-stream" },
    { icon: Users, label: "Leads & Tracking", path: "/leads-pipeline" },
    { icon: FileText, label: "Reports", path: "/reports" },
    { icon: UserCog2, label: "User Profile", path: "/user-profile" },
  ];

  return (
    <div className="min-h-screen bg-background flex overflow-x-hidden">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed left-0 top-0 h-screen z-50 bg-card border-r border-border transition-transform duration-300 ease-in-out flex flex-col ${sidebarOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0 lg:w-20"}`}>
        <div className="p-4 border-b border-border flex items-center justify-between pb-6">
          {sidebarOpen && (
            <div className="flex flex-col">
               <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Welcome back,</span>
               <h1 className="text-2xl font-bold text-amber-400 truncate max-w-[180px]" title={user?.fullName || ""}>
                 {isLoaded ? (user?.firstName || "User") : "..."}
               </h1>
            </div>
          )}
          <Button variant="ghost" size="sm" className="lg:flex" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <TooltipProvider delayDuration={0}>
            {navItems.map((item) => (
              <Tooltip key={item.path}>
                <TooltipTrigger asChild>
                  <NavLink to={item.path} end={item.path === "/dashboard"} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted/50 transition-colors ${!sidebarOpen ? "lg:justify-center" : ""}`} activeClassName="bg-muted text-primary font-medium" onClick={() => { if (window.innerWidth < 1024) setSidebarOpen(false); }}>
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {sidebarOpen && <span>{item.label}</span>}
                  </NavLink>
                </TooltipTrigger>
                {!sidebarOpen && <TooltipContent side="right" className="ml-2 font-medium">{item.label}</TooltipContent>}
              </Tooltip>
            ))}
          </TooltipProvider>
        </nav>

        <div className={`p-4 border-t border-border mt-auto flex flex-col gap-6 ${!sidebarOpen ? "lg:items-center" : ""}`}>
          <Link to="/pricings" className="w-full flex justify-center">
            <Button variant="default" className={`bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground border-dashed border border-primary/50 transition-all ${sidebarOpen ? "w-full justify-start gap-3" : "h-10 w-10 p-0 justify-center rounded-full"}`}>
              <ArrowUpCircle className="h-5 w-5 flex-shrink-0" />
              {sidebarOpen && <span className="font-semibold">Upgrade Plan</span>}
            </Button>
          </Link>

          <div className={`w-full flex flex-col items-center ${sidebarOpen ? "px-2" : ""}`}>
            {sidebarOpen ? (
              <div className="w-full space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground font-medium flex items-center gap-1">
                    <Zap className={`h-3 w-3 fill-current ${getStatusColor()}`} /> Credits
                  </span>
                  <span className={`font-bold ${getStatusColor()}`}>
                    {loadingCredits ? "..." : Math.round(remainingPercentage)}%
                  </span>
                </div>
                <Progress value={loadingCredits ? 0 : usedPercentage} className={`h-1.5 bg-muted [&>div]:${getBarColor()}`} />
                <div className="text-[10px] text-muted-foreground text-right">{credits} / {TOTAL_PLAN_CREDITS} remaining</div>
              </div>
            ) : (
              <div className="relative h-10 w-10 flex items-center justify-center">
                <svg className="h-full w-full transform -rotate-90">
                  <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-muted/20" />
                  <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="3" fill="transparent" strokeDasharray={100} strokeDashoffset={100 - (loadingCredits ? 0 : remainingPercentage)} strokeLinecap="round" className={`transition-all duration-500 ${getStatusColor()}`} />
                </svg>
                <Zap className={`absolute h-3 w-3 fill-current ${getStatusColor()}`} />
              </div>
            )}
          </div>

          <div className={`flex items-center w-full ${sidebarOpen ? "gap-3 px-2" : "justify-center"}`}>
            <UserButton afterSignOutUrl="/" appearance={{ elements: { userButtonAvatarBox: "h-9 w-9" } }} />
            {sidebarOpen && (
              <div className="flex flex-col overflow-hidden">
                <p className="text-sm font-medium text-foreground truncate">{user?.fullName || "My Account"}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.primaryEmailAddress?.emailAddress || "Manage Settings"}</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      <div className={`flex-1 flex flex-col transition-all duration-300 min-w-0 ${sidebarOpen ? "lg:ml-64" : "lg:ml-20"}`}>
        <header className="bg-card border-b border-border px-4 lg:px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}><Menu className="h-5 w-5" /></Button>
              <h2 className="text-lg font-semibold text-foreground sm:block">LEADEQUATOR</h2>
              <Badge variant="secondary" className="bg-primary/20 text-primary">Pilot</Badge>
            </div>
            <div className="flex items-center gap-4 flex-1 max-w-2xl justify-end">
              <div className="relative flex-1 hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input placeholder="Search comments..." className="pl-10 bg-background" />
              </div>
              <Select defaultValue="utc">
                <SelectTrigger className="w-24 md:w-32 bg-background"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="utc">UTC</SelectItem>
                  <SelectItem value="pst">PST.</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-6"><Outlet /></main>
      </div>
    </div>
  );
};

// 2. Export the Wrapped Component
export const DashboardLayout = () => {
  return (
    <CreditProvider>
      <DashboardLayoutContent />
    </CreditProvider>
  );
};