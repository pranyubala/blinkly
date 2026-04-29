"use client";

import { useState, useEffect } from "react";
import { MessageCircle, Repeat2, Heart, BarChart3, Share, BadgeCheck, Zap, X, Wallet } from "lucide-react";
import { Transaction } from "@solana/web3.js";

const base64ToUint8Array = (base64: string) => {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

export default function NativeSimulator() {
  const [actionLink, setActionLink] = useState("");
  const [blinkData, setBlinkData] = useState<any>(null);
  const [postUrl, setPostUrl] = useState("");
  
  
  const [loading, setLoading] = useState(false);
  const [txStatus, setTxStatus] = useState<"idle" | "loading" | "success">("idle");
  const [signature, setSignature] = useState("");
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [detectedWallets, setDetectedWallets] = useState<any[]>([]);


  useEffect(() => {
    const scanWallets = () => {
      const wallets = [];
      const win = window as any;
      
      if (win.backpack) wallets.push({ name: "Backpack", provider: win.backpack, iconColor: "bg-red-500" });
      if (win.phantom?.solana) wallets.push({ name: "Phantom", provider: win.phantom.solana, iconColor: "bg-purple-500" });
      if (win.okxwallet?.solana) wallets.push({ name: "OKX Wallet", provider: win.okxwallet.solana, iconColor: "bg-white" });
      if (win.solflare) wallets.push({ name: "Solflare", provider: win.solflare, iconColor: "bg-orange-500" });
      
      setDetectedWallets(wallets);
    };
    setTimeout(scanWallets, 500);
  }, []);

  const loadSimulator = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionLink) return;
    
    const cleanLink = actionLink.trim();
    setLoading(true);
    setTxStatus("idle");
    setSignature("");
    
    try {
      const res = await fetch(cleanLink);
      if (!res.ok) throw new Error("Could not load Action Data");
      
      const data = await res.json();
      setBlinkData(data);
      setPostUrl(data.links.actions[0].href);
    } catch (err) {
      alert("Failed to load Blink. Make sure you pasted the FULL Action Link!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Executes the transaction using the SPECIFIC wallet the user clicked
  const executeTransaction = async (wallet: any) => {
    setShowWalletModal(false); // Close the modal
    
    try {
      setTxStatus("loading");
      
      const provider = wallet.provider;
      const resp = await provider.connect();
      const buyerPubkey = resp.publicKey.toString();

      const postRes = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ account: buyerPubkey }),
      });
      
      const postData = await postRes.json();
      if (postData.error) throw new Error(postData.error);

      const txBuffer = base64ToUint8Array(postData.transaction);
      const transaction = Transaction.from(txBuffer);
      
      const { signature } = await provider.signAndSendTransaction(transaction);
      
      setSignature(signature);
      setTxStatus("success");

    } catch (error) {
      console.error("Transaction Error:", error);
      alert("Transaction failed or was canceled.");
      setTxStatus("idle");
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-black text-white flex flex-col md:flex-row font-sans relative">
      
      {/* THE BUYER'S WALLET SELECTION MODAL */}
      {showWalletModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#1C1D22] border border-neutral-800 w-full max-w-[400px] rounded-3xl p-6 relative shadow-2xl animate-in fade-in zoom-in duration-200">
            <button onClick={() => setShowWalletModal(false)} className="absolute top-4 right-4 p-2 bg-neutral-800/50 hover:bg-neutral-800 rounded-full text-neutral-400 transition-colors">
              <X className="w-5 h-5" />
            </button>
            
            <h2 className="text-2xl font-bold text-center text-white mb-8 mt-4 px-4 leading-tight">
              Select wallet to complete purchase
            </h2>

            <div className="space-y-2">
              {detectedWallets.length === 0 ? (
                <div className="text-center p-4 text-neutral-500">No wallets detected. Please install Phantom or Backpack.</div>
              ) : (
                detectedWallets.map((wallet) => (
                  <button 
                    key={wallet.name}
                    onClick={() => executeTransaction(wallet)}
                    className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-neutral-800/50 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-lg ${wallet.iconColor} flex items-center justify-center shadow-inner`}>
                        <Wallet className={`w-4 h-4 ${wallet.name === 'OKX Wallet' ? 'text-black' : 'text-white'}`} />
                      </div>
                      <span className="font-bold text-white text-lg">{wallet.name}</span>
                    </div>
                    <span className="text-sm font-medium text-neutral-500 group-hover:text-neutral-400">Detected</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* LEFT SIDEBAR: THE CONTROL PANEL */}
      <div className="w-full md:w-[400px] lg:w-[450px] bg-neutral-950 border-r border-neutral-800 p-8 flex flex-col pt-12 z-10 shadow-2xl relative">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Zap className="w-3 h-3" /> Developer Sandbox
          </div>
          <h2 className="text-3xl font-bold mb-2 text-white">Native Simulator</h2>
          <p className="text-neutral-400 text-sm leading-relaxed">
            Paste your full Action Link below to test how your Web3 cart will render and process transactions on the timeline.
          </p>
        </div>

        <form onSubmit={loadSimulator} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Action URL</label>
            <input 
              type="text" 
              placeholder="e.g., http://localhost:3000/api/actions/..." 
              value={actionLink}
              onChange={(e) => setActionLink(e.target.value)}
              className="w-full bg-black border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors shadow-inner"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading} 
            className="bg-blue-600 hover:bg-blue-500 text-white w-full py-3 rounded-xl text-sm font-bold disabled:opacity-50 transition-all shadow-lg hover:shadow-blue-500/20"
          >
            {loading ? "Loading Engine..." : "Render Web3 Cart"}
          </button>
        </form>
      </div>

      {/* RIGHT SIDE: THE test TWITTER FEED */}
      <div className="flex-1 bg-black flex justify-center overflow-y-auto">
        <div className="w-full max-w-[600px] border-x border-neutral-800 min-h-screen pt-4 pb-20">
          
          <div className="px-4 pb-3 flex items-center justify-between border-b border-neutral-800">
            <h2 className="text-xl font-bold">For you</h2>
            <div className="w-6 h-6 rounded-full bg-neutral-800"></div>
          </div>

          <div className="p-4 border-b border-neutral-800 flex gap-3 hover:bg-neutral-900/20 transition-colors">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 shrink-0 mt-1"></div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1 text-[15px]">
                <span className="font-bold hover:underline cursor-pointer">Blinkly Creator</span>
                <BadgeCheck className="w-4 h-4 text-blue-400" />
                <span className="text-neutral-500">@blinkly_app · 2m</span>
              </div>
              
              <p className="text-[15px] mt-1 mb-3">
                Just launched my new Web3 product! Grab it below before it sells out. 🚀👇
              </p>

              {/* THE NATIVE BLINK RENDERER */}
              {blinkData ? (
                <div className="rounded-2xl overflow-hidden border border-neutral-700 bg-neutral-900 shadow-xl">
                  <img src={blinkData.icon} alt="Product" className="w-full h-64 object-cover border-b border-neutral-800" />
                  
                  <div className="p-4 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">
                      <Zap className="w-3 h-3 text-blue-400" /> Solana Action
                    </div>
                    <h3 className="text-lg font-bold leading-tight">{blinkData.title}</h3>
                    <p className="text-sm text-neutral-400">{blinkData.description}</p>
                    
                    {txStatus === "success" ? (
                       <div className="bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl p-3 text-center text-sm font-bold">
                         ✅ Transaction Successful!
                         <a href={`https://solscan.io/tx/${signature}?cluster=devnet`} target="_blank" className="block text-xs mt-1 underline hover:text-green-300">
                           View on Solscan
                         </a>
                       </div>
                    ) : (
                      
                      <button 
                        onClick={() => setShowWalletModal(true)}
                        disabled={txStatus === "loading"}
                        className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-neutral-200 transition-colors disabled:opacity-70 flex justify-center items-center"
                      >
                        {txStatus === "loading" ? "Confirming in Wallet..." : blinkData.links.actions[0].label}
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="w-full h-[400px] rounded-2xl border border-neutral-800 bg-neutral-900/50 flex flex-col items-center justify-center text-center p-6">
                  <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center mb-3">
                    <Zap className="w-6 h-6 text-neutral-500" />
                  </div>
                  <span className="text-neutral-400 text-sm font-medium">Ready to test.</span>
                  <span className="text-neutral-500 text-xs mt-1">Paste an action link in the sidebar to render it here.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}