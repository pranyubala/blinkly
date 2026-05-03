"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";   
import { CheckCircle2, Copy, UploadCloud, ArrowRightLeft, Wallet } from "lucide-react";
import { useWallet } from "@/components/ClientWrapper";

export default function CreateABTest() {
  const { walletAddress } = useWallet(); 

  const [loading, setLoading] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [campaignId, setCampaignId] = useState("");

  // Global Data
  const [campaignName, setCampaignName] = useState("");
  //  NEW: Smart Receiving Wallet State
  const [receivingWallet, setReceivingWallet] = useState("");

  // Auto-fill the receiving wallet when the user logs in
  useEffect(() => {
    if (walletAddress && !receivingWallet) {
      setReceivingWallet(walletAddress);
    }
  }, [walletAddress]);

  // Variant A Dedicated Data
  const [titleA, setTitleA] = useState("");
  const [descriptionA, setDescriptionA] = useState("");
  const [priceA, setPriceA] = useState("");
  const [imageFileA, setImageFileA] = useState<File | null>(null);
  const [previewA, setPreviewA] = useState<string | null>(null);
   const [productUrlA, setProductUrlA] = useState("");

  // Variant B Dedicated Data
  const [titleB, setTitleB] = useState("");
  const [descriptionB, setDescriptionB] = useState("");
  const [priceB, setPriceB] = useState("");
  const [imageFileB, setImageFileB] = useState<File | null>(null);
  const [previewB, setPreviewB] = useState<string | null>(null);
  const [productUrlB, setProductUrlB] = useState("");


  const handleImageA = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setImageFileA(file); setPreviewA(URL.createObjectURL(file)); }
  };

  const handleImageB = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setImageFileB(file); setPreviewB(URL.createObjectURL(file)); }
  };

