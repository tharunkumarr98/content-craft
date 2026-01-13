/**
 * Newsletter subscription service
 * 
 * Currently uses Google Sheets via Google Forms/Apps Script.
 * To switch to Substack later, just update the `subscribe` function
 * to call Substack's API instead.
 */

// Configuration - update this when switching providers
export const NEWSLETTER_CONFIG = {
  // For Google Sheets: Use your Google Apps Script Web App URL
  // For Substack: Replace with Substack embed URL or API endpoint
  endpoint: '', // User will configure this
  provider: 'google-sheets' as 'google-sheets' | 'substack',
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

  // If no endpoint configured, fall back to mailto
  if (!NEWSLETTER_CONFIG.endpoint) {
    const subject = encodeURIComponent('Newsletter Subscription - TechieTips');
    const body = encodeURIComponent(
      `Hi,\n\nPlease add me to the TechieTips newsletter.\n\nEmail: ${email}${name ? `\nName: ${name}` : ''}\n\nThank you!`
    );
    window.location.href = `mailto:tharunkumarr98@gmail.com?subject=${subject}&body=${body}`;
    return { success: true, message: 'Opening email client...' };
  }

  try {
    if (NEWSLETTER_CONFIG.provider === 'google-sheets') {
      // Google Apps Script Web App endpoint
      const response = await fetch(NEWSLETTER_CONFIG.endpoint, {
        method: 'POST',
        mode: 'no-cors', // Required for Google Apps Script
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          name: name || '',
          timestamp: new Date().toISOString(),
          source: window.location.origin,
        }),
      });

      // no-cors doesn't give us response status, assume success
      return { success: true, message: 'Thanks for subscribing!' };
    }

    if (NEWSLETTER_CONFIG.provider === 'substack') {
      // TODO: Implement Substack API integration
      // For now, redirect to Substack subscribe page
      window.open(NEWSLETTER_CONFIG.endpoint, '_blank');
      return { success: true, message: 'Redirecting to Substack...' };
    }

    return { success: false, message: 'Newsletter provider not configured' };
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return { success: false, message: 'Subscription failed. Please try again.' };
  }
}
