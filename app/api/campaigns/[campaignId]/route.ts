import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase"; 
export const runtime = 'edge';

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, Content-Encoding, Accept-Encoding",
};

export async function GET(request: Request, context: { params: Promise<{ campaignId: string }> }) {
  try {
    const params = await context.params;
    const targetId = params.campaignId;

    // 1. Fetch the Campaign
    const { data: campaign, error: campErr } = await supabase
      .from("campaigns")
      .select("*")
      .eq("id", targetId)
      .single();

    if (campErr || !campaign) throw new Error("Campaign not found");

    
    if (campaign.is_stopped === true) {
      return NextResponse.json(
        { message: "This campaign has ended." }, 
        { status: 400, headers }
      );
    }

    // 2. The 50/50 Coin Flip!
    const isVariantA = Math.random() < 0.5;
    const chosenVariantId = isVariantA ? campaign.variant_a_id : campaign.variant_b_id;

    // 3. Fetch the actual Product (Blink) data for the winning variant
    const { data: variant, error: varErr } = await supabase
      .from("blinks")
      .select("*")
      .eq("id", chosenVariantId)
      .single();

    if (varErr || !variant) throw new Error("Variant not found");

    // 4. Tell the database this variant just got a view!
    await supabase
      .from("blinks")
      .update({ views: (variant.views || 0) + 1 })
      .eq("id", chosenVariantId);

    // 5. Build the Web3 Cart Payload
    const baseUrl = new URL(request.url).origin;
    const payload = {
      icon: variant.image_url,
      title: variant.title,
      description: variant.description,
      label: `Buy for ${variant.price_sol} SOL`,
      links: {
        actions: [
          {
            label: `Buy for ${variant.price_sol} SOL`,
            href: `${baseUrl}/api/actions/${chosenVariantId}`, 
          },
        ],
      },
    };

    return NextResponse.json(payload, { headers });
  } catch (error) {
    console.error("Campaign GET Error:", error);
    return NextResponse.json({ error: "Failed to load campaign" }, { status: 500, headers });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { headers });
}