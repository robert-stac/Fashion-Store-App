import { useInventory } from "../context/InventoryContext";
import { ShoppingBag, TrendingUp, Package, ArrowUpRight, Wallet, AlertTriangle } from "lucide-react";

export default function Dashboard() {
  const { products, orders, expenses } = useInventory();

  // --- 1. BASIC STATS ---
  const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);
  const totalStock = products.reduce((acc, prod) => acc + prod.quantity, 0);
  const totalExpenses = expenses.reduce((acc, ex) => acc + ex.amount, 0);

  // --- 2. PROFIT CALCULATIONS ---
  // We calculate Gross Profit: (Price Sold - Cost to Buy)
  const grossProfit = orders.reduce((acc, order) => {
    const product = products.find(p => p.name === order.productName);
    
    // Fallback: If product details are missing, we assume 60% of sale price was cost
    const costPrice = product ? product.costPrice : (order.totalAmount / order.quantity) * 0.6;
    const salePrice = order.totalAmount / order.quantity;
    
    const profitPerUnit = salePrice - costPrice;
    return acc + (profitPerUnit * order.quantity);
  }, 0);

  // Net Profit = (Revenue - Cost of Goods) - Operating Expenses
  const netProfit = grossProfit - totalExpenses;

  // --- 3. UI DATA ---
  const stats = [
    { 
      name: "Total Revenue", 
      value: `${totalRevenue.toLocaleString()} UGX`, 
      icon: TrendingUp, 
      color: "text-slate-900", 
      bg: "bg-slate-100" 
    },
    { 
      name: "Net Profit", 
      value: `${netProfit.toLocaleString()} UGX`, 
      icon: ArrowUpRight, 
      color: netProfit < 0 ? "text-red-600" : "text-emerald-600", 
      bg: netProfit < 0 ? "bg-red-50" : "bg-emerald-50" 
    },
    { 
      name: "Shop Expenses", 
      value: `${totalExpenses.toLocaleString()} UGX`, 
      icon: Wallet, 
      color: "text-orange-600", 
      bg: "bg-orange-50" 
    },
    { 
      name: "Items in Stock", 
      value: totalStock, 
      icon: Package, 
      color: "text-blue-600", 
      bg: "bg-blue-50" 
    },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-[#0F172A] tracking-tight">Business Overview</h1>
          <p className="text-slate-500 font-medium">Real-time performance tracking for your boutique.</p>
        </div>
        <div className="hidden md:block text-right">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">System Status</p>
          <p className="text-sm font-bold text-emerald-500 flex items-center gap-2 justify-end">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            Live Updates Active
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
              <stat.icon size={24} />
            </div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{stat.name}</p>
            <p className={`text-2xl font-black mt-1 ${stat.color}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders List */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-[#0F172A]">Recent Orders</h2>
            <span className="text-xs font-bold bg-slate-100 px-3 py-1 rounded-full text-slate-500">Last 5 Sales</span>
          </div>
          <div className="space-y-4">
            {orders.slice(-5).reverse().map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <ShoppingBag size={18} className="text-slate-400" />
                  </div>
                  <div>
                    <p className="font-bold text-[#0F172A]">{order.productName}</p>
                    <p className="text-xs text-slate-500">{order.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-[#0F172A]">{order.totalAmount.toLocaleString()} UGX</p>
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Completed</p>
                </div>
              </div>
            ))}
            {orders.length === 0 && (
              <div className="text-center py-10">
                <p className="text-slate-400 italic">No sales recorded yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Business Health Panel */}
        <div className="space-y-6">
          <div className="bg-[#0F172A] rounded-3xl p-8 text-white shadow-xl">
            <h2 className="text-xl font-bold mb-6">Efficiency</h2>
            <div className="space-y-6">
              <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                <p className="text-white/60 text-sm mb-1">Gross Margin</p>
                <p className="text-2xl font-black text-emerald-400">
                  {totalRevenue > 0 ? ((grossProfit / totalRevenue) * 100).toFixed(1) : 0}%
                </p>
              </div>
              <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                <p className="text-white/60 text-sm mb-1">Expense Ratio</p>
                <p className="text-2xl font-black text-orange-400">
                  {totalRevenue > 0 ? ((totalExpenses / totalRevenue) * 100).toFixed(1) : 0}%
                </p>
              </div>
            </div>
          </div>

          {/* Low Stock Warning Card */}
          {products.some(p => p.quantity < 3) && (
            <div className="bg-red-50 border border-red-100 rounded-3xl p-6">
              <div className="flex items-center gap-3 text-red-600 mb-2">
                <AlertTriangle size={20} />
                <p className="font-bold">Inventory Alert</p>
              </div>
              <p className="text-sm text-red-700">
                {products.filter(p => p.quantity < 3).length} items are critically low on stock. Restock soon to avoid lost sales.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}