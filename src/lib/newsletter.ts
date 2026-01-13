/**
 * Newsletter subscription service
 * 
 * Uses Lovable Cloud edge function with Resend by default.
 * Can be switched to Substack by changing the provider config.
 */

import { supabase } from "@/integrations/supabase/client";

// Configuration - update this when switching providers
export const NEWSLETTER_CONFIG = {
  // 'cloud' uses Lovable Cloud edge function with Resend
  // 'substack' redirects to Substack subscribe page
  provider: 'cloud' as 'cloud' | 'substack',
  // Only needed for Substack - your Substack subscribe URL
  substackUrl: '',
} as const;

export interface SubscribeResult {
  success: boolean;
  message: string;
}

/**
 * Subscribe to newsletter
 * @param email - Subscriber's email address
 * @param name - Optional subscriber name
 */
export async function subscribeToNewsletter(
  email: string,
  name?: string
): Promise<SubscribeResult> {
  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, message: 'Please enter a valid email address' };
  }

  try {
    if (NEWSLETTER_CONFIG.provider === 'cloud') {
      // Call Lovable Cloud edge function
      const { data, error } = await supabase.functions.invoke(
        'send-subscription-notification',
        {
          body: { email, name: name || '' },
        }
      );

      if (error) {
        console.error('Subscription error:', error);
        return { success: false, message: 'Subscription failed. Please try again.' };
      }

      return { success: true, message: data?.message || 'Thanks for subscribing!' };
    }

    if (NEWSLETTER_CONFIG.provider === 'substack') {
      // Redirect to Substack subscribe page
      if (NEWSLETTER_CONFIG.substackUrl) {
        window.open(NEWSLETTER_CONFIG.substackUrl, '_blank');
        return { success: true, message: 'Redirecting to Substack...' };
      }
      return { success: false, message: 'Substack URL not configured' };
    }

    return { success: false, message: 'Newsletter provider not configured' };
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return { success: false, message: 'Subscription failed. Please try again.' };
  }
}
