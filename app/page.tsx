import Link from "next/link";
import { ArrowRight, Wallet, Upload, Link as LinkIcon, Share2, ArrowRightLeft, PlayCircle, Activity } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-pink-500/30">
      
      {/*HERO SECTION */}
      <section id="home" className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-pink-500/20 to-orange-500/20 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Solana Devnet Ready
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
            The No-Code Blink Studio <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-400">for Solana Creators</span>
          </h1>
          
          <p className="text-xl text-neutral-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Launch single products or split-test prices with our A/B campaign engine. Create, preview, and track your Solana Actions without writing a single line of code.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard" className="w-full sm:w-auto bg-white text-black px-8 py-4 rounded-xl font-bold text-lg hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2">
              Launch App <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/preview" className="w-full sm:w-auto bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2">
              Try the Simulator
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-24 bg-black border-y border-neutral-900 relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">How It Works</h2>
            <p className="text-neutral-500 mt-2">From concept to sales in under 60 seconds.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
           
            <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-neutral-800 via-neutral-700 to-neutral-800 -translate-y-1/2 z-0"></div>

            <div className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:border-blue-500 transition-all shadow-xl">
                <Wallet className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="font-bold text-lg mb-1">Step 1</h3>
              <p className="text-sm text-neutral-400">Connect your wallet</p>
            </div>

           
            <div className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:border-pink-500 transition-all shadow-xl">
                <Upload className="w-8 h-8 text-pink-400" />
              </div>
              <h3 className="font-bold text-lg mb-1">Step 2</h3>
              <p className="text-sm text-neutral-400">Upload product + set price</p>
            </div>

          
            <div className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:border-green-500 transition-all shadow-xl">
                <LinkIcon className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="font-bold text-lg mb-1">Step 3</h3>
              <p className="text-sm text-neutral-400">Get your Blink URL</p>
            </div>

          
            <div className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neutral-800 to-neutral-900 border border-neutral-700 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:border-orange-500 transition-all shadow-2xl">
                <Share2 className="w-8 h-8 text-orange-400" />
              </div>
              <h3 className="font-bold text-lg mb-1">Step 4</h3>
              <p className="text-sm text-neutral-400">Post on Twitter → Sell</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-24 bg-neutral-950">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-3xl hover:border-pink-500/30 transition-colors">
              <div className="w-12 h-12 bg-pink-500/10 rounded-xl flex items-center justify-center mb-6">
                <ArrowRightLeft className="w-6 h-6 text-pink-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Smart A/B Routing</h3>
              <p className="text-neutral-400 leading-relaxed">
                Stop guessing. Upload two images, set two different prices, and let our engine automatically split your traffic 50/50 to see what converts best.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-3xl hover:border-blue-500/30 transition-colors">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6">
                <PlayCircle className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Native Engine</h3>
              <p className="text-neutral-400 leading-relaxed">
                Preview your Blink exactly as your audience sees it on Twitter — no third-party tools required. Fully integrated with all major 
Solana wallet extensions.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-3xl hover:border-green-500/30 transition-colors">
              <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-6">
                <Activity className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Live Analytics</h3>
              <p className="text-neutral-400 leading-relaxed">
                Track your success in real-time. Our dashboard automatically tallies your views, sales, and total SOL revenue across all active campaigns.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/*  FAQ SECTION */}
      <section id="faq" className="py-24 bg-black border-t border-neutral-900">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl">
              <h4 className="font-bold text-lg mb-2 text-white">How does the 50/50 A/B split work?</h4>
              <p className="text-neutral-400">Our server physically flips a coin the millisecond a user clicks your link on Twitter. The user has no idea a test is happening—they just see the variant they were assigned, ensuring perfectly clean data.</p>
            </div>
            
            <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl">
              <h4 className="font-bold text-lg mb-2 text-white">What wallets are supported?</h4>
              <p className="text-neutral-400">Because our Blinks strictly follow the official Solana Actions standard, they work natively with Phantom, Backpack, Solflare, and OKX Web3 wallets right out of the box.</p>
            </div>
            
            <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl">
              <h4 className="font-bold text-lg mb-2 text-white">Do I need to pay to generate a Blink?</h4>
              <p className="text-neutral-400">No. Generating Standard Blinks and A/B Campaigns is 100% free. The only fees are standard Solana network gas fees when your buyer actually executes a transaction.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-900 bg-neutral-950 py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-pink-500 to-orange-500"></div>
            Blinkly
          </div>
          <p className="text-neutral-500 text-sm">© 2026 Blinkly. Built on Solana.</p>
        </div>
      </footer>

    </div>
  );
}