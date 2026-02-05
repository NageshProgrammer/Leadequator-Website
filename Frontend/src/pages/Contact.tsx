import { useState } from "react";
// import { useNavigate } from "react-router-dom"; // Unused currently, but fine to keep if needed later
import { Card } from "@/components/ui/card";
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

  return (
    <div className="min-h-screen pt-24 pb-20">
      <ScrollProgress className="top-[65px]" />
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">
            Let's <span className="text-primary">Talk</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Whether you need a demo or have questions, we're here to help.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Left Cards */}
          <div className="space-y-6">
            <Card className="p-6">
              <Calendar className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Schedule Demo</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Demo requests are handled internally. Please submit the form and
                our team will coordinate the schedule.
              </p>
              <Button
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() =>
                  document
                    .getElementById("contact-form")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Request Demo
              </Button>
            </Card>

            <Card className="p-6">
              <MessageSquare className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Live Chat</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Real-time chat support is coming soon. For now, you can reach us
                via the contact form.
              </p>
              <Button
                variant="secondary"
                className="w-full"
                onClick={() =>
                  alert(
                    "🚀 Live chat coming soon! Please use the contact form for now."
                  )
                }
              >
                Start Chat
              </Button>
            </Card>

            <Card className="p-6">
              <Mail className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Email Us</h3>
              <a
                href="mailto:leadequatorofficial@gmail.com"
                className="text-primary hover:underline"
              >
                leadequatorofficial@gmail.com
              </a>
            </Card>
          </div>

          {/* Form */}
          <Card className="md:col-span-2 p-8" id="contact-form">
            <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    placeholder="John"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="john@company.com"
                />
              </div>

              <div>
                <Label htmlFor="company">Company *</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                  placeholder="Your Company Inc."
                />
              </div>

              <div>
                <Label>Your Role *</Label>
                <Select
                  onValueChange={(value) => handleSelectChange("role", value)}
                  value={formData.role}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="executive">Executive</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Interest *</Label>
                <Select
                  onValueChange={(value) => handleSelectChange("interest", value)}
                  value={formData.interest}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select interest" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="demo">Demo</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                    <SelectItem value="partnership">Partnership</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="How can we help you?"
                  className="min-h-[120px]"
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sending..." : "Submit Request"}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Contact;