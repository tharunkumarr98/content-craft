import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface CommentNotificationRequest {
  authorName: string;
  reaction: string;
  comment: string;
  contentTitle: string;
  contentType: string;
  contentSlug: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { authorName, reaction, comment, contentTitle, contentType, contentSlug }: CommentNotificationRequest = await req.json();

    if (!authorName || !comment) {
      return new Response(
        JSON.stringify({ error: "Author name and comment are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Send notification email
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "TechieTips <onboarding@resend.dev>",
        to: ["tharunkumarr98@gmail.com"],
        subject: `💬 New Comment on "${contentTitle}"`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #1a1a1a;">New Comment Received!</h1>
            <p style="font-size: 16px; color: #333;">Someone just commented on your ${contentType}:</p>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0;"><strong>Content:</strong> ${contentTitle}</p>
              <p style="margin: 10px 0 0;"><strong>Author:</strong> ${authorName}</p>
              <p style="margin: 10px 0 0;"><strong>Reaction:</strong> ${reaction}</p>
              <p style="margin: 10px 0 0;"><strong>Comment:</strong></p>
              <div style="background: white; padding: 15px; border-radius: 6px; margin-top: 10px; border-left: 4px solid #0d9488;">
                ${comment.replace(/\n/g, '<br>')}
              </div>
            </div>
            <p style="color: #666; font-size: 14px;">
              Commented at: ${new Date().toLocaleString()}
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
    console.log("Comment notification sent:", emailResponse);

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-comment-notification:", error);
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
