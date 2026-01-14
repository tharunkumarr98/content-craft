import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { MessageSquarePlus, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Comment {
  id: string;
  author_name: string;
  author_email: string | null;
  reaction: string;
  comment: string;
  created_at: string;
}

interface CommentsProps {
  contentSlug: string;
  contentType: string;
}

const REACTIONS = ["👍", "❤️", "🎉", "🤔", "👏"] as const;

const Comments: React.FC<CommentsProps> = ({ contentSlug, contentType }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [reaction, setReaction] = useState<string>("👍");
  const [commentText, setCommentText] = useState("");

  // Fetch comments
  useEffect(() => {
    fetchComments();
  }, [contentSlug, contentType]);

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("content_slug", contentSlug)
        .eq("content_type", contentType)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !commentText.trim()) {
      toast.error("Please fill in your name and comment");
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("comments").insert({
        content_slug: contentSlug,
        content_type: contentType,
        author_name: name.trim(),
        author_email: email.trim() || null,
        reaction,
        comment: commentText.trim(),
      });

      if (error) throw error;

      toast.success("Comment posted successfully!");
      setDialogOpen(false);
      setName("");
      setEmail("");
      setReaction("👍");
      setCommentText("");
      fetchComments();
    } catch (error) {
      console.error("Error posting comment:", error);
      toast.error("Failed to post comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const reactionCounts = comments.reduce((acc, comment) => {
    acc[comment.reaction] = (acc[comment.reaction] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <section className="mt-16 w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">
          Comments ({comments.length})
        </h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <MessageSquarePlus className="h-4 w-4" />
              Add Comment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Leave a Comment</DialogTitle>
              <DialogDescription>
                Share your thoughts on this article. Your email is optional and won't be displayed.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                  maxLength={100}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email (optional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  maxLength={255}
                />
              </div>
              <div className="space-y-2">
                <Label>Reaction *</Label>
                <div className="flex gap-2">
                  {REACTIONS.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setReaction(r)}
                      className={`text-2xl p-2 rounded-lg transition-all ${
                        reaction === r
                          ? "bg-primary/20 ring-2 ring-primary scale-110"
                          : "hover:bg-muted"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="comment">Comment *</Label>
                <Textarea
                  id="comment"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write your comment here..."
                  required
                  maxLength={1000}
                  rows={4}
                />
              </div>
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Posting...
                  </>
                ) : (
                  "Post Comment"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Reaction summary */}
      {Object.keys(reactionCounts).length > 0 && (
        <div className="flex gap-3 mb-6 flex-wrap">
          {REACTIONS.map((r) =>
            reactionCounts[r] ? (
              <div
                key={r}
                className="flex items-center gap-1 bg-muted px-3 py-1.5 rounded-full text-sm"
              >
                <span className="text-lg">{r}</span>
                <span className="text-muted-foreground">{reactionCounts[r]}</span>
              </div>
            ) : null
          )}
        </div>
      )}

      {/* Comments list */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-12 bg-muted/30 rounded-lg border border-border/50">
            <p className="text-muted-foreground">No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-card border border-border/50 rounded-lg p-4 hover:border-border transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl">{comment.reaction}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-foreground">
                      {comment.author_name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.created_at), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <p className="mt-2 text-foreground/90 whitespace-pre-wrap break-words">
                    {comment.comment}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default Comments;
