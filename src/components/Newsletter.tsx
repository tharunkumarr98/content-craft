import { useState } from "react";
import { Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate subscription
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Subscribed!",
      description: "You'll receive updates when new articles are published.",
    });
    
    setEmail("");
    setIsLoading(false);
  };

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal/5 via-teal/10 to-anthracite/5 border border-teal/20 p-8 md:p-10">
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-teal/15">
            <Mail className="h-5 w-5 text-teal" />
          </div>
          <h3 className="text-xl font-semibold text-anthracite">
            Stay Updated
          </h3>
        </div>
        
        <p className="text-muted-foreground mb-8 max-w-md leading-relaxed">
          Get notified when I publish new articles about data analytics, Power BI, and Microsoft Fabric. No spam, unsubscribe anytime.
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md">
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 h-12 bg-background/80 border-teal/30 focus:border-teal focus:ring-teal/20"
          />
          <Button type="submit" disabled={isLoading} className="h-12 px-6 gap-2 bg-teal hover:bg-teal/90 text-white shadow-sm">
            {isLoading ? "Subscribing..." : (
              <>
                Subscribe <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-teal/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-anthracite/5 rounded-full blur-3xl" />
    </section>
  );
};

export default Newsletter;
