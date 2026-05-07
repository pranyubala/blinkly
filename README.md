# ⚡ Blinkly 

**The First No-Code Blink Studio & A/B Revenue Engine for Solana Creators.**

🎬 Live Demo: https://youtu.be/C3O_9u9GWIc?si=3yycGQEesVXji5yc

🌐 Live App:  https://blinkly-ten.vercel.app/

**🚀 Quick Pitch:** Blinkly is a completely no-code platform that allows Web3 creators to sell digital products and run dynamic A/B pricing tests directly through Solana Blinks. No code, no complexity, just pure on-chain revenue. 

---

## 🛑 The Problem

1. **The Code Barrier:** Building Solana Blinks from scratch requires complex, custom API routes and on-chain transaction knowledge. Non-technical Web3 creators are completely locked out of e-commerce on Twitter/X.
2. **Lost Revenue:** Even when creators manage to launch a product, they have zero infrastructure to split-test their pricing, images, or messaging. They are forced to guess what converts best, leaving massive amounts of pure SOL on the table.

## ✅ The Solution: Blinkly

Blinkly gives anyone the power to launch digital products and run intelligent A/B campaigns in seconds—**without writing a single line of code.** Whether you need a standard product link or an advanced A/B revenue engine, Blinkly handles the dynamic routing, the on-chain execution, and the live analytics from one sleek dashboard.

## 📈 Market Opportunity
* **1M+** Solana Daily Active Users ready to interact with native feed transactions.
* **90%+** of Web3 creators lack the coding skills required to build their own Blinks.
* **0** existing A/B testing infrastructure tools currently exist for the Solana Actions/Blinks ecosystem.


---

## ⚔️ Competitive Advantage

| Feature | Blinkly | Standard Solana Blinks | Web2 E-Commerce (Gumroad/Stripe) |
| :--- | :---: | :---: | :---: |
| **No-Code Setup** | ✅ | ❌ | ✅ |
| **Native A/B Testing** | ✅ | ❌ | ❌ (Off-chain) |
| **100% On-Chain Settlement** | ✅ | ✅ | ❌ |
| **Zero Middleman Fees** | ✅ | ✅ | ❌ |

---

## 🚀 Core Features

* 🛍️ **No-Code Studio:** Upload your digital product, set your price in SOL, and generate a fully compliant Solana Action/Blink instantly.
* ⚖️ **A/B Revenue Engine:** Launch a campaign testing two different prices. Blinkly generates a single, intelligent Smart URL.
* 🔀 **Dynamic Routing:** When buyers interact with your Smart URL on Twitter/X, Blinkly dynamically routes traffic 50/50, displaying Variant A to one buyer and Variant B to the next.
* 📱 **Native Simulator:** Test exactly how your standard and A/B Blinks will look and function using Blinkly's built-in native simulator before pushing them live to your audience.
* ⛓️ **Zero Middlemen (Pure Execution):** Blinkly does not hold your funds. Purchases execute as pure on-chain transactions natively in the user's feed. The digital product unlocks instantly, and 100% of the SOL hits the creator's wallet.
* 📊 **Live Analytics & Control:** Track your exact revenue and conversion rates in real-time. Pause standard links or halt A/B campaigns instantly with a single click.

---

## 🧪 Judge Testing Guidance

To verify the platform's functionality, please follow these steps:

1. **Connect & Create:** Connect your Solana wallet to the dashboard, click "Create Blink," and set up either a Standard Link or an A/B Campaign.
2. **Test Natively:** Click the "Simulator" button in the Blinkly dashboard to instantly test your generated link within our Native Simulator.
3. **Verify Compliance:** Copy your generated Smart URL and paste it into the **[Official Solana Blink Inspector](https://blinks.xyz/inspector)**. You will see the transaction render and execute flawlessly, proving 100% protocol compliance. 

⚠️ **Important Note Regarding Live Twitter/X Testing:** To render Blinks directly on the live, public Twitter/X timeline, a project's domain must be officially reviewed and registered on the Dialect/Solana Actions Mainnet Registry. Because this is a hackathon submission, our domain is not yet on the global whitelist. **Please use the Blinkly Native Simulator or the official Blink Inspector (blinks.xyz/inspector) to test and verify all functionality.**

---

## 🏗️ Technical Architecture

Blinkly is built to perfectly comply with the official Solana Actions protocol. 

1. **The Smart Link Engine:** Our backend identifies incoming GET requests. If the link is an A/B campaign, the server dynamically returns the JSON payload for either Variant A or Variant B based on our 50/50 routing algorithm.
2. **Transaction Building:** When a buyer clicks "Buy", our API constructs a secure Solana transaction returning a serialized, base64-encoded payload.
3. **Database Security:** Built with Supabase (PostgreSQL). We utilize standard Row-Level Security (RLS) policies to ensure public read access for Blinks, while strictly locking write privileges to authenticated creators.

### Tech Stack
* **Frontend:** Next.js 14, Tailwind CSS, shadcn/ui
* **Backend:** Next.js API Routes (Vercel Serverless)
* **Database & Auth:** Supabase (PostgreSQL with RLS)
* **Blockchain:** Solana web3.js & Solana Actions/Blinks SDK

---

## 🗄️ Database Schema
Blinkly utilizes a relational structure to ensure high performance and data integrity:
* `users` - Manages authenticated creator profiles and wallet addresses.
* `campaigns` - Stores parent data for standard and A/B links, including routing logic status.
* `variants` - Holds specific payload data (price, image, title) for Variant A and Variant B.
* `transactions` - Records successful on-chain purchases, linking buyer wallets to specific variants for live dashboard analytics.

---

## 🛠️ Local Development

To run Blinkly locally, follow these steps:

1. Clone the repository:
   git clone [Your GitHub Repo URL]
   cd [Your Repo Folder Name]

2. Install dependencies:
   npm install

3. Set up Environment Variables:
   Create a .env.local file in the root directory and add your Supabase variables:
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

4. Run the development server:
   npm run dev
   
   Open http://localhost:3000 in your browser.

---

## 🗺️ Product Roadmap

* **Phase 1 (MVP - Current):** Core No-Code Studio, Standard Blinks, A/B Revenue Engine, Native Simulator, and real-time dashboard analytics.
* **Phase 2:** SPL Token Support (accept payments in USDC, BONK) and advanced granular analytics (time-of-day conversion, geographic tracking).
* **Phase 3:** Multi-Variant (A/B/C/D) testing capabilities for massive product launches and automated winning-variant selection.
* **Phase 4:** Official Dialect Mainnet Registry approval for out-of-the-box rendering on the live Twitter/X timeline.

---

⚡ Blinkly — No code. No complexity. Just revenue.
