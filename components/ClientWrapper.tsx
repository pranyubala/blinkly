"use client";

import { createContext, useContext, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wallet, LogOut, X, ChevronDown, Copy, RefreshCw } from "lucide-react";

const WalletContext = createContext<any>(null);
export const useWallet = () => useContext(WalletContext);

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [activeProvider, setActiveProvider] = useState<any>(null);
  const [detectedWallets, setDetectedWallets] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // 1. Detect Wallets on Load
  useEffect(() => {
    const saved = localStorage.getItem("blinkly_wallet");
    if (saved) setWalletAddress(saved);

    // Scan the browser for installed extensions
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

  // 2. Connect Specific Wallet
  const connectSpecificWallet = async (wallet: any) => {
    try {
      const resp = await wallet.provider.connect();
      const pubkey = resp.publicKey.toString();
      
      setWalletAddress(pubkey);
      setActiveProvider(wallet.provider);
      localStorage.setItem("blinkly_wallet", pubkey);
      setShowModal(false); // Close modal on success
    } catch (error: any) {
      console.error("Connection error:", error);
      alert(error.message || "Connection rejected.");
    }
  };

  // 3. Dropdown Actions
  const copyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      alert("Address copied!");
      setShowDropdown(false);
    }
  };

  const changeWallet = () => {
    disconnectWallet();
    setShowDropdown(false);
    setShowModal(true);
  };

  const disconnectWallet = async () => {
    try {
      if (activeProvider && activeProvider.disconnect) {
        await activeProvider.disconnect();
      }
    } catch (error) {
      console.error("Disconnection error:", error);
    } finally {
      setWalletAddress(null);
      setActiveProvider(null);
      localStorage.removeItem("blinkly_wallet");
      setShowDropdown(false);
    }
  };

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const navHeight = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - navHeight;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  return (
    <WalletContext.Provider value={{ walletAddress, connectWallet: () => setShowModal(true) }}>
      
      {/* THE WALLET MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#1C1D22] border border-neutral-800 w-full max-w-[400px] rounded-3xl p-6 relative shadow-2xl animate-in fade-in zoom-in duration-200">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 p-2 bg-neutral-800/50 hover:bg-neutral-800 rounded-full text-neutral-400 transition-colors">
              <X className="w-5 h-5" />
            </button>
            
            <h2 className="text-2xl font-bold text-center text-white mb-8 mt-4 px-4 leading-tight">
              Connect a wallet on Solana to continue
            </h2>

            <div className="space-y-2">
              {detectedWallets.length === 0 ? (
                <div className="text-center p-4 text-neutral-500">No wallets detected. Please install Phantom.</div>
              ) : (
                detectedWallets.map((wallet) => (
                  <button 
                    key={wallet.name}
                    onClick={() => connectSpecificWallet(wallet)}
                    className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-neutral-800/50 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-lg ${wallet.iconColor} flex items-center justify-center shadow-inner`}>
                        {/* Generic icon placeholder - relying on colors to match brands */}
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

      {/* NAVBAR */}
      <nav className="border-b border-neutral-900 bg-neutral-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight hover:opacity-80 transition-opacity text-white">
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-pink-500 to-orange-500"></div>
            Blinkly
          </Link>
          
          <div className="flex items-center gap-6 text-sm font-medium">
            
            {/* Contextual Links */}
            {isLandingPage ? (
              <>
                <a href="#home" onClick={(e) => handleSmoothScroll(e, 'home')} className="hidden md:block text-neutral-400 hover:text-white transition-colors cursor-pointer">Home</a>
                <a href="#how-it-works" onClick={(e) => handleSmoothScroll(e, 'how-it-works')} className="hidden md:block text-neutral-400 hover:text-white transition-colors cursor-pointer">How it Works</a>
                <a href="#features" onClick={(e) => handleSmoothScroll(e, 'features')} className="hidden md:block text-neutral-400 hover:text-white transition-colors cursor-pointer">Features</a>
                <a href="#faq" onClick={(e) => handleSmoothScroll(e, 'faq')} className="hidden md:block text-neutral-400 hover:text-white transition-colors cursor-pointer">FAQ</a>
              </>
            ) : (
              <>
                <Link href="/dashboard" className="text-neutral-400 hover:text-white transition-colors">Dashboard</Link>
                <Link href="/dashboard/create" className="text-neutral-400 hover:text-white transition-colors">Create</Link>
                <Link href="/preview" className="text-neutral-400 hover:text-white transition-colors flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Simulator
                </Link>
              </>
            )}

            {/* THE CONNECTED BUTTON & DROPDOWN */}
            {walletAddress ? (
              <div className="relative">
                
                {showDropdown && (
                  <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)}></div>
                )}

                {/* Connected Button */}
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="relative z-50 flex items-center gap-2 bg-[#23242B] hover:bg-[#2A2B32] border border-neutral-800 text-white px-4 py-2 rounded-xl transition-all"
                >
                  <div className="w-5 h-5 rounded bg-purple-500 flex items-center justify-center">
                    <Wallet className="w-3 h-3 text-white" />
                  </div>
                  <span className="font-bold text-[15px]">
                    {walletAddress.substring(0, 4)}..{walletAddress.substring(walletAddress.length - 4)}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#23242B] border border-neutral-800 rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <button onClick={copyAddress} className="w-full text-left px-4 py-3 text-[15px] font-bold text-white hover:bg-neutral-800 flex items-center gap-3">
                      <Copy className="w-4 h-4 text-neutral-400" /> Copy address
                    </button>
                    <button onClick={changeWallet} className="w-full text-left px-4 py-3 text-[15px] font-bold text-white hover:bg-neutral-800 flex items-center gap-3">
                      <RefreshCw className="w-4 h-4 text-neutral-400" /> Change wallet
                    </button>
                    <div className="h-px bg-neutral-800 my-1"></div>
                    <button onClick={disconnectWallet} className="w-full text-left px-4 py-3 text-[15px] font-bold text-white hover:bg-neutral-800 flex items-center gap-3">
                      <LogOut className="w-4 h-4 text-neutral-400" /> Disconnect
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={() => setShowModal(true)} 
                className="bg-neutral-800 hover:bg-neutral-700 text-white px-5 py-2.5 rounded-full font-bold transition-colors flex items-center gap-2"
              >
                <div className="w-4 h-4 rounded-full bg-blue-500"></div> Connect
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {children}
      </main>
    </WalletContext.Provider>
  );
}