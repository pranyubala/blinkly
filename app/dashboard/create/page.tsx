"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase"; 
import { CheckCircle2, Copy, UploadCloud, Zap, Wallet } from "lucide-react";
import { useWallet } from "@/components/ClientWrapper";
import Link from "next/link";

export default function CreateBlink() {
  const { walletAddress } = useWallet(); 

  const [loading, setLoading] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState("");

  // Product Data
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [productUrl, setProductUrl] = useState("");

  // The Smart Receiving Wallet
  const [receivingWallet, setReceivingWallet] = useState("");

  // Auto-fill from login
  useEffect(() => {
    if (walletAddress && !receivingWallet) {
      setReceivingWallet(walletAddress);
    }
  }, [walletAddress]);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletAddress) {
      alert("Please connect your wallet first!");
      return;
    }
    if (!receivingWallet) {
      alert("Please specify a receiving wallet address!");
      return;
    }
    if (!imageFile) {
      alert("Please upload a product image!");
      return;
    }

    setLoading(true);

    try {
      // 1. Upload Image
      const ext = imageFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${ext}`;
      const { error: uploadErr } = await supabase.storage.from("blink-images").upload(`products/${fileName}`, imageFile);
      if (uploadErr) throw uploadErr;

      const imageUrl = supabase.storage.from("blink-images").getPublicUrl(`products/${fileName}`).data.publicUrl;

      // 2. Insert into Database
      const { data: blink, error: insertErr } = await supabase.from("blinks").insert([{
        title,
        description,
        price_sol: parseFloat(price),
        image_url: imageUrl,
        product_url: productUrl,
        creator_wallet: receivingWallet 
      }]).select().single();
      
      if (insertErr) throw insertErr;

      // 3. Generate Link
      const baseUrl = window.location.origin;
      setGeneratedUrl(`${baseUrl}/api/actions/${blink.id}`);

    } catch (error) {
      console.error("Error creating blink:", error);
      alert("Failed to create product. Check console.");
    } finally {
      setLoading(false);
    }
  };

  // AUTH LOCK
  if (!walletAddress) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6 text-center pb-32 font-sans">
        <div className="w-20 h-20 bg-neutral-900 border border-neutral-800 rounded-3xl flex items-center justify-center mb-6 shadow-2xl">
          <Wallet className="w-10 h-10 text-neutral-500" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-3">Connect Wallet to Create</h2>
        <p className="text-neutral-400 mb-8 max-w-md">You must be logged in to create and manage Standard Products.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6 pt-12 pb-24 font-sans">
      <div className="max-w-3xl mx-auto">
        
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-white inline-flex items-center gap-3">
            <Zap className="w-8 h-8 text-blue-500" />
            Create Standard Product
          </h1>
          <p className="text-neutral-400 mt-3 text-lg">Launch a single product Action in under 60 seconds.</p>
        </div>

        {!generatedUrl ? (
          <form onSubmit={handleCreate} className="bg-neutral-900 border border-neutral-800 p-8 rounded-3xl shadow-2xl space-y-8">
            
            {/* Image Upload */}
            <div className="relative group cursor-pointer h-64 w-full">
              <input type="file" accept="image/*" required onChange={handleImage} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
              <div className={`w-full h-full rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all overflow-hidden ${preview ? 'border-blue-500/50' : 'border-neutral-700 hover:border-blue-500/50 bg-neutral-950'}`}>
                {preview ? (
                  <img src={preview} className="w-full h-full object-cover opacity-90" />
                ) : (
                  <>
                    <UploadCloud className="w-10 h-10 text-neutral-500 group-hover:text-blue-400 mb-3" />
                    <span className="text-sm text-neutral-400 font-medium">Click or drag to upload product image</span>
                  </>
                )}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-5 bg-neutral-950 border border-neutral-800 p-6 rounded-2xl">
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">Product Title</label>
                <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors" placeholder="e.g., The Ultimate Solana Dev Sheet (PDF)" />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">Description</label>
                <input type="text" required value={description} onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors" placeholder="Everything you need to master Web3 development..." />
              </div>

              <div className="mb-4">
  <label className="block text-sm font-medium text-white mb-2">Product Access Link</label>
  <input 
    type="url"
    value={productUrl}
    onChange={(e) => setProductUrl(e.target.value)}
    placeholder="e.g., Google Drive, Notion, YouTube..."
    required
    className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"  
  />
  <p className="text-xs text-neutral-300 mt-2">
    Buyers receive this link instantly after payment. Works for files, templates, videos, or communities.
  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-2">Price (SOL)</label>
                  <input type="number" step="0.001" required value={price} onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors" placeholder="0.1" />
                </div>

                {/* THE SMART WALLET FIELD */}
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-2 flex justify-between">
                    <span>Receiving Wallet</span>
                    <span className="text-xs text-blue-500">Auto-filled</span>
                  </label>
                  <input type="text" required value={receivingWallet} onChange={(e) => setReceivingWallet(e.target.value)}
                    className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors font-mono text-sm text-neutral-300" placeholder="Paste Solana address..." />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-blue-500/20 transition-all text-lg mt-4">
              {loading ? "Generating Action Link..." : "Create Product"}
            </button>
          </form>
        ) : (
          /* SUCCESS SCREEN */
          <div className="bg-neutral-900 border border-green-500/30 rounded-3xl p-10 text-center space-y-6 shadow-2xl">
            <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto" />
            <h2 className="text-3xl font-bold text-white">Product Created!</h2>
            
            <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 text-left space-y-4">
              <p className="text-neutral-400 text-sm">Your standard Action link is live and ready to be shared on Twitter, Dialect, or anywhere else.</p>
              <div className="bg-black border border-neutral-800 rounded-xl p-4 flex items-center justify-between gap-3">
                <span className="text-blue-400 truncate font-mono text-sm">{generatedUrl}</span>
                <button onClick={() => { navigator.clipboard.writeText(generatedUrl); alert("Copied!"); }}
                  className="bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 font-bold shrink-0">
                  <Copy className="w-4 h-4" /> Copy Link
                </button>
              </div>
            </div>
            
            <div className="flex gap-4 pt-2">
              <button onClick={() => window.location.reload()} className="flex-1 bg-neutral-800 text-white font-bold py-4 rounded-xl hover:bg-neutral-700 transition-colors">
                Create Another
              </button>
              <Link href="/dashboard" className="flex-1 bg-white text-black font-bold py-4 rounded-xl hover:bg-neutral-200 transition-colors flex items-center justify-center">
                Go to Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}