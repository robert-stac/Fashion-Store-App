import { useState } from "react";
import { useInventory } from "../context/InventoryContext";
import { 
  ShoppingBag, TrendingUp, Package, ArrowUpRight, 
  Wallet, AlertTriangle, Sparkles, Target, 
  Send, X, Bot, Loader2 
} from "lucide-react";

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAI, getGenerativeModel, VertexAIBackend } from "firebase/ai";

const firebaseConfig = {
  apiKey: "AIzaSyBtgtp4EtTVXedAa1ZwI_Q0Jp08eS9h8WE",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const ai = getAI(app, { backend: new VertexAIBackend() });
const model = getGenerativeModel(ai, { model: "gemini-1.5-flash" });



export default function Dashboard() {
  const { products, orders, expenses } = useInventory();

  // --- STATE FOR AI CHAT ---
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // --- BASIC STATS ---
  const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);
  const totalStock = products.reduce((acc, prod) => acc + prod.quantity, 0);
  const totalExpenses = expenses.reduce((acc, ex) => acc + ex.amount, 0);

  // --- REFINED PROFIT CALCULATIONS ---
  const grossProfit = orders.reduce((acc, order) => {
    const product = products.find(
      (p) => p.name.trim().toLowerCase() === order.productName.trim().toLowerCase()
    );
    let costOfThisOrder = product ? product.costPrice * order.quantity : order.totalAmount * 0.3;
    return acc + (order.totalAmount - costOfThisOrder);
  }, 0);

  const netProfit = grossProfit - totalExpenses;

  // --- SMART SUMMARY LOGIC ---
  const getTopProduct = () => {
    if (orders.length === 0) return "No sales yet";
    const counts: Record<string, number> = {};
    orders.forEach(o => counts[o.productName] = (counts[o.productName] || 0) + o.quantity);
    return Object.entries(counts).reduce((a, b) => (a[1] > b[1] ? a : b))[0];
  };
  const getMajorExpense = () => {
    if (expenses.length === 0) return "No expenses";
    const cats: Record<string, number> = {};
    expenses.forEach(e => cats[e.category] = (cats[e.category] || 0) + e.amount);
    return Object.entries(cats).reduce((a, b) => (a[1] > b[1] ? a : b))[0];
  };

  const topProduct = getTopProduct();
  const majorExpense = getMajorExpense();

  // --- 3. REWRITTEN AI HANDLER (FIREBASE SDK) ---
  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setAiResponse(null);

    const contextPrompt = `
      You are an expert business consultant for a boutique in Kampala, Uganda. 
      Use this real-time shop data to answer the user:
      - Revenue: ${totalRevenue.toLocaleString()} UGX
      - Net Profit: ${netProfit.toLocaleString()} UGX
      - Total Expenses: ${totalExpenses.toLocaleString()} UGX
      - Best Selling Product: ${topProduct}
      - Total Items in Stock: ${totalStock}
      
      User Question: "${query}"
      
      Instructions: Be professional, concise (under 50 words), and prioritize the numbers provided.
    `;

    try {
      // Direct call to Firebase Vertex AI
      const result = await model.generateContent(contextPrompt);
      const responseText = result.response.text();
      setAiResponse(responseText);
    } catch (error: any) {
      console.error("AI Error:", error);
      setAiResponse(`⚠️ Setup Issue: Ensure 'Vertex AI for Firebase' is enabled in your Firebase Console. Error: ${error.message}`);
    } finally {
      setIsLoading(false);
      setQuery("");
    }
  };

  // --- UI DATA MAPPING ---
  const stats = [
    { name: "Total Revenue", value: `${totalRevenue.toLocaleString()} UGX`, icon: TrendingUp, color: "text-slate-900", bg: "bg-slate-100" },
    { name: "Net Profit", value: `${netProfit.toLocaleString()} UGX`, icon: ArrowUpRight, color: netProfit < 0 ? "text-red-600" : "text-emerald-600", bg: netProfit < 0 ? "bg-red-50" : "bg-emerald-50" },
    { name: "Shop Expenses", value: `${totalExpenses.toLocaleString()} UGX`, icon: Wallet, color: "text-orange-600", bg: "bg-orange-50" },
    { name: "Items in Stock", value: totalStock.toLocaleString(), icon: Package, color: "text-blue-600", bg: "bg-blue-50" },
  ];

  return (
    <div className="relative space-y-6 md:space-y-10 animate-in fade-in duration-700 pb-20 md:pb-0">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-[#0F172A] tracking-tight">Business Overview</h1>
          <p className="text-sm md:text-base text-slate-500 font-medium">Real-time performance tracking for your boutique.</p>
        </div>
        <div className="text-left md:text-right">
          <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">System Status</p>
          <p className="text-xs md:text-sm font-bold text-emerald-500 flex items-center gap-2 md:justify-end">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            Cloud Sync Active
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-5 md:p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <div className={`w-10 h-10 md:w-12 md:h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-3 md:mb-4`}>
              <stat.icon size={20} className="md:w-6 md:h-6" />
            </div>
            <p className="text-[10px] md:text-sm font-bold text-slate-400 uppercase tracking-wider">{stat.name}</p>
            <p className={`text-lg md:text-2xl font-black mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 space-y-6">
          
          {/* SMART AI SUMMARY CARD */}
          <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-orange-400/20 rounded-lg"><Sparkles size={20} className="text-orange-400" /></div>
                <h2 className="text-lg font-bold">AI Smart Summary</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 p-2 bg-white/5 rounded-lg text-emerald-400"><Target size={16}/></div>
                  <div>
                    <p className="text-white/50 text-xs font-bold uppercase tracking-widest">Top Performer</p>
                    <p className="font-bold text-sm md:text-base">Your best selling item is <span className="text-emerald-400">{topProduct}</span>.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 p-2 bg-white/5 rounded-lg text-orange-400"><Wallet size={16}/></div>
                  <div>
                    <p className="text-white/50 text-xs font-bold uppercase tracking-widest">Expense Insight</p>
                    <p className="font-bold text-sm md:text-base">Most revenue is consumed by <span className="text-orange-400">{majorExpense}</span>.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-400/10 blur-[60px] rounded-full -mr-10 -mt-10"></div>
          </div>

          {/* Recent Orders List */}
          <div className="bg-white rounded-3xl border border-slate-100 p-5 md:p-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg md:text-xl font-bold text-[#0F172A]">Recent Orders</h2>
              <span className="text-[10px] font-bold bg-slate-100 px-3 py-1 rounded-full text-slate-500 uppercase">Last 5 Sales</span>
            </div>
            <div className="space-y-3 md:space-y-4">
              {orders.slice(-5).reverse().map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 md:p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
                      <ShoppingBag size={16} className="text-slate-400 md:w-[18px] md:h-[18px]" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-[#0F172A] text-sm md:text-base truncate">{order.productName}</p>
                      <p className="text-[10px] md:text-xs text-slate-500">{order.date}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-black text-[#0F172A] text-sm md:text-base">{order.totalAmount.toLocaleString()} UGX</p>
                    <p className="text-[9px] md:text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Paid</p>
                  </div>
                </div>
              ))}
              {orders.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-slate-400 text-sm italic">No sales recorded yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Efficiency & Alerts */}
        <div className="space-y-4 md:space-y-6">
          <div className="bg-[#0F172A] rounded-3xl p-6 md:p-8 text-white shadow-xl">
            <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6">Efficiency</h2>
            <div className="space-y-4 md:space-y-6">
              <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                <p className="text-white/60 text-xs md:text-sm mb-1">Gross Margin</p>
                <p className="text-xl md:text-2xl font-black text-emerald-400">{totalRevenue > 0 ? ((grossProfit / totalRevenue) * 100).toFixed(1) : 0}%</p>
              </div>
              <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                <p className="text-white/60 text-xs md:text-sm mb-1">Expense Ratio</p>
                <p className="text-xl md:text-2xl font-black text-orange-400">{totalRevenue > 0 ? ((totalExpenses / totalRevenue) * 100).toFixed(1) : 0}%</p>
              </div>
            </div>
          </div>
          {products.some(p => p.quantity < 3) && (
            <div className="bg-red-50 border border-red-100 rounded-3xl p-5 md:p-6">
              <div className="flex items-center gap-2 md:gap-3 text-red-600 mb-2">
                <AlertTriangle size={18} />
                <p className="font-bold text-sm md:text-base">Inventory Alert</p>
              </div>
              <p className="text-xs md:text-sm text-red-700 leading-relaxed">{products.filter(p => p.quantity < 3).length} items are critically low on stock.</p>
            </div>
          )}
        </div>
      </div>

      {/* --- FLOATING AI ASSISTANT BUTTON --- */}
      <button 
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-24 md:bottom-8 right-6 bg-[#ED985F] text-[#0F172A] p-4 rounded-full shadow-2xl flex items-center gap-2 hover:scale-105 transition-all z-40 border-4 border-white"
      >
        <Sparkles size={24} />
        <span className="hidden md:inline font-bold">Ask Assistant</span>
      </button>

      {/* --- AI CHAT INTERFACE --- */}
      {isChatOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end md:items-center justify-end md:pr-6 md:pb-6">
          <div className="bg-white w-full md:w-[400px] h-[500px] md:rounded-3xl rounded-t-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
            <div className="bg-[#0F172A] p-6 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-400/20 rounded-lg"><Bot size={20} className="text-orange-400" /></div>
                <div>
                  <h3 className="font-bold">Shop Assistant</h3>
                  <p className="text-[10px] text-white/50 tracking-widest uppercase">Powered by Gemini</p>
                </div>
              </div>
              <button onClick={() => {setIsChatOpen(false); setAiResponse(null);}} className="p-2 hover:bg-white/10 rounded-full"><X size={20} /></button>
            </div>
            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50">
              <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 text-sm text-slate-600">
                I can analyze your business data. Ask me anything!
              </div>
              {isLoading && (
                 <div className="flex justify-center p-4">
                   <Loader2 className="animate-spin text-orange-400" size={24} />
                 </div>
              )}
              {aiResponse && (
                <div className="bg-orange-50 p-4 rounded-2xl rounded-tr-none border border-orange-100 text-sm font-bold text-[#0F172A] animate-in fade-in zoom-in-95 leading-relaxed">
                  {aiResponse}
                </div>
              )}
            </div>
            <form onSubmit={handleAskAI} className="p-4 bg-white border-t flex gap-2">
              <input 
                autoFocus
                value={query} 
                onChange={(e) => setQuery(e.target.value)} 
                placeholder="How can I improve profit?" 
                className="flex-1 bg-slate-100 p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#ED985F]" 
              />
              <button type="submit" disabled={isLoading} className="bg-[#0F172A] text-white p-3 rounded-xl hover:bg-slate-800 disabled:opacity-50">
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}