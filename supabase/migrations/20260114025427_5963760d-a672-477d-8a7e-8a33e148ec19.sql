-- Create comments table for blog/content comments
CREATE TABLE public.comments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    content_slug TEXT NOT NULL,
    content_type TEXT NOT NULL,
    author_name TEXT NOT NULL,
    author_email TEXT,
    reaction TEXT NOT NULL CHECK (reaction IN ('👍', '❤️', '🎉', '🤔', '👏')),
    comment TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read comments (public blog)
CREATE POLICY "Anyone can read comments" 
ON public.comments 
FOR SELECT 
USING (true);

-- Allow anyone to insert comments (no auth required for blog comments)
CREATE POLICY "Anyone can post comments" 
ON public.comments 
FOR INSERT 
WITH CHECK (true);

-- Create index for faster lookups by content
CREATE INDEX idx_comments_content ON public.comments (content_slug, content_type);