export const dynamic = 'force-dynamic';

import { createActionHeaders } from "@solana/actions";
import { supabase } from "../../../lib/supabase"; 

const headers = createActionHeaders();

export async function OPTIONS() { return new Response(null, { headers }); }

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const blinkId = url.searchParams.get("blinkId");
    
    // The wallet automatically sends the signature in the body
    const body = await req.json();
    const signature = body.signature;

    if (!blinkId || !signature) {
      return new Response(JSON.stringify({ error: "Missing parameters or transaction cancelled." }), { status: 400, headers });
    }

    // 1. Fetch the Blink to get the product URL
    const { data: blink, error: fetchError } = await supabase.from("blinks").select("*").eq("id", blinkId).single();
    
    if (fetchError || !blink) {
      return new Response(JSON.stringify({ error: "Blink not found" }), { status: 404, headers });
    }

    await supabase.from("blinks").update({ clicks: (blink.clicks || 0) + 1 }).eq("id", blinkId);

    return Response.json({
      type: "completed",
      title: "Payment Verified!",
      icon: blink.image_url,
      description: `Payment successful! Access your product here:\n\n${blink.product_url}`,
      label: "View Product",
    }, { headers });

  } catch (err) {
    console.error("Verify Route Error:", err);
    return new Response(JSON.stringify({ error: "Verification Failed" }), { status: 500, headers });
  }
}