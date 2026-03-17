import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const RESEND_AUDIENCE_ID = Deno.env.get("RESEND_AUDIENCE_ID");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SubscriptionRequest {
  email: string;
  name?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name }: SubscriptionRequest = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Create Supabase client with service role key to bypass RLS
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Store subscriber in database (upsert to handle duplicates)
    const { error: dbError } = await supabase
      .from("subscribers")
      .upsert(
        { email, name: name || null, is_active: true },
        { onConflict: "email" }
      );

    if (dbError) {
      console.error("Database error:", dbError);
      // Continue to send email even if DB fails
    }
    // Add contact to Resend audience
    if (RESEND_AUDIENCE_ID) {
      try {
        const audienceResponse = await fetch(
          `https://api.resend.com/audiences/${RESEND_AUDIENCE_ID}/contacts`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
              email,
              first_name: name || undefined,
              unsubscribed: false,
            }),
          }
        );

        if (!audienceResponse.ok) {
          const audienceError = await audienceResponse.json();
          console.error("Resend Audience API error:", audienceError);
        } else {
          console.log("Contact added to Resend audience successfully");
        }
      } catch (audienceErr) {
        console.error("Failed to add contact to Resend audience:", audienceErr);
      }
    }

    // Send welcome email to the subscriber using Resend saved template
    const WELCOME_TEMPLATE_ID = Deno.env.get("RESEND_WELCOME_TEMPLATE_ID") || "ece40ffa-d534-4a87-9b33-53aff91bc5e4";
    if (WELCOME_TEMPLATE_ID) {
      try {
        const welcomeResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: "TechieTips <onboarding@resend.dev>",
            to: [email],
            template: {
              id: WELCOME_TEMPLATE_ID,
              variables: {
                name: name || "there",
              },
            },
          }),
        });

        if (!welcomeResponse.ok) {
          const welcomeError = await welcomeResponse.json();
          console.error("Welcome email error:", welcomeError);
        } else {
          console.log("Welcome email sent to:", email);
        }
      } catch (welcomeErr) {
        console.error("Failed to send welcome email:", welcomeErr);
      }
    } else {
      console.warn("RESEND_WELCOME_TEMPLATE_ID not set, skipping welcome email");
    }


    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "TechieTips <onboarding@resend.dev>",
        to: ["tharunkumarr98@gmail.com"],
        subject: "🎉 New Newsletter Subscriber!",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #1a1a1a;">New Newsletter Subscription</h1>
            <p style="font-size: 16px; color: #333;">Someone just subscribed to your newsletter!</p>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0;"><strong>Email:</strong> ${email}</p>
              ${name ? `<p style="margin: 10px 0 0;"><strong>Name:</strong> ${name}</p>` : ''}
            </div>
            <p style="color: #666; font-size: 14px;">
              Subscribed at: ${new Date().toLocaleString()}
            </p>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Resend API error:", errorData);
      throw new Error(errorData.message || "Failed to send email");
    }

    const emailResponse = await response.json();
    console.log("Subscription notification sent:", emailResponse);

    return new Response(
      JSON.stringify({ success: true, message: "Thanks for subscribing!" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-subscription-notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
