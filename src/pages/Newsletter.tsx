import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Mail, CheckCircle2, Loader2, Rss, BookOpen, Lightbulb, LayoutDashboard } from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { subscribeToNewsletter } from "@/lib/newsletter";
import { useToast } from "@/hooks/use-toast";

const perks = [
  { icon: BookOpen,       label: "Deep-dive technical articles", sub: "Power BI, Fabric, Power Automate, Power Apps" },
  { icon: Lightbulb,      label: "Quick tips and shortcuts",      sub: "Actionable patterns you can use the same day" },
  { icon: LayoutDashboard,label: "Dashboard showcase updates",    sub: "Real-world examples with embed links" },
  { icon: Rss,            label: "No noise, ever",               sub: "One email per new post. Unsubscribe anytime." },
];

const Newsletter = () => {
  const [email, setEmail]     = useState("");
  const [name, setName]       = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone]       = useState(false);
  const { toast }             = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    const result = await subscribeToNewsletter(email.trim(), name.trim());
    setLoading(false);
    if (result.success) {
      setDone(true);
    } else {
      toast({ title: "Subscription failed", description: result.message, variant: "destructive" });
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>Newsletter - TechieTips</title>
        <meta name="description" content="Subscribe to TechieTips and get notified when new articles, tips, and dashboards on Power BI, Microsoft Fabric, and data analytics are published." />
      </Helmet>

      <section className="container py-16 max-w-3xl animate-fade-in">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-6">
            <Mail className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight">
            Stay in the Loop
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Get notified when new articles, tips, and dashboards go live. Practical content on the Microsoft data ecosystem, written for practitioners.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* Perks */}
          <div className="space-y-5">
            {perks.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0 mt-0.5">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{label}</p>
                  <p className="text-sm text-muted-foreground">{sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="p-6 rounded-2xl border border-border/60 bg-card shadow-sm">
            {done ? (
              <div className="text-center py-6">
                <CheckCircle2 className="h-12 w-12 text-primary mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-foreground mb-2">You're subscribed!</h2>
                <p className="text-muted-foreground text-sm">
                  Check your inbox for a welcome message. You'll hear from me when the next post goes live.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nl-email">Email address *</Label>
                  <Input
                    id="nl-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nl-name">Name <span className="text-muted-foreground">(optional)</span></Label>
                  <Input
                    id="nl-name"
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <Button type="submit" className="w-full gap-2" disabled={loading}>
                  {loading ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Subscribing...</>
                  ) : (
                    <><Mail className="h-4 w-4" /> Subscribe</>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  No spam. Unsubscribe anytime with one click.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Newsletter;
