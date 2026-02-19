import { useEffect, useState, useRef } from "react";
import { useUser } from "@clerk/clerk-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {
  Webhook,
  Database,
  Mail,
  MessageSquare,
  Settings2,
  Lock,
  User,
  Upload,
  Globe,
  Briefcase,
  Target,
  Loader2,
  X,
  Trash2,
  RefreshCcw
} from "lucide-react";

// ==========================================
// 🔧 API CONFIGURATION
// ==========================================
const API_BASE = import.meta.env.MODE === "development" 
  ? "http://localhost:5000" 
  : "https://api.leadequator.live"; 

const SettingsIntegrations = () => {
  const { user: clerkUser } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Image State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Local state for the keyword input field
  const [keywordInput, setKeywordInput] = useState("");

  // Form State - UPDATED TO MATCH NEW SCHEMA
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    // Company Details
    companyName: "",
    businessEmail: "",
    phone: "",
    industry: "",
    website: "",
    services: "", 
    // Target Market
    targetAudience: "",
    targetCountry: "",
    targetStateCity: "",
    businessType: "B2B",
    // Keywords & Platforms
    keywords: [] as string[],
    platforms: {
      quora: false,
      reddit: false,
      twitter: false, 
      linkedin: false,
      facebook: false,
      youtube: false
    }
  });

  // ==========================================
  // 1. FETCH DATA ON LOAD
  // ==========================================
  useEffect(() => {
    if (!clerkUser?.id) return;

    setImagePreview(clerkUser.imageUrl);

    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/settings/profile?userId=${clerkUser.id}`);
        if (!res.ok) throw new Error("Failed to fetch profile");

        const data = await res.json();
        
        if (data) {
          setProfileData({
            name: data.user?.name || clerkUser.fullName || "",
            email: data.user?.email || clerkUser.primaryEmailAddress?.emailAddress || "",
            
            companyName: data.company?.companyName || "",
            businessEmail: data.company?.businessEmail || "",
            phone: data.company?.phoneNumber || "",
            industry: data.company?.industry || "",
            website: data.company?.websiteUrl || "",
            services: data.company?.productDescription || "",

            targetAudience: data.targetMarket?.targetAudience || "",
            targetCountry: data.targetMarket?.targetCountry || "",
            targetStateCity: data.targetMarket?.targetStateCity || "",
            businessType: data.targetMarket?.businessType || "B2B",
            
            keywords: data.keywords || [],
            platforms: {
              quora: data.platforms?.quora ?? false,
              reddit: data.platforms?.reddit ?? false,
              twitter: data.platforms?.twitter ?? false,
              linkedin: data.platforms?.linkedin ?? false,
              facebook: data.platforms?.facebook ?? false,
              youtube: data.platforms?.youtube ?? false,
            }
          });
        }
      } catch (error) {
        console.error("Error loading settings:", error);
        toast.error("Could not load profile data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [clerkUser]);

  // ==========================================
  // 2. IMAGE HANDLERS
  // ==========================================
  const handleImageClick = () => fileInputRef.current?.click();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size too large (max 5MB)");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  // ==========================================
  // 3. KEYWORD LOGIC
  // ==========================================
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmed = keywordInput.trim();
      if (trimmed && !profileData.keywords.includes(trimmed)) {
        setProfileData(prev => ({
          ...prev,
          keywords: [...prev.keywords, trimmed]
        }));
        setKeywordInput(""); 
      }
    }
  };

  const removeKeyword = (keywordToRemove: string) => {
    setProfileData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keywordToRemove)
    }));
  };

  // ==========================================
  // 4. SAVE DATA
  // ==========================================
  const handleSave = async () => {
    if (!clerkUser?.id) return;
    setIsSaving(true);

    try {
      if (imageFile) {
        await clerkUser.setProfileImage({ file: imageFile });
      }

      // MATCHES NEW SCHEMA & DB ARCHITECTURE
      const payload = {
        userId: clerkUser.id,
        userData: { name: profileData.name },
        companyData: {
          companyName: profileData.companyName || profileData.name + "'s Company",
          businessEmail: profileData.businessEmail,
          phoneNumber: profileData.phone,
          industry: profileData.industry,
          websiteUrl: profileData.website,
          productDescription: profileData.services
        },
        targetData: {
          targetAudience: profileData.targetAudience,
          targetCountry: profileData.targetCountry,
          targetStateCity: profileData.targetStateCity,
          businessType: profileData.businessType
        },
        platformsData: profileData.platforms,
        keywords: profileData.keywords 
      };

      const res = await fetch(`${API_BASE}/api/settings/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("Profile and settings updated successfully!");
      } else {
        throw new Error("Failed to update database");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const integrations = [
    { name: "HubSpot CRM", icon: Database, status: "Connected", description: "Sync leads and contacts automatically" },
    { name: "Slack", icon: MessageSquare, status: "Connected", description: "Real-time alerts for high-intent comments" },
    { name: "Webhook", icon: Webhook, status: "Configured", description: "Custom event streaming to your endpoint" },
    { name: "Email Notifications", icon: Mail, status: "Active", description: "Daily summaries and weekly reports" },
  ];

  if (isLoading) {
      return <div className="min-h-screen flex items-center justify-center text-[#FFD700]"><Loader2 className="animate-spin h-8 w-8" /></div>;
  }

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 bg-background min-h-screen text-zinc-100">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2 text-white">
          <Settings2 className="h-6 w-6 text-[#FFD700]" />
          User Profile <span className="text-[#FFD700]">&</span> Settings
        </h1>
        <p className="text-sm md:text-base text-zinc-400">
          Manage your profile, company details, target market, and system configurations.
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <div className="overflow-x-auto pb-2 scrollbar-hide">
          <TabsList className="flex w-max md:w-full md:grid md:grid-cols-5 bg-zinc-900/50 p-1 border border-zinc-800">
            <TabsTrigger value="profile" className="px-6 md:px-0 data-[state=active]:bg-[#FFD700] data-[state=active]:text-black font-medium">Profile & Business</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="profile" className="space-y-6 mt-4 md:mt-8">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                
                {/* Left Column: User, Company, Target Market */}
                <div className="xl:col-span-2 space-y-6">
                    
                    {/* USER PROFILE */}
                    <Card className="p-6 bg-zinc-900/50 border-zinc-800">
                        <h3 className="text-lg font-bold mb-6 text-[#FFD700] flex items-center gap-2">
                            <User className="h-4 w-4" /> User Profile
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-xs text-zinc-400">Your Name</Label>
                                    <Input 
                                        className="bg-black/40 border-zinc-800 focus-visible:ring-[#FFD700]/50" 
                                        value={profileData.name}
                                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs text-zinc-400">Login Email</Label>
                                    <Input 
                                        className="bg-black/40 border-zinc-800 text-zinc-500 cursor-not-allowed" 
                                        value={profileData.email} 
                                        disabled 
                                    />
                                </div>
                                {/* Keywords */}
                        <div className="flex-grow space-y-4">
                            <h3 className="text-lg font-bold mb-2 text-[#FFD700]">Monitor Keywords</h3>
                            <div className="space-y-2">
                                <Input 
                                    className="bg-black/40 border-zinc-800 focus-visible:ring-[#FFD700]/50" 
                                    placeholder="Type keyword & press Enter"
                                    value={keywordInput}
                                    onChange={(e) => setKeywordInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                />
                                <div className="flex flex-wrap gap-2 mt-3 p-4 bg-black/20 rounded-lg min-h-[100px] border border-zinc-800/50 content-start">
                                    {profileData.keywords.length === 0 && (
                                        <span className="text-zinc-600 text-xs self-center w-full text-center">No keywords added yet.</span>
                                    )}
                                    {profileData.keywords.map((keyword, index) => (
                                        <Badge 
                                            key={index} 
                                            variant="secondary" 
                                            className="pl-3 pr-2 py-1 bg-zinc-800 text-zinc-200 hover:bg-zinc-700 border border-zinc-700 flex items-center gap-1 group transition-all"
                                        >
                                            {keyword}
                                            <button 
                                                onClick={() => removeKeyword(keyword)}
                                                className="ml-1 p-0.5 rounded-full hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-colors"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                            </div>
                            <div className="h-full flex flex-col">
                                <Label className="text-xs text-zinc-400 mb-2 block">Profile Photo</Label>
                                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                                <div className="border-2 border-dashed border-zinc-800 rounded-lg flex-grow flex flex-col items-center justify-center bg-black/20 overflow-hidden relative group min-h-[120px]">
                                    {imagePreview ? (
                                      <>
                                        <img src={imagePreview} alt="Profile" className="w-full h-full object-cover opacity-80 group-hover:opacity-40 transition-opacity" />
                                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                          <Button variant="secondary" size="sm" className="bg-[#FFD700] text-black hover:bg-[#FFD700]/80 h-8 text-xs font-bold" onClick={handleImageClick}>
                                            <RefreshCcw className="w-3 h-3 mr-2" /> Replace
                                          </Button>
                                          <Button variant="destructive" size="sm" className="h-8 text-xs bg-red-500/20 text-red-500 hover:bg-red-500/40 border border-red-500/50" onClick={handleRemoveImage}>
                                            <Trash2 className="w-3 h-3 mr-2" /> Remove
                                          </Button>
                                        </div>
                                      </>
                                    ) : (
                                      <div className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-black/40 transition-colors" onClick={handleImageClick}>
                                        <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                            <Upload className="h-5 w-5 text-zinc-400 group-hover:text-[#FFD700]" />
                                        </div>
                                        <span className="text-xs text-zinc-500 font-medium">Upload Photo</span>
                                      </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* COMPANY DETAILS */}
                    <Card className="p-6 bg-zinc-900/50 border-zinc-800">
                        <h3 className="text-lg font-bold mb-6 text-[#FFD700] flex items-center gap-2">
                             <Briefcase className="h-4 w-4" /> Company Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="space-y-2">
                                <Label className="text-xs text-zinc-400">Company Name</Label>
                                <Input 
                                    className="bg-black/40 border-zinc-800 focus-visible:ring-[#FFD700]/50" 
                                    value={profileData.companyName}
                                    onChange={(e) => setProfileData({...profileData, companyName: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs text-zinc-400">Industry</Label>
                                <Input 
                                    className="bg-black/40 border-zinc-800 focus-visible:ring-[#FFD700]/50" 
                                    value={profileData.industry}
                                    onChange={(e) => setProfileData({...profileData, industry: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs text-zinc-400">Business Email</Label>
                                <Input 
                                    className="bg-black/40 border-zinc-800 focus-visible:ring-[#FFD700]/50" 
                                    value={profileData.businessEmail}
                                    onChange={(e) => setProfileData({...profileData, businessEmail: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs text-zinc-400">Phone Number</Label>
                                <Input 
                                    className="bg-black/40 border-zinc-800 focus-visible:ring-[#FFD700]/50" 
                                    value={profileData.phone}
                                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                                />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-xs text-zinc-400">Website</Label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                                    <Input 
                                        className="pl-9 bg-black/40 border-zinc-800 focus-visible:ring-[#FFD700]/50" 
                                        value={profileData.website}
                                        onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs text-zinc-400">Services / Products Description</Label>
                                <Textarea 
                                    className="bg-black/40 border-zinc-800 focus-visible:ring-[#FFD700]/50 min-h-[80px]" 
                                    value={profileData.services}
                                    onChange={(e) => setProfileData({...profileData, services: e.target.value})}
                                />
                            </div>
                        </div>
                    </Card>

                    {/* TARGET MARKET */}
                    <Card className="p-6 bg-zinc-900/50 border-zinc-800">
                        <h3 className="text-lg font-bold mb-6 text-[#FFD700] flex items-center gap-2">
                             <Target className="h-4 w-4" /> Target Market
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="space-y-2">
                                <Label className="text-xs text-zinc-400">Target Audience</Label>
                                <Input 
                                    className="bg-black/40 border-zinc-800 focus-visible:ring-[#FFD700]/50" 
                                    placeholder="e.g. CTOs, Founders, HR Managers"
                                    value={profileData.targetAudience}
                                    onChange={(e) => setProfileData({...profileData, targetAudience: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs text-zinc-400">Business Type</Label>
                                <Select 
                                    value={profileData.businessType} 
                                    onValueChange={(val) => setProfileData({...profileData, businessType: val})}
                                >
                                  <SelectTrigger className="bg-black/40 border-zinc-800 focus-visible:ring-[#FFD700]/50 text-white">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                    <SelectItem value="B2B">B2B (Business to Business)</SelectItem>
                                    <SelectItem value="B2C">B2C (Business to Consumer)</SelectItem>
                                    <SelectItem value="Both">Both B2B & B2C</SelectItem>
                                  </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs text-zinc-400">Country focus</Label>
                                <Input 
                                    className="bg-black/40 border-zinc-800 focus-visible:ring-[#FFD700]/50" 
                                    placeholder="e.g. US, UK, Global"
                                    value={profileData.targetCountry}
                                    onChange={(e) => setProfileData({...profileData, targetCountry: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs text-zinc-400">State / City (Optional)</Label>
                                <Input 
                                    className="bg-black/40 border-zinc-800 focus-visible:ring-[#FFD700]/50" 
                                    value={profileData.targetStateCity}
                                    onChange={(e) => setProfileData({...profileData, targetStateCity: e.target.value})}
                                />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Right Column: Platforms & Keywords */}
                <div className="space-y-6">
                    <Card className="p-6 bg-zinc-900/50 border-zinc-800 flex flex-col h-full justify-between">
                        
                        {/* Platforms */}
                        <div className="mb-8">
                          <h3 className="text-lg font-bold mb-4 text-[#FFD700]">Active Platforms</h3>
                          <p className="text-xs text-zinc-500 mb-4">Select where you want to monitor leads.</p>
                          <div className="space-y-3">
                              {[
                                  { id: "quora", label: "Quora" },
                                  { id: "reddit", label: "Reddit" },
                                  { id: "linkedin", label: "LinkedIn" },
                                  { id: "twitter", label: "Twitter/X" },
                              ].map((platform) => (
                                  <div key={platform.id} className="flex items-center justify-between p-3 rounded-lg border border-zinc-800 bg-black/40">
                                      <span className="text-sm font-medium">{platform.label}</span>
                                      <Switch 
                                          className="data-[state=checked]:bg-[#FFD700]"
                                          checked={profileData.platforms[platform.id as keyof typeof profileData.platforms]}
                                          onCheckedChange={(checked) => 
                                              setProfileData({
                                                  ...profileData, 
                                                  platforms: { ...profileData.platforms, [platform.id]: checked }
                                              })
                                          }
                                      />
                                  </div>
                              ))}
                          </div>
                        </div>
                        
                        

                        {/* Save Button */}
                        <div className="mt-8 pt-6 border-t border-zinc-800">
                             <Button 
                                onClick={handleSave} 
                                disabled={isSaving}
                                className="w-full bg-[#FFD700] text-black hover:bg-[#FFD700]/90 font-bold transition-all h-12"
                            >
                                {isSaving ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                                ) : (
                                    "Save Changes"
                                )}
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsIntegrations;