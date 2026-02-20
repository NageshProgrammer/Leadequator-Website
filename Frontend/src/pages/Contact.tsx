import { useState } from "react";
// import { useNavigate } from "react-router-dom"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail, MessageSquare, Calendar } from "lucide-react";
import { ScrollProgress } from "@/components/ui/scroll-progress";

const Contact = () => {
  // const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    role: "",
    interest: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    
    if (!apiUrl) {
      alert("❌ Configuration Error: VITE_API_BASE_URL is missing in .env file");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to send message");

      alert("✅ Message sent successfully! We will contact you soon.");

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        company: "",
        role: "",
        interest: "",
        message: "",
      });
    } catch (err) {
      console.error(err);
      alert("❌ Submission failed. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Reusable classes for form inputs to ensure they match the glass theme perfectly
  const inputStyles = "bg-white/[0.03] border-white/[0.08] text-white focus-visible:ring-[#fbbf24]/30 focus-visible:border-[#fbbf24]/50 rounded-xl h-12";
  const labelStyles = "text-zinc-300 font-medium mb-2 block";

  return (
    <div className="min-h-screen pt-24 pb-20 text-white selection:bg-[#fbbf24]/30 relative z-10 overflow-hidden">
      <ScrollProgress className="top-[65px]" />
      
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#fbbf24]/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.1] text-[#fbbf24] font-bold tracking-widest text-xs uppercase mb-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
            Contact Support
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">
            Let's <span className="text-[#fbbf24] drop-shadow-[0_0_15px_rgba(251,191,36,0.3)]">Talk</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed">
            Whether you need a demo or have questions, we're here to help.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
          
          {/* Left Cards */}
          <div className="space-y-6">
            <div className="p-8 bg-[#050505]/20 backdrop-blur-xl border border-white/[0.05] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] rounded-[2rem] hover:border-white/[0.15] hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center mb-6 group-hover:bg-[#fbbf24]/10 transition-colors">
                <Calendar className="w-7 h-7 text-[#fbbf24]" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-zinc-100 group-hover:text-white">Schedule Demo</h3>
              <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                Demo requests are handled internally. Please submit the form and
                our team will coordinate the schedule.
              </p>
              <Button
                className="w-full bg-[#fbbf24] text-black hover:bg-[#fbbf24]/90 font-bold rounded-xl h-11 shadow-[0_0_15px_rgba(251,191,36,0.15)] hover:shadow-[0_0_25px_rgba(251,191,36,0.3)] transition-all"
                onClick={() =>
                  document
                    .getElementById("contact-form")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Request Demo
              </Button>
            </div>

            <div className="p-8 bg-[#050505]/20 backdrop-blur-xl border border-white/[0.05] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] rounded-[2rem] hover:border-white/[0.15] hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center mb-6 group-hover:bg-[#fbbf24]/10 transition-colors">
                <MessageSquare className="w-7 h-7 text-[#fbbf24]" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-zinc-100 group-hover:text-white">Live Chat</h3>
              <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                Real-time chat support is coming soon. For now, you can reach us
                via the contact form.
              </p>
              <Button
                variant="outline"
                className="w-full bg-white/[0.03] border-white/[0.1] text-white hover:bg-white/[0.08] hover:text-[#fbbf24] font-semibold rounded-xl h-11 transition-all"
                onClick={() =>
                  alert(
                    "🚀 Live chat coming soon! Please use the contact form for now."
                  )
                }
              >
                Start Chat
              </Button>
            </div>

            <div className="p-8 bg-[#050505]/20 backdrop-blur-xl border border-white/[0.05] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] rounded-[2rem] hover:border-white/[0.15] hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center mb-6 group-hover:bg-[#fbbf24]/10 transition-colors">
                <Mail className="w-7 h-7 text-[#fbbf24]" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-zinc-100 group-hover:text-white">Email Us</h3>
              <a
                href="mailto:leadequatorofficial@gmail.com"
                className="text-zinc-400 hover:text-[#fbbf24] transition-colors font-medium break-all"
              >
                leadequatorofficial@gmail.com
              </a>
            </div>
          </div>

          {/* Form */}
          <div 
            id="contact-form"
            className="lg:col-span-2 p-8 md:p-12 bg-[#050505]/20 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8px_30px_rgb(0,0,0,0.2),inset_0_1px_0_0_rgba(255,255,255,0.05)] rounded-[2.5rem]"
          >
            <h2 className="text-3xl font-bold mb-8 text-white">Send Us a Message</h2>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="firstName" className={labelStyles}>First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    placeholder="John"
                    className={inputStyles}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className={labelStyles}>Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    placeholder="Doe"
                    className={inputStyles}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className={labelStyles}>Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="john@company.com"
                  className={inputStyles}
                />
              </div>

              <div>
                <Label htmlFor="company" className={labelStyles}>Company *</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                  placeholder="Your Company Inc."
                  className={inputStyles}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label className={labelStyles}>Your Role *</Label>
                  <Select
                    onValueChange={(value) => handleSelectChange("role", value)}
                    value={formData.role}
                  >
                    <SelectTrigger className={inputStyles}>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    {/* SelectContent usually inherits global styles, but adding dark mode classes ensures it matches */}
                    <SelectContent className="bg-zinc-950 border-white/[0.1] text-white rounded-xl">
                      <SelectItem value="marketing" className="focus:bg-[#fbbf24]/20 focus:text-[#fbbf24] cursor-pointer">Marketing</SelectItem>
                      <SelectItem value="sales" className="focus:bg-[#fbbf24]/20 focus:text-[#fbbf24] cursor-pointer">Sales</SelectItem>
                      <SelectItem value="executive" className="focus:bg-[#fbbf24]/20 focus:text-[#fbbf24] cursor-pointer">Executive</SelectItem>
                      <SelectItem value="other" className="focus:bg-[#fbbf24]/20 focus:text-[#fbbf24] cursor-pointer">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className={labelStyles}>Interest *</Label>
                  <Select
                    onValueChange={(value) => handleSelectChange("interest", value)}
                    value={formData.interest}
                  >
                    <SelectTrigger className={inputStyles}>
                      <SelectValue placeholder="Select interest" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-950 border-white/[0.1] text-white rounded-xl">
                      <SelectItem value="demo" className="focus:bg-[#fbbf24]/20 focus:text-[#fbbf24] cursor-pointer">Demo</SelectItem>
                      <SelectItem value="enterprise" className="focus:bg-[#fbbf24]/20 focus:text-[#fbbf24] cursor-pointer">Enterprise</SelectItem>
                      <SelectItem value="partnership" className="focus:bg-[#fbbf24]/20 focus:text-[#fbbf24] cursor-pointer">Partnership</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="message" className={labelStyles}>Message</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="How can we help you?"
                  className="bg-white/[0.03] border-white/[0.08] text-white focus-visible:ring-[#fbbf24]/30 focus-visible:border-[#fbbf24]/50 rounded-xl min-h-[150px] resize-none p-4"
                />
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#fbbf24] text-black hover:bg-[#fbbf24]/90 font-bold rounded-xl h-14 text-lg shadow-[0_0_20px_rgba(251,191,36,0.15)] hover:shadow-[0_0_30px_rgba(251,191,36,0.3)] transition-all mt-4"
              >
                {loading ? "Sending..." : "Submit Request"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;