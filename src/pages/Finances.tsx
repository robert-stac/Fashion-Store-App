import { useState } from "react";
import { useInventory, type StockPurchase, type Withdrawal, type CapitalInjection } from "../context/InventoryContext";
import { ShoppingCart, User, Landmark, Plus, History, Banknote, Coins, Package, TrendingUp } from "lucide-react";

export default function Finances() {
  const { 
    orders, products, expenses, stockPurchases, addStockPurchase, 
    withdrawals, addWithdrawal, injections, addInjection 
  } = useInventory();
  
  // Form States
  const [purchaseAmount, setPurchaseAmount] = useState("");
  const [purchaseDesc, setPurchaseDesc] = useState("");
  const [drawAmount, setDrawAmount] = useState("");
  const [drawNote, setDrawNote] = useState("");
  const [injectAmount, setInjectAmount] = useState("");
  const [injectSource, setInjectSource] = useState("");

  // --- MATH LOGIC ---
  const totalRevenue = orders.reduce((acc, o) => acc + o.totalAmount, 0);
  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);
  const totalStockSpend = stockPurchases.reduce((acc, s) => acc + s.amount, 0);
  const totalWithdrawn = withdrawals.reduce((acc, w) => acc + w.amount, 0);
  const totalInjected = injections.reduce((acc, i) => acc + i.amount, 0);

  const grossProfit = orders.reduce((acc, order) => {
    const product = products.find(p => p.name === order.productName);
    const cost = product ? product.costPrice : (order.totalAmount / order.quantity) * 0.6;
    return acc + (order.totalAmount - (cost * order.quantity));
  }, 0);

  const netProfit = grossProfit - totalExpenses;
  const personalBalance = netProfit - totalWithdrawn;

  // Capital Logic: (Revenue - Profit) + Fresh Capital - Money Spent on Stock
  const capitalToReplenish = (totalRevenue - grossProfit) + totalInjected;
  const currentCapitalBalance = capitalToReplenish - totalStockSpend;

  // --- BUSINESS VALUATION ---
  const inventoryAssetValue = products.reduce((acc, p) => acc + (p.costPrice * p.quantity), 0);
  const inventoryRetailValue = products.reduce((acc, p) => acc + (p.sellPrice * p.quantity), 0);
  
  // Total Value = Cash in Buckets + Cost Value of Stock on Racks
  const totalBusinessValue = currentCapitalBalance + inventoryAssetValue + personalBalance;

  // --- HANDLERS ---
  const handleInject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!injectAmount) return;
    addInjection({
      id: Date.now().toString(),
      amount: Number(injectAmount),
      source: injectSource || "Owner Contribution",
      date: new Date().toLocaleDateString(),
    });
    setInjectAmount(""); setInjectSource("");
  };

  const handleRestock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!purchaseAmount) return;
    addStockPurchase({
      id: Date.now().toString(),
      description: purchaseDesc || "Restock",
      amount: Number(purchaseAmount),
      date: new Date().toLocaleDateString(),
    });
    setPurchaseAmount(""); setPurchaseDesc("");
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (!drawAmount || Number(drawAmount) > personalBalance) {
      alert("Insufficient profit balance!");
      return;
    }
    addWithdrawal({
      id: Date.now().toString(),
      amount: Number(drawAmount),
      date: new Date().toLocaleDateString(),
      note: drawNote || "Personal Use",
    });
    setDrawAmount(""); setDrawNote("");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Financial Management</h1>
          <p className="text-slate-500 font-medium">Manage capital, stock investments, and personal withdrawals.</p>
        </div>
        <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-[2px] rounded-3xl shadow-xl shadow-blue-100">
          <div className="bg-white/10 backdrop-blur-md px-8 py-4 rounded-[22px] border border-white/20">
            <p className="text-[10px] font-bold text-blue-100 uppercase tracking-widest mb-1 text-center">Total Boutique Value</p>
            <p className="text-2xl font-black text-white">{totalBusinessValue.toLocaleString()} UGX</p>
          </div>
        </div>
      </header>

      {/* VALUATION & BUCKETS SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Stock (Cost Value)</p>
          <div className="flex items-center gap-3">
            <Package size={20} className="text-slate-400" />
            <p className="text-xl font-black text-slate-900">{inventoryAssetValue.toLocaleString()} UGX</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Expected Revenue</p>
          <div className="flex items-center gap-3">
            <TrendingUp size={20} className="text-emerald-500" />
            <p className="text-xl font-black text-emerald-600">{inventoryRetailValue.toLocaleString()} UGX</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border-2 border-blue-50 shadow-sm">
          <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">Buying Power</p>
          <div className="flex items-center gap-3">
            <Landmark size={20} className="text-blue-600" />
            <p className="text-xl font-black text-blue-600">{currentCapitalBalance.toLocaleString()} UGX</p>
          </div>
        </div>
        <div className="bg-[#0F172A] p-6 rounded-3xl shadow-lg">
          <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-1">Your Salary Balance</p>
          <div className="flex items-center gap-3">
            <User size={20} className="text-emerald-400" />
            <p className="text-xl font-black text-emerald-400">{personalBalance.toLocaleString()} UGX</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ACTION FORMS */}
        <div className="bg-blue-600 p-6 rounded-3xl text-white shadow-lg">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Coins size={20}/> Add Capital</h2>
          <form onSubmit={handleInject} className="space-y-3">
            <input 
              type="number" value={injectAmount} onChange={(e) => setInjectAmount(e.target.value)}
              placeholder="Amount (UGX)" className="w-full p-3 bg-white/10 border border-white/20 rounded-xl outline-none placeholder:text-white/50" 
            />
            <input 
              value={injectSource} onChange={(e) => setInjectSource(e.target.value)}
              placeholder="Source (e.g. Savings)" className="w-full p-3 bg-white/10 border border-white/20 rounded-xl outline-none placeholder:text-white/50" 
            />
            <button className="w-full bg-white text-blue-600 font-black py-3 rounded-xl hover:bg-blue-50">INJECT FUNDS</button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><ShoppingCart size={20} className="text-blue-500"/> Restock</h2>
          <form onSubmit={handleRestock} className="space-y-3">
            <input 
              value={purchaseDesc} onChange={(e) => setPurchaseDesc(e.target.value)}
              placeholder="Items purchased?" className="w-full p-3 bg-slate-50 border rounded-xl outline-none" 
            />
            <input 
              type="number" value={purchaseAmount} onChange={(e) => setPurchaseAmount(e.target.value)}
              placeholder="Total Spent (UGX)" className="w-full p-3 bg-slate-50 border rounded-xl outline-none" 
            />
            <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700">LOG PURCHASE</button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><Banknote size={20} className="text-emerald-500"/> Withdraw</h2>
          <form onSubmit={handleWithdraw} className="space-y-3">
            <input 
              type="number" value={drawAmount} onChange={(e) => setDrawAmount(e.target.value)}
              placeholder="Amount (UGX)" className="w-full p-3 bg-slate-50 border rounded-xl outline-none" 
            />
            <input 
              value={drawNote} onChange={(e) => setDrawNote(e.target.value)}
              placeholder="Reason for withdrawal?" className="w-full p-3 bg-slate-50 border rounded-xl outline-none" 
            />
            <button className="w-full bg-emerald-500 text-[#0F172A] font-black py-3 rounded-xl hover:bg-emerald-600">WITHDRAW NOW</button>
          </form>
        </div>
      </div>

      {/* AUDIT TRAIL */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 bg-slate-50 border-b flex justify-between items-center">
          <h2 className="font-bold text-slate-900 flex items-center gap-2"><History size={18}/> Audit Trail</h2>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">All Outflows & Injections</span>
        </div>
        <div className="divide-y max-h-[400px] overflow-y-auto">
          {[...stockPurchases, ...withdrawals, ...injections].sort((a,b) => b.id.localeCompare(a.id)).map(item => {
            const isInjection = 'source' in item;
            const isWithdrawal = 'note' in item;
            return (
              <div key={item.id} className="p-5 flex justify-between items-center hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${isInjection ? 'bg-blue-600 text-white shadow-md shadow-blue-100' : isWithdrawal ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>
                    {isInjection ? <Coins size={18}/> : isWithdrawal ? <User size={18}/> : <ShoppingCart size={18}/>}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">
                      {isInjection ? (item as CapitalInjection).source : isWithdrawal ? (item as Withdrawal).note : (item as StockPurchase).description}
                    </p>
                    <p className="text-xs text-slate-400 font-medium">
                      {item.date} • {isInjection ? 'Capital Injection' : isWithdrawal ? 'Withdrawal' : 'Stock Purchase'}
                    </p>
                  </div>
                </div>
                <p className={`font-black text-lg ${isInjection ? 'text-blue-600' : isWithdrawal ? 'text-emerald-600' : 'text-slate-900'}`}>
                  {isInjection ? '+' : '-'}{item.amount.toLocaleString()} <span className="text-[10px]">UGX</span>
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}