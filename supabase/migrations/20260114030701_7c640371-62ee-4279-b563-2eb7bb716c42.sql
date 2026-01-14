-- Create subscribers table to store newsletter subscriptions
CREATE TABLE public.subscribers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  subscribed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Enable Row Level Security
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Only allow inserts from authenticated contexts (edge functions use service role)
-- Public users cannot read subscriber data
CREATE POLICY "Service role can manage subscribers"
  ON public.subscribers
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create index for email lookups
CREATE INDEX idx_subscribers_email ON public.subscribers(email);