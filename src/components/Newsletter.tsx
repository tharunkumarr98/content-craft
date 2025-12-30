import { Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Newsletter = () => {
  const handleSubscribe = () => {
    const subject = encodeURIComponent("Newsletter Subscription Request - TechieTips");
    const body = encodeURIComponent(
      "Hi,\n\nI would like to subscribe to the TechieTips newsletter to receive updates on new articles about data analytics, Power BI, and Microsoft Fabric.\n\nPlease add me to your mailing list.\n\nThank you!"
    );
    window.location.href = `mailto:tharunkumarr98@gmail.com?subject=${subject}&body=${body}`;
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
        
        <p className="text-muted-foreground mb-6 max-w-md leading-relaxed">
          Get notified when I publish new articles about data analytics, Power BI, and Microsoft Fabric. No spam, unsubscribe anytime.
        </p>
        
        <Button 
          onClick={handleSubscribe} 
          className="h-12 px-6 gap-2 bg-teal hover:bg-teal/90 text-white shadow-sm"
        >
          Subscribe via Email <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-teal/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-anthracite/5 rounded-full blur-3xl" />
    </section>
  );
};

export default Newsletter;
