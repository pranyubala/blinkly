"use client";

import { useEffect, useState, Fragment } from "react";
import { supabase } from "../lib/supabase";   
import { Copy, Activity, ArrowRightLeft, Zap, PlayCircle, Eye, MousePointerClick, Coins, Wallet } from "lucide-react";
import Link from "next/link";
import { useWallet } from "@/components/ClientWrapper";

export default function Dashboard() {
  const { walletAddress } = useWallet(); 
  
  // Data State
  const [items, setItems] = useState<any[]>([]);
  const [stats, setStats] = useState({ views: 0, clicks: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);
  const [baseUrl, setBaseUrl] = useState("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; 

  // Calculate Pagination Data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(items.length / itemsPerPage);

  useEffect(() => {
    setBaseUrl(window.location.origin);
    if (walletAddress) {
      fetchDashboardData();
    } else {
      setLoading(false); 
    }
  }, [walletAddress]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const { data: blinks } = await supabase.from("blinks").select("*").eq("creator_wallet", walletAddress);
      const { data: campaigns } = await supabase.from("campaigns").select("*").eq("creator_wallet", walletAddress).order("created_at", { ascending: false });

      let totalViews = 0;
      let totalClicks = 0;
      let totalRevenue = 0;

      blinks?.forEach(b => {
        totalViews += b.views || 0;
        totalClicks += b.clicks || 0;
        totalRevenue += (b.clicks || 0) * (b.price_sol || 0);
      });

      setStats({ views: totalViews, clicks: totalClicks, revenue: totalRevenue });

      const campaignBlinkIds = new Set();
      const enrichedCampaigns = campaigns?.map(camp => {
        campaignBlinkIds.add(camp.variant_a_id);
        campaignBlinkIds.add(camp.variant_b_id);
        
        const varA = blinks?.find(b => b.id === camp.variant_a_id);
        const varB = blinks?.find(b => b.id === camp.variant_b_id);
        
        const campViews = (varA?.views || 0) + (varB?.views || 0);
        const campClicks = (varA?.clicks || 0) + (varB?.clicks || 0);
        const campRevenue = ((varA?.clicks || 0) * (varA?.price_sol || 0)) + ((varB?.clicks || 0) * (varB?.price_sol || 0));

        return { 
          ...camp, type: "A/B Campaign", 
          views: campViews, 
          clicks: campClicks, 
          revenue: campRevenue, 
          created_at: camp.created_at,
          is_stopped: camp.is_stopped,
          varA: {
            title: varA?.title || "Variant A",
            views: varA?.views || 0,
            clicks: varA?.clicks || 0,
            revenue: (varA?.clicks || 0) * (varA?.price_sol || 0)
          },
          varB: {
            title: varB?.title || "Variant B",
            views: varB?.views || 0,
            clicks: varB?.clicks || 0,
            revenue: (varB?.clicks || 0) * (varB?.price_sol || 0)
          }
        };
      }) || [];

      const enrichedStandard = blinks?.filter(b => !campaignBlinkIds.has(b.id)).map(b => {
        return { 
          id: b.id, name: b.title, type: "Standard Blink", 
          views: b.views || 0, clicks: b.clicks || 0, 
          revenue: (b.clicks || 0) * (b.price_sol || 0), 
          created_at: b.created_at,
          is_stopped: b.is_stopped
        };
      }) || [];

      setItems([...enrichedCampaigns, ...enrichedStandard].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    alert("Action Link copied to clipboard!");
  };

  const handleStop = async (id: string, type: string) => {
    const confirm = window.confirm(`Stop this ${type}? The Twitter link will immediately become invalid, but your stats will be saved.`);
    if (!confirm) return;

    try {
      if (type === "A/B Campaign") {
        await supabase.from("campaigns").update({ is_stopped: true }).eq("id", id);
      } else {
        await supabase.from("blinks").update({ is_stopped: true }).eq("id", id);
      }
      
      setItems(items.map(item => 
        item.id === id ? { ...item, is_stopped: true } : item
      ));
      
    } catch (error) {
      alert("Failed to stop campaign.");
      console.error(error);
    }
  };

  if (!walletAddress) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6 text-center pb-32">
        <div className="w-20 h-20 bg-neutral-900 border border-neutral-800 rounded-3xl flex items-center justify-center mb-6 shadow-2xl">
          <Wallet className="w-10 h-10 text-neutral-500" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-3">Authentication Required</h2>
        <p className="text-neutral-400 mb-8 max-w-md">Connect your Solana wallet to access your creator dashboard, track analytics, and manage campaigns.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6 pt-12 pb-24 font-sans">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* TOP HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold inline-flex items-center gap-3">
              <Activity className="w-8 h-8 text-green-400" /> Dashboard
            </h1>
            <p className="text-neutral-400 mt-2">Live tracking and revenue analytics.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard/create" className="bg-neutral-800 hover:bg-neutral-700 px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-colors">
              <Zap className="w-4 h-4 text-blue-400" /> Standard
            </Link>
            <Link href="/api/campaigns/create" className="bg-gradient-to-r from-pink-600 to-orange-500 hover:opacity-90 px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all">
              <ArrowRightLeft className="w-4 h-4" /> A/B Test
            </Link>
          </div>
        </div>

        {/* GLOBAL STATS WIDGETS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 text-neutral-400 mb-2 font-medium">
              <Eye className="w-5 h-5 text-blue-400" /> Total Views
            </div>
            <div className="text-4xl font-bold">{stats.views}</div>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 text-neutral-400 mb-2 font-medium">
              <MousePointerClick className="w-5 h-5 text-pink-400" /> Total Sales
            </div>
            <div className="text-4xl font-bold">{stats.clicks}</div>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-lg relative overflow-hidden">
            <div className="absolute -right-4 -top-4 text-green-500/10"><Coins className="w-32 h-32" /></div>
            <div className="flex items-center gap-3 text-neutral-400 mb-2 font-medium relative z-10">
              <Coins className="w-5 h-5 text-green-400" /> Total Revenue
            </div>
            <div className="text-4xl font-bold text-green-400 relative z-10">{stats.revenue.toFixed(3)} <span className="text-lg text-green-500/50">SOL</span></div>
          </div>
        </div>

        {/* LIVE TRACKING TABLE */}
        {loading ? (
          <div className="text-center py-20 text-neutral-500 animate-pulse">Syncing on-chain data...</div>
        ) : (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-950/50 border-b border-neutral-800 text-xs uppercase tracking-wider text-neutral-500">
                    <th className="p-4 font-bold">Product / Campaign</th>
                    <th className="p-4 font-bold text-center">Type</th>
                    <th className="p-4 font-bold text-center">Status</th>
                    <th className="p-4 font-bold text-center">Views</th>
                    <th className="p-4 font-bold text-center">Sales</th>
                    <th className="p-4 font-bold text-right">Revenue (SOL)</th>
                    <th className="p-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/50">
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-neutral-500">No active links found. Start creating!</td>
                    </tr>
                  ) : (
                    currentItems.map((item) => {
                      const isCamp = item.type === "A/B Campaign";
                      const actionUrl = isCamp ? `${baseUrl}/api/campaigns/${item.id}` : `${baseUrl}/api/actions/${item.id}`;
                      
                      return (
                        <Fragment key={item.id}>

                          {/* MAIN ROW */}
                          <tr className="hover:bg-neutral-800/30 transition-colors group">
                            <td className="p-4">
                              <div className="font-bold text-white mb-1">{item.name || "Unnamed"}</div>
                              <div className="text-xs text-neutral-500 font-mono">ID: {item.id.substring(0, 8)}...</div>
                            </td>
                            <td className="p-4 text-center">
                              <span className={`text-xs font-bold px-2 py-1 rounded-md ${isCamp ? 'bg-pink-500/10 text-pink-400' : 'bg-blue-500/10 text-blue-400'}`}>
                                {item.type}
                              </span>
                            </td>
                            <td className="p-4 text-center">
                              {item.is_stopped ? (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 tracking-wider">
                                  STOPPED
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 tracking-wider inline-flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                                  ACTIVE
                                </span>
                              )}
                            </td>
                            <td className="p-4 text-center font-medium text-neutral-300">{item.views}</td>
                            <td className="p-4 text-center font-medium text-neutral-300">{item.clicks}</td>
                            <td className="p-4 text-right font-bold text-green-400">+{item.revenue.toFixed(3)}</td>
                            <td className="p-4 text-right">
                              <div className="flex justify-end items-center gap-2">
                                <button 
                                  onClick={() => !item.is_stopped && handleStop(item.id, item.type)} 
                                  className={`p-2 rounded-lg transition-colors flex justify-center items-center min-w-[56px] ${
                                    item.is_stopped 
                                      ? 'invisible pointer-events-none' 
                                      : 'bg-neutral-800 hover:bg-yellow-500/20 text-neutral-400 hover:text-yellow-500 opacity-0 group-hover:opacity-100'
                                  }`} 
                                  title="Stop Campaign"
                                >
                                  <span className="text-xs font-bold">STOP</span>
                                </button>
                                <button onClick={() => copyToClipboard(actionUrl)} className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-neutral-400 hover:text-white transition-colors" title="Copy Link">
                                  <Copy className="w-4 h-4" />
                                </button>
                                <Link href="/preview" className="p-2 bg-neutral-800 hover:bg-pink-600/20 rounded-lg text-neutral-400 hover:text-pink-400 transition-colors" title="Test in Simulator">
                                  <PlayCircle className="w-4 h-4" />
                                </Link>
                              </div>
                            </td>
                          </tr>

                          {/*  A/B SPLIT COMPARISON SUB-ROW */}
                          {isCamp && (
                            <tr className="bg-neutral-950/30 border-b border-neutral-800">
                              <td colSpan={7} className="p-4 pt-0">
                                <div className="flex flex-col md:flex-row gap-4 items-center pl-0 md:pl-8 text-sm w-full mt-2">
                                  
                                  {/* Variant A Stats */}
                                  <div className="flex-1 w-full bg-purple-500/5 border border-purple-500/20 p-3 rounded-xl flex flex-col md:flex-row justify-between items-center gap-2">
                                    <span className="text-purple-400 font-bold text-xs uppercase tracking-wider">{item.varA.title}</span>
                                    <div className="flex gap-4 text-neutral-400 text-xs font-medium">
                                      <span>👁️ {item.varA.views}</span>
                                      <span>🖱️ {item.varA.clicks}</span>
                                      <span className="text-purple-400 font-bold">+{item.varA.revenue.toFixed(3)}</span>
                                    </div>
                                  </div>

                                  <div className="text-neutral-700 font-bold text-xs italic">VS</div>

                                  {/* Variant B Stats */}
                                  <div className="flex-1 w-full bg-orange-500/5 border border-orange-500/20 p-3 rounded-xl flex flex-col md:flex-row justify-between items-center gap-2">
                                    <span className="text-orange-400 font-bold text-xs uppercase tracking-wider">{item.varB.title}</span>
                                    <div className="flex gap-4 text-neutral-400 text-xs font-medium">
                                      <span>👁️ {item.varB.views}</span>
                                      <span>🖱️ {item.varB.clicks}</span>
                                      <span className="text-orange-400 font-bold">+{item.varB.revenue.toFixed(3)}</span>
                                    </div>
                                  </div>

                                </div>
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* THE PAGINATION FOOTER */}
            {totalPages > 1 && (
              <div className="bg-neutral-950/50 border-t border-neutral-800 p-4 flex justify-between items-center">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-white disabled:opacity-30 transition-all text-sm font-bold flex items-center gap-2"
                >
                  ← Previous
                </button>
                
                <span className="text-neutral-400 text-sm font-medium">
                  Page <span className="text-white">{currentPage}</span> of {totalPages}
                </span>
                
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-white disabled:opacity-30 transition-all text-sm font-bold flex items-center gap-2"
                >
                  Next →
                </button>
              </div>
            )}
            
          </div>
        )}
      </div>
    </div>
  );
}