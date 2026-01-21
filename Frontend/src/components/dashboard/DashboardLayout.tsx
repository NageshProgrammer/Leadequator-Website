import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { UserButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Zap,
  FileText,
  Settings,
  Search,
  Menu,
  Home,
  ArrowUpCircle, // Added icon for Upgrade
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { NavLink } from "@/components/NavLink";

export const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
        <div className="p-4 border-b border-border flex items-center justify-between">
          {sidebarOpen && (
            <h1 className="text-xl font-bold text-foreground">Leadequator</h1>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/dashboard"}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted/50 transition-colors"
              activeClassName="bg-muted text-primary font-medium"
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Section (Upgrade + UserButton) */}
        <div className="p-4 border-t border-border mt-auto space-y-4">
          
          {/* Upgrade Button */}
          <Link to="/pricing" className="block">
            <Button 
              variant="default" 
              className={`w-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground border-dashed border border-primary/50 transition-all ${
                !sidebarOpen ? "px-0 justify-center" : "justify-start gap-3"
              }`}
            >
              <ArrowUpCircle className="h-5 w-5 flex-shrink-0" />
              {sidebarOpen && <span className="font-semibold">Upgrade Plan</span>}
            </Button>
          </Link>

          {/* User Button Profile */}
          <div className={`flex items-center ${sidebarOpen ? "gap-3 px-2" : "justify-center"}`}>
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
        {/* Top Bar */}
        <header className="bg-card border-b border-border px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-foreground">Lead Equator</h2>
              <Badge variant="secondary" className="bg-primary/20 text-primary">
                Pilot
              </Badge>
            </div>

            <div className="flex items-center gap-4 flex-1 max-w-2xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search comments, leads, keywords..."
                  className="pl-10 bg-background"
                />
              </div>

              <Select defaultValue="utc">
                <SelectTrigger className="w-32 bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="utc">UTC</SelectItem>
                  <SelectItem value="pst">PST</SelectItem>
                  <SelectItem value="est">EST</SelectItem>
                  <SelectItem value="cet">CET</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-visible">
          <Outlet />
        </main>
      </div>
    </div>
  );
};