import { useState } from "react";
// import { useNavigate } from "react-router-dom"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import emailjs from '@emailjs/browser'; // Add this at the top
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

  // 1. Prepare data for EmailJS
  const templateParams = {
    from_name: `${formData.firstName} ${formData.lastName}`,
    from_email: formData.email,
    company: formData.company,
    role: formData.role,
    interest: formData.interest,
    message: formData.message,
  };

  try {
    // 2. Send Email via EmailJS (Bypasses Render's SMTP block)
    // Line 46 in your current file
await emailjs.send(
  import.meta.env.VITE_EMAILJS_SERVICE_ID as string,
  import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string,
  templateParams,
  import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string
);

    // 3. Save to your NeonDB via Render Backend
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    if (apiUrl) {
      await fetch(`${apiUrl}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
    }

    alert("✅ Message sent successfully! We will contact you soon.");
    setFormData({ firstName: "", lastName: "", email: "", company: "", role: "", interest: "", message: "" });
  } catch (err) {
    console.error("EmailJS or DB Error:", err);
    alert("❌ Submission failed. Please try again later.");
  } finally {
    setLoading(false);
  }
};

  // Reusable classes for form inputs to ensure they match the glass theme perfectly
  const inputStyles = "bg-black/5 dark:bg-white/[0.03] border-black/10 dark:border-white/[0.08] text-zinc-900 dark:text-white focus-visible:ring-[#fbbf24]/30 focus-visible:border-[#fbbf24]/50 rounded-xl h-12 transition-colors";
  const labelStyles = "text-zinc-700 dark:text-zinc-300 font-bold text-xs uppercase tracking-widest mb-2 block transition-colors";

  return (
    // ✅ RULE APPLIED: bg-white in light mode, bg-background in dark mode
    <div className="min-h-screen pt-24 pb-20 bg-white dark:bg-background text-zinc-900 dark:text-white selection:bg-[#fbbf24] relative z-10 overflow-hidden transition-colors duration-500">
      <ScrollProgress className="top-[69px]" />
      
      {/* ✅ RULE APPLIED: Soft yellow glow in light mode, subtle gold in dark mode */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#fbbf24]/15 dark:bg-[#fbbf24]/10 rounded-full blur-[120px] -z-10 pointer-events-none transition-colors duration-500" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-50 dark:bg-white/[0.03] border border-black/5 dark:border-white/[0.1] text-amber-600 dark:text-[#fbbf24] font-bold tracking-widest text-xs uppercase mb-6 shadow-sm dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] transition-colors">
            Contact Support
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">
            Let's <span className="text-[#fbbf24] drop-shadow-sm dark:drop-shadow-[0_0_15px_rgba(251,191,36,0.3)]">Talk</span>
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto leading-relaxed transition-colors">
            Whether you need a demo or have questions, we're here to help.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
          
          {/* Left Cards */}
          <div className="space-y-6">
            <div className="p-8 bg-white/60 dark:bg-[#050505]/20 backdrop-blur-xl border border-black/5 dark:border-white/[0.05] shadow-sm dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] rounded-[2rem] hover:border-black/15 dark:hover:border-white/[0.15] hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-zinc-50 dark:bg-white/[0.03] border border-black/5 dark:border-white/[0.05] flex items-center justify-center mb-6 group-hover:bg-amber-500/10 dark:group-hover:bg-[#fbbf24]/10 transition-colors">
                <Calendar className="w-7 h-7 text-[#fbbf24]" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-zinc-900 dark:text-zinc-100 group-hover:text-black dark:group-hover:text-white transition-colors">Schedule Demo</h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-6 leading-relaxed transition-colors">
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

            <div className="p-8 bg-white/60 dark:bg-[#050505]/20 backdrop-blur-xl border border-black/5 dark:border-white/[0.05] shadow-sm dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] rounded-[2rem] hover:border-black/15 dark:hover:border-white/[0.15] hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-zinc-50 dark:bg-white/[0.03] border border-black/5 dark:border-white/[0.05] flex items-center justify-center mb-6 group-hover:bg-amber-500/10 dark:group-hover:bg-[#fbbf24]/10 transition-colors">
                <MessageSquare className="w-7 h-7 text-[#fbbf24]" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-zinc-900 dark:text-zinc-100 group-hover:text-black dark:group-hover:text-white transition-colors">Live Chat</h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-6 leading-relaxed transition-colors">
                Real-time chat support is coming soon. For now, you can reach us
                via the contact form.
              </p>
              <Button
                variant="outline"
                className="w-full bg-black/5 dark:bg-white/[0.03] border-black/10 dark:border-white/[0.1] text-zinc-900 dark:text-white hover:bg-black/10 dark:hover:bg-white/[0.08] hover:text-[#fbbf24] dark:hover:text-[#fbbf24] font-bold rounded-xl h-11 transition-all"
                onClick={() =>
                  alert(
                    "🚀 Live chat coming soon! Please use the contact form for now."
                  )
                }
              >
                Start Chat
              </Button>
            </div>

            <div className="p-8 bg-white/60 dark:bg-[#050505]/20 backdrop-blur-xl border border-black/5 dark:border-white/[0.05] shadow-sm dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] rounded-[2rem] hover:border-black/15 dark:hover:border-white/[0.15] hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-zinc-50 dark:bg-white/[0.03] border border-black/5 dark:border-white/[0.05] flex items-center justify-center mb-6 group-hover:bg-amber-500/10 dark:group-hover:bg-[#fbbf24]/10 transition-colors">
                <Mail className="w-7 h-7 text-[#fbbf24]" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-zinc-900 dark:text-zinc-100 group-hover:text-black dark:group-hover:text-white transition-colors">Email Us</h3>
              <a
                href="mailto:leadequatorofficial@gmail.com"
                className="text-zinc-600 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-[#fbbf24] transition-colors font-medium break-all"
              >
                leadequatorofficial@gmail.com
              </a>
            </div>
          </div>

          {/* Form */}
          <div 
            id="contact-form"
            className="lg:col-span-2 p-8 md:p-12 bg-white/60 dark:bg-[#050505]/20 backdrop-blur-2xl border border-black/5 dark:border-white/[0.08] shadow-lg dark:shadow-[0_8px_30px_rgb(0,0,0,0.2),inset_0_1px_0_0_rgba(255,255,255,0.05)] rounded-[2.5rem] transition-colors duration-500"
          >
            <h2 className="text-3xl font-bold mb-8 text-zinc-900 dark:text-white transition-colors">Send Us a Message</h2>

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
                    <SelectContent className="bg-white dark:bg-zinc-950 border-black/10 dark:border-white/[0.1] text-zinc-900 dark:text-white rounded-xl shadow-xl">
                      <SelectItem value="marketing" className="focus:bg-amber-50 dark:focus:bg-[#fbbf24]/20 focus:text-amber-700 dark:focus:text-[#fbbf24] cursor-pointer">Marketing</SelectItem>
                      <SelectItem value="sales" className="focus:bg-amber-50 dark:focus:bg-[#fbbf24]/20 focus:text-amber-700 dark:focus:text-[#fbbf24] cursor-pointer">Sales</SelectItem>
                      <SelectItem value="executive" className="focus:bg-amber-50 dark:focus:bg-[#fbbf24]/20 focus:text-amber-700 dark:focus:text-[#fbbf24] cursor-pointer">Executive</SelectItem>
                      <SelectItem value="other" className="focus:bg-amber-50 dark:focus:bg-[#fbbf24]/20 focus:text-amber-700 dark:focus:text-[#fbbf24] cursor-pointer">Other</SelectItem>
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
                    <SelectContent className="bg-white dark:bg-zinc-950 border-black/10 dark:border-white/[0.1] text-zinc-900 dark:text-white rounded-xl shadow-xl">
                      <SelectItem value="demo" className="focus:bg-amber-50 dark:focus:bg-[#fbbf24]/20 focus:text-amber-700 dark:focus:text-[#fbbf24] cursor-pointer">Demo</SelectItem>
                      <SelectItem value="enterprise" className="focus:bg-amber-50 dark:focus:bg-[#fbbf24]/20 focus:text-amber-700 dark:focus:text-[#fbbf24] cursor-pointer">Enterprise</SelectItem>
                      <SelectItem value="partnership" className="focus:bg-amber-50 dark:focus:bg-[#fbbf24]/20 focus:text-amber-700 dark:focus:text-[#fbbf24] cursor-pointer">Partnership</SelectItem>
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
                  className="bg-black/5 dark:bg-white/[0.03] border-black/10 dark:border-white/[0.08] text-zinc-900 dark:text-white focus-visible:ring-[#fbbf24]/30 focus-visible:border-[#fbbf24]/50 rounded-xl min-h-[150px] resize-none p-4 transition-colors"
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
