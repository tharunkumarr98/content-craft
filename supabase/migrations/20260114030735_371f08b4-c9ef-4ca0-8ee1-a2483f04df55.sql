-- Drop the overly permissive policy
DROP POLICY "Service role can manage subscribers" ON public.subscribers;

-- Deny all direct access - only service role (edge functions) can access
-- Service role bypasses RLS, so no explicit policy needed for it
CREATE POLICY "No direct public access to subscribers"
  ON public.subscribers
  FOR ALL
  USING (false)
  WITH CHECK (false);