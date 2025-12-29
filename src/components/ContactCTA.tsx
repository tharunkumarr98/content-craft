import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ContactCTAProps {
  email?: string;
  subject?: string;
}

const ContactCTA = ({ 
  email = "tharunkumarr98@gmail.com",
  subject = "Hello from TechieTips"
}: ContactCTAProps) => {
  const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}`;

  return (
    <div className="mt-12 pt-10 border-t border-border">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 rounded-xl bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border border-primary/10">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            Have questions or feedback?
          </h3>
          <p className="text-muted-foreground text-sm">
            I'd love to hear from you. Let's connect!
          </p>
        </div>
        <Button asChild className="gap-2 shadow-sm">
          <a href={mailtoLink}>
            <Mail className="h-4 w-4" />
            Contact Me
          </a>
        </Button>
      </div>
    </div>
  );
};

export default ContactCTA;