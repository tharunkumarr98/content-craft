import { useState, useEffect } from "react";
import { Mail, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { subscribeToNewsletter } from "@/lib/newsletter";

interface SubscribeDialogProps {
  trigger?: React.ReactNode;
}

const SubscribeDialog = ({ trigger }: SubscribeDialogProps) => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Persist close preference for 7 days. By default persistence is per-path so
  // closing the dialog on / does not prevent it appearing on /blog. You can
  // configure via `window.SUBSCRIBE_POPUP_CONFIG = { perPage: false }` to make
  // it global.
  const STORAGE_KEY_BASE = "subscribe_dialog_closed_until";
  const DISABLE_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
  const globalCfg = (typeof window !== "undefined" && (window as any).SUBSCRIBE_POPUP_CONFIG) || {};
  const PER_PAGE = globalCfg.perPage !== undefined ? Boolean(globalCfg.perPage) : true;
  const storageKey = PER_PAGE ? `${STORAGE_KEY_BASE}:${typeof window !== "undefined" ? location.pathname : ""}` : STORAGE_KEY_BASE;

  const isClosedForUser = () => {
    try {
      const v = localStorage.getItem(storageKey);
      if (!v) return false;
      const ts = parseInt(v, 10);
      if (Number.isNaN(ts)) return false;
      return Date.now() < ts;
    } catch (err) {
      return false;
    }
  };

  const markClosedForUser = () => {
    try {
      const until = Date.now() + DISABLE_DURATION_MS;
      localStorage.setItem(storageKey, String(until));
    } catch (err) {
      // ignore
    }
  };

  // Listen for a global event to open the dialog programmatically.
  // This keeps the trigger logic framework-agnostic: other scripts can dispatch
  // `window.dispatchEvent(new CustomEvent('openSubscribeDialog'))` to open it.
  // Respect the user's persisted "do not show" preference.
  useEffect(() => {
    const onOpenRequest = () => {
      if (isClosedForUser()) return;
      setOpen(true);
    };
    window.addEventListener("openSubscribeDialog", onOpenRequest as EventListener);
    // Notify that the subscribe dialog listener is ready so external triggers
    // (like the scroll-trigger) can coordinate and avoid race conditions.
    try {
      window.dispatchEvent(new CustomEvent("subscribeDialogReady"));
    } catch (err) {}
    return () => {
      window.removeEventListener("openSubscribeDialog", onOpenRequest as EventListener);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    const result = await subscribeToNewsletter(email.trim(), name.trim());
    
    setIsLoading(false);

    if (result.success) {
      toast({
        title: "Subscribed!",
        description: result.message,
      });
      setEmail("");
      setName("");
      setOpen(false);
    } else {
      toast({
        title: "Subscription failed",
        description: result.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v: boolean) => {
        // If the dialog is being closed by the user, persist the preference for 7 days
        if (!v) markClosedForUser();
        setOpen(v);
      }}
    >
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="gap-2">
            <Mail className="h-4 w-4" />
            Subscribe
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Subscribe to Newsletter</DialogTitle>
          <DialogDescription>
            Get notified when I publish new articles about Power BI, Microsoft Fabric, and data analytics.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Name (optional)</Label>
            <Input
              id="name"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Subscribing...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Subscribe
              </>
            )}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            No spam, unsubscribe anytime.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SubscribeDialog;
