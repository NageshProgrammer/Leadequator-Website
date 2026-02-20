import { useState } from "react";
import { Outlet } from "react-router-dom";
import { UserButton, useUser } from "@clerk/clerk-react"; 
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { LayoutDashboard, Radio, Users, FileText, Search, Menu, Home, ArrowUpCircle, Zap, X, UserCog2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { NavLink } from "@/components/NavLink";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

// 👇 IMPORT CONTEXT
import { CreditProvider, useCredits } from "@/context/CreditContext";

// 1. Inner Component (Consumes Context)
const DashboardLayoutContent = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isLoaded } = useUser();
  
  // 👇 USE THE HOOK
  const { credits, loading: loadingCredits } = useCredits();

  // Logic (Example Plan Limit)
  const TOTAL_PLAN_CREDITS = 300; 
  const remainingPercentage = (credits / TOTAL_PLAN_CREDITS) * 100;
  const usedPercentage = 100 - remainingPercentage; 

  // Adjusted colors for dark mode (using your brand yellow)
  const getStatusColor = () => {
    if (remainingPercentage <= 20) return "text-red-500";
    if (remainingPercentage <= 50) return "text-[#fbbf24]";
    return "text-green-500";
  };

  const getBarColor = () => {
    if (remainingPercentage <= 20) return "bg-red-500";
    if (remainingPercentage <= 50) return "bg-[#fbbf24]";
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
    // Replaced standard bg with deep black, keeping it consistent with the site
    <div className="min-h-screen text-white flex overflow-x-hidden selection:bg-[#fbbf24]/30 relative">
      
      {/* Very subtle background glow for the dashboard */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#fbbf24]/[0.03] rounded-full blur-[120px] pointer-events-none" />

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar - Upgraded to Glassmorphism */}
      <aside className={`fixed left-0 top-0 h-screen z-50 bg-black/30 backdrop-blur-3xl border-r border-white/[0.08] shadow-[4px_0_24px_rgba(0,0,0,0.5)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col ${sidebarOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0 lg:w-20"}`}>
        
        <div className="p-5 border-b border-white/[0.08] flex items-center justify-between pb-6 h-20">
          {sidebarOpen && (
            <div className="flex flex-col animate-in fade-in duration-500">
               <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-0.5">Welcome back,</span>
               <h1 className="text-xl font-bold text-white truncate max-w-[150px]" title={user?.fullName || ""}>
                 {isLoaded ? (user?.firstName || "User") : "..."}
               </h1>
            </div>
          )}
          <Button variant="ghost" size="icon" className="lg:flex text-zinc-400 hover:text-white hover:bg-white/[0.05] rounded-xl ml-auto" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          <TooltipProvider delayDuration={0}>
            {navItems.map((item) => (
              <Tooltip key={item.path}>
                <TooltipTrigger asChild>
                  <NavLink 
                    to={item.path} 
                    end={item.path === "/dashboard"} 
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-100 transition-all duration-200 ${!sidebarOpen ? "lg:justify-center" : ""}`} 
                    // Upgraded active state to match amber theme
                    activeClassName="bg-[#fbbf24]/10 text-[#fbbf24] font-semibold border border-[#fbbf24]/20 shadow-[inset_0_1px_0_0_rgba(251,191,36,0.1)] hover:text-[#fbbf24]" 
                    onClick={() => { if (window.innerWidth < 1024) setSidebarOpen(false); }}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {sidebarOpen && <span>{item.label}</span>}
                  </NavLink>
                </TooltipTrigger>
                {!sidebarOpen && <TooltipContent side="right" className="ml-2 bg-black/80   border-white/[0.1] text-white font-medium">{item.label}</TooltipContent>}
              </Tooltip>
            ))}
          </TooltipProvider>
        </nav>

        {/* Bottom Actions */}
        <div className={`p-4 border-t border-white/[0.08] mt-auto flex flex-col gap-6 bg-white/[0.01] ${!sidebarOpen ? "lg:items-center" : ""}`}>
          <Link to="/pricing" className="w-full flex justify-center">
            <Button className={`bg-[#fbbf24]/10 text-[#fbbf24] hover:bg-[#fbbf24] hover:text-black border-dashed border border-[#fbbf24]/30 transition-all duration-300 rounded-xl ${sidebarOpen ? "w-full justify-start gap-3 h-11" : "h-11 w-11 p-0 justify-center rounded-2xl"}`}>
              <ArrowUpCircle className="h-5 w-5 flex-shrink-0" />
              {sidebarOpen && <span className="font-bold tracking-wide">Upgrade Plan</span>}
            </Button>
          </Link>

          <div className={`w-full flex flex-col items-center ${sidebarOpen ? "px-1" : ""}`}>
            {sidebarOpen ? (
              <div className="w-full space-y-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-400 font-medium flex items-center gap-1.5">
                    <Zap className={`h-3.5 w-3.5 fill-current ${getStatusColor()}`} /> Credits
                  </span>
                  <span className={`font-bold ${getStatusColor()} drop-shadow-md`}>
                    {loadingCredits ? "..." : Math.round(remainingPercentage)}%
                  </span>
                </div>
                {/* Visualizing Used % vs Remaining */}
                <Progress value={loadingCredits ? 0 : usedPercentage} className={`h-2 bg-white/[0.05] border border-white/[0.02] [&>div]:${getBarColor()} [&>div]:shadow-[0_0_10px_currentColor]`} />
                <div className="text-[10px] text-zinc-500 font-medium text-right tracking-wide">{credits} / {TOTAL_PLAN_CREDITS} remaining</div>
              </div>
            ) : (
              <div className="relative h-11 w-11 flex items-center justify-center">
                <svg className="h-full w-full transform -rotate-90">
                  <circle cx="22" cy="22" r="18" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-white/[0.05]" />
                  <circle cx="22" cy="22" r="18" stroke="currentColor" strokeWidth="3" fill="transparent" strokeDasharray={113} strokeDashoffset={113 - ((loadingCredits ? 0 : remainingPercentage) / 100 * 113)} strokeLinecap="round" className={`transition-all duration-500 ${getStatusColor()}`} />
                </svg>
                <Zap className={`absolute h-3.5 w-3.5 fill-current ${getStatusColor()}`} />
              </div>
            )}
          </div>

          <div className={`flex items-center w-full mt-2 ${sidebarOpen ? "gap-3 px-2 bg-white/[0.03] p-2 rounded-xl border border-white/[0.05]" : "justify-center"}`}>
            <UserButton afterSignOutUrl="/" appearance={{ elements: { userButtonAvatarBox: "h-9 w-9 shadow-md" } }} />
            {sidebarOpen && (
              <div className="flex flex-col overflow-hidden">
                <p className="text-sm font-bold text-white truncate">{user?.fullName || "My Account"}</p>
                <p className="text-[11px] text-zinc-400 truncate tracking-wide">{user?.primaryEmailAddress?.emailAddress || "Manage Settings"}</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 min-w-0 ${sidebarOpen ? "lg:ml-64" : "lg:ml-20"} relative z-10`}>
        
        {/* Header - Glassmorphism */}
        <header className=" backdrop-blur-2xl border-b border-white/[0.08] px-4 lg:px-8 py-4 h-20 flex items-center flex-shrink-0 sticky top-0 z-30">
          <div className="flex items-center justify-between gap-4 w-full">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="lg:hidden text-zinc-400 hover:text-white hover:bg-white/[0.05] rounded-xl" onClick={() => setSidebarOpen(true)}>
                <Menu className="h-5 w-5" />
              </Button>
              <h2 className="text-xl font-bold tracking-tight hidden sm:flex items-center gap-1">
                <span className="text-white">Lead</span><span className="text-[#fbbf24]">equator</span>
              </h2>
              <Badge variant="outline" className="bg-[#fbbf24]/10 text-[#fbbf24] border-[#fbbf24]/20 shadow-[inset_0_1px_0_0_rgba(251,191,36,0.1)] ml-2 tracking-widest uppercase text-[10px] font-bold">
                Pilot
              </Badge>
            </div>
            
            <div className="flex items-center gap-4 flex-1 max-w-xl justify-end">
              <div className="relative flex-1 hidden md:block">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
                <Input 
                  placeholder="Search comments..." 
                  className="pl-10 bg-white/[0.03] border-white/[0.08] text-white focus-visible:ring-[#fbbf24]/30 focus-visible:border-[#fbbf24]/50 rounded-xl h-10 transition-all placeholder:text-zinc-600" 
                />
              </div>
              <Select defaultValue="utc">
                <SelectTrigger className="w-[100px] md:w-[120px] bg-white/[0.03] border-white/[0.08] text-white focus:ring-[#fbbf24]/30 rounded-xl h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black/20 border-white/[0.1] text-white rounded-xl">
                  <SelectItem value="utc" className="focus:bg-[#fbbf24]/20 focus:text-[#fbbf24] cursor-pointer">UTC</SelectItem>
                  <SelectItem value="pst" className="focus:bg-[#fbbf24]/20 focus:text-[#fbbf24] cursor-pointer">PST</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </header>

        {/* Dynamic Outlet Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar">
          <Outlet />
        </main>
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