const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletAddress) {
      alert("Please connect your wallet using the top navigation bar first!");
      return;
    }
    if (!receivingWallet) {
      alert("Please specify a receiving wallet address!");
      return;
    }
    if (!imageFileA || !imageFileB) {
      alert("Please upload images for both Variant A and Variant B!");
      return;
    }

    setLoading(true);

    try {
      
      const newCampaignId = crypto.randomUUID();
      const newBlinkAId = crypto.randomUUID();
      const newBlinkBId = crypto.randomUUID();
      const baseUrl = window.location.origin;

      const extA = imageFileA.name.split('.').pop();
      const nameA = `varA_${newBlinkAId}.${extA}`;
      const urlA = supabase.storage.from("blink-images").getPublicUrl(`campaigns/${nameA}`).data.publicUrl;

      const extB = imageFileB.name.split('.').pop();
      const nameB = `varB_${newBlinkBId}.${extB}`;
      const urlB = supabase.storage.from("blink-images").getPublicUrl(`campaigns/${nameB}`).data.publicUrl;

  
      const [uploadA, uploadB] = await Promise.all([
        supabase.storage.from("blink-images").upload(`campaigns/${nameA}`, imageFileA),
        supabase.storage.from("blink-images").upload(`campaigns/${nameB}`, imageFileB)
      ]);

      if (uploadA.error) throw uploadA.error;
      if (uploadB.error) throw uploadB.error;

    
      const { error: blinksErr } = await supabase.from("blinks").insert([
        {
          id: newBlinkAId, 
          title: titleA, description: descriptionA, price_sol: parseFloat(priceA), 
          image_url: urlA, creator_wallet: receivingWallet, product_url: productUrlA
        },
        {
          id: newBlinkBId, 
          title: titleB, description: descriptionB, price_sol: parseFloat(priceB), 
          image_url: urlB, creator_wallet: receivingWallet, product_url: productUrlB
        }
      ]);
      if (blinksErr) throw blinksErr;

    
      const { error: campErr } = await supabase.from("campaigns").insert([{
        id: newCampaignId, 
        name: campaignName, 
        variant_a_id: newBlinkAId, 
        variant_b_id: newBlinkBId,
        creator_wallet: walletAddress 
      }]);
      if (campErr) throw campErr;

      // 7. Reveal the link!
      setGeneratedUrl(`${baseUrl}/api/campaigns/${newCampaignId}`);
      setCampaignId(newCampaignId);

    } catch (error) {
      console.error("Error creating campaign:", error);
      alert("Failed to create A/B Test. Check console.");
    } finally {
    
      setLoading(false);
    }
  };
  if (!walletAddress) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6 text-center pb-32 font-sans">
        <div className="w-20 h-20 bg-neutral-900 border border-neutral-800 rounded-3xl flex items-center justify-center mb-6 shadow-2xl">
          <Wallet className="w-10 h-10 text-neutral-500" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-3">Connect Wallet to Create</h2>
        <p className="text-neutral-400 mb-8 max-w-md">You must be logged in to create and manage A/B campaigns.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6 pt-12 pb-24 font-sans">
      <div className="max-w-5xl mx-auto">
        
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-white inline-flex items-center gap-3">
            <ArrowRightLeft className="w-8 h-8 text-pink-500" />
            Create A/B Campaign
          </h1>
          <p className="text-neutral-400 mt-3 text-lg">Split-test prices, images, and copy to maximize your Solana revenue.</p>
        </div>

        {!generatedUrl ? (
          <form onSubmit={handleCreate} className="space-y-8 bg-neutral-900 border border-neutral-800 p-8 rounded-3xl shadow-2xl">
            
            {/* Global Settings */}
            <div className="p-6 bg-neutral-950 border border-neutral-800 rounded-2xl space-y-5">
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">Campaign Tracking Name (Internal Only)</label>
                <input type="text" required value={campaignName} onChange={(e) => setCampaignName(e.target.value)}
                  className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 focus:outline-none focus:border-pink-500 transition-colors text-lg" placeholder="e.g., Summer Launch Test" />
              </div>
              
             
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2 flex items-center justify-between">
                  <span>Receiving Wallet (Where funds go)</span>
                  <span className="text-xs text-pink-500 font-normal">Auto-filled from login</span>
                </label>
                <input type="text" required value={receivingWallet} onChange={(e) => setReceivingWallet(e.target.value)}
                  className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 focus:outline-none focus:border-pink-500 transition-colors font-mono text-sm text-neutral-300" placeholder="Paste Solana address..." />
              </div>
            </div>

            {/* A/B Variants Split */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* VARIANT A */}
              <div className="p-6 bg-neutral-950 border border-purple-500/30 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-purple-500"></div>
                <h3 className="text-xl font-bold text-white mb-6">Variant A</h3>
                
                <div className="space-y-5">
                  <div className="relative group cursor-pointer h-48 w-full">
                    <input type="file" accept="image/*" required onChange={handleImageA} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                    <div className={`w-full h-full rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all overflow-hidden ${previewA ? 'border-purple-500/50' : 'border-neutral-700 hover:border-purple-500/50'}`}>
                      {previewA ? <img src={previewA} className="w-full h-full object-cover opacity-80" /> : <><UploadCloud className="w-8 h-8 text-neutral-500 group-hover:text-purple-400 mb-2" /><span className="text-xs text-neutral-500 font-medium">Upload Image A</span></>}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Title A</label>
                    <input type="text" required value={titleA} onChange={(e) => setTitleA(e.target.value)}
                      className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500" placeholder="e.g., Premium Web3 Guide" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Description A</label>
                    <input type="text" required value={descriptionA} onChange={(e) => setDescriptionA(e.target.value)}
                      className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500" placeholder="A comprehensive overview..." />
                  </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-white mb-2">Product Access Link</label>
                               <input 
                                   type="url"
                                   value={productUrlA}
                                   onChange={(e) => setProductUrlA(e.target.value)}
                                   placeholder="e.g., Google Drive, Notion, YouTube..."
                                   required
                                   className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"  
                                    />
                                  <p className="text-xs text-neutral-300 mt-2">
                           Buyers receive this link instantly after payment. Works for files, templates, videos, or communities.
                  </p>
                </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Price A (SOL)</label>
                    <input type="number" step="0.001" required value={priceA} onChange={(e) => setPriceA(e.target.value)}
                      className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500" placeholder="0.1" />
                  </div>
                </div>
              </div>

              {/* VARIANT B */}
              <div className="p-6 bg-neutral-950 border border-orange-500/30 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-orange-500"></div>
                <h3 className="text-xl font-bold text-white mb-6">Variant B</h3>
                
                <div className="space-y-5">
                  <div className="relative group cursor-pointer h-48 w-full">
                    <input type="file" accept="image/*" required onChange={handleImageB} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                    <div className={`w-full h-full rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all overflow-hidden ${previewB ? 'border-orange-500/50' : 'border-neutral-700 hover:border-orange-500/50'}`}>
                      {previewB ? <img src={previewB} className="w-full h-full object-cover opacity-80" /> : <><UploadCloud className="w-8 h-8 text-neutral-500 group-hover:text-orange-400 mb-2" /><span className="text-xs text-neutral-500 font-medium">Upload Image B</span></>}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Title B</label>
                    <input type="text" required value={titleB} onChange={(e) => setTitleB(e.target.value)}
                      className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500" placeholder="e.g., Ultimate Crypto Blueprint" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Description B</label>
                    <input type="text" required value={descriptionB} onChange={(e) => setDescriptionB(e.target.value)}
                      className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500" placeholder="Everything you need to know..." />
                  </div>

                        <div className="mb-4">
                      <label className="block text-sm font-medium text-white mb-2">Product Access Link</label>
                         <input 
                          type="url"
                          value={productUrlB}
                          onChange={(e) => setProductUrlB(e.target.value)}
                          placeholder="e.g., Google Drive, Notion, YouTube..."
                          required
                          className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"  
                           />
                  <p className="text-xs text-neutral-300 mt-2">
                  Buyers receive this link instantly after payment. Works for files, templates, videos, or communities.
                  </p>
               </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Price B (SOL)</label>
                    <input type="number" step="0.001" required value={priceB} onChange={(e) => setPriceB(e.target.value)}
                      className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500" placeholder="0.15" />
                  </div>
                </div>
              </div>

            </div>

            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-pink-600 to-orange-500 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-pink-500/20 transition-all text-lg mt-8">
              {loading ? "Initializing A/B Engine..." : "Deploy Campaign"}
            </button>
          </form>
        ) : (
          /* SUCCESS SCREEN */
          <div className="bg-neutral-900 border border-green-500/30 rounded-3xl p-10 text-center space-y-6 shadow-2xl">
            <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto" />
            <h2 className="text-3xl font-bold text-white">Campaign Deployed!</h2>
            
            <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 text-left space-y-4">
              <p className="text-neutral-400 text-sm">Your completely custom A/B testing Action link is live. Traffic will automatically split 50/50 between Variant A and Variant B.</p>
              <div className="bg-black border border-neutral-800 rounded-xl p-4 flex items-center justify-between gap-3">
                <span className="text-pink-400 truncate font-mono text-sm">{generatedUrl}</span>
                <button onClick={() => { navigator.clipboard.writeText(generatedUrl); alert("Copied!"); }}
                  className="bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 font-bold shrink-0">
                  <Copy className="w-4 h-4" /> Copy Link
                </button>
              </div>
            </div>
            
            <button onClick={() => window.location.href='/dashboard'} className="w-full bg-neutral-800 text-white font-bold py-4 rounded-xl hover:bg-neutral-700 transition-colors">
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}