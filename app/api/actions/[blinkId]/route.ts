export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import { ActionGetResponse, ActionPostRequest, ActionPostResponse, createActionHeaders, createPostResponse } from "@solana/actions";
import { Connection, PublicKey, SystemProgram, Transaction, clusterApiUrl, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { supabase } from "../../../lib/supabase"; 

const headers = createActionHeaders();

export async function GET(req: Request, { params }: { params: Promise<{ blinkId: string }> }) {
  try {
    const currentBlinkId = (await params).blinkId;
    const { data: blink, error } = await supabase.from("blinks").select("*").eq("id", currentBlinkId).single();
    
    if (error || !blink) return new Response("Not found", { status: 404, headers });

    if (blink.is_stopped === true) {
      return new Response(JSON.stringify({ message: "This campaign has ended." }), { status: 400, headers });
    }

    
    await supabase.from("blinks").update({ views: (blink.views || 0) + 1 }).eq("id", blink.id);

    const baseUrl = new URL(req.url).origin; 

    const payload: ActionGetResponse = {
      icon: blink.image_url,
      title: blink.title,
      description: blink.description,
      label: `Buy for ${blink.price_sol} SOL`,
      links: {
        actions: [{ label: `Buy for ${blink.price_sol} SOL`, href: `${baseUrl}/api/actions/${blink.id}`, type: "transaction" }]
      }
    };
    
    return Response.json(payload, { headers });
  } catch (err) { 
    return new Response("Error", { status: 500, headers }); 
  }
}

export async function OPTIONS() { return new Response(null, { headers }); }

export async function POST(req: Request, { params }: { params: Promise<{ blinkId: string }> }) {
  try {
    const currentBlinkId = (await params).blinkId;
    const body: ActionPostRequest = await req.json();
    const buyerPubkey = new PublicKey(body.account);

    const { data: blink } = await supabase.from("blinks").select("*").eq("id", currentBlinkId).single();
    if (!blink) return new Response(JSON.stringify({ error: "Not found" }), { status: 404, headers });

    if (blink.is_stopped === true) {
      return new Response(JSON.stringify({ error: "This campaign has ended." }), { status: 400, headers });
    }

    const connection = new Connection(clusterApiUrl("devnet"));
    
    if (!blink.creator_wallet) {
      return new Response(JSON.stringify({ error: "Creator wallet address not configured" }), { status: 400, headers });
    }

    const creatorPubkey = new PublicKey(blink.creator_wallet);
    
    const transaction = new Transaction().add(
      SystemProgram.transfer({ fromPubkey: buyerPubkey, toPubkey: creatorPubkey, lamports: blink.price_sol * LAMPORTS_PER_SOL })
    );
    transaction.feePayer = buyerPubkey;
    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

    const baseUrl = new URL(req.url).origin; 

    const payload: ActionPostResponse = await createPostResponse({
      fields: { 
        transaction, 
        message: "Please approve the transaction to access your product.", 
        type: "transaction",
        links: {
          next: {
            type: "post",
            // This is the new route we are about to create!
            href: `${baseUrl}/api/actions/verify?blinkId=${currentBlinkId}` 
          }
        }
      },
    });
    
    return Response.json(payload, { headers });

  } catch (err) { 
    console.error("POST Crash Details:", err); 
    return new Response(JSON.stringify({ error: "Transaction Error" }), { status: 500, headers }); 
  }
}