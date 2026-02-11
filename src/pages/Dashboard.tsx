import { useInventory } from "../context/InventoryContext";
import { ShoppingBag, TrendingUp, Package, ArrowUpRight, Wallet, AlertTriangle } from "lucide-react";

export default function Dashboard() {
  const { products, orders, expenses } = useInventory();

  // --- 1. BASIC STATS ---
  const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);
  const totalStock = products.reduce((acc, prod) => acc + prod.quantity, 0);
  const totalExpenses = expenses.reduce((acc, ex) => acc + ex.amount, 0);

  // --- 2. REFINED PROFIT CALCULATIONS ---
  const grossProfit = orders.reduce((acc, order) => {
    const product = products.find(
      (p) => p.name.trim().toLowerCase() === order.productName.trim().toLowerCase()
    );

    let costOfThisOrder = 0;

    if (product) {
      costOfThisOrder = product.costPrice * order.quantity;
    } else {
      costOfThisOrder = order.totalAmount * 0.3;
    }

    const profitFromOrder = order.totalAmount - costOfThisOrder;
    return acc + profitFromOrder;
  }, 0);

  const netProfit = grossProfit - totalExpenses;

  // --- 3. UI DATA MAPPING ---
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
      value: totalStock.toLocaleString(), 
      icon: Package, 
      color: "text-blue-600", 
      bg: "bg-blue-50" 
    },
  ];

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in duration-700 pb-20 md:pb-0">
      {/* Header - Adjusted for Mobile */}
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

      {/* Stats Grid - Responsive Column Counts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-5 md:p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <div className={`w-10 h-10 md:w-12 md:h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-3 md:mb-4`}>
              <stat.icon size={20} className="md:w-6 md:h-6" />
            </div>
            <p className="text-[10px] md:text-sm font-bold text-slate-400 uppercase tracking-wider">{stat.name}</p>
            <p className={`text-lg md:text-2xl font-black mt-1 ${stat.color}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Recent Orders List - Adjusted Padding for Mobile */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-5 md:p-8 shadow-sm">
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

        {/* Business Health Panel */}
        <div className="space-y-4 md:space-y-6">
          <div className="bg-[#0F172A] rounded-3xl p-6 md:p-8 text-white shadow-xl">
            <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6">Efficiency</h2>
            <div className="space-y-4 md:space-y-6">
              <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                <p className="text-white/60 text-xs md:text-sm mb-1">Gross Margin</p>
                <p className="text-xl md:text-2xl font-black text-emerald-400">
                  {totalRevenue > 0 ? ((grossProfit / totalRevenue) * 100).toFixed(1) : 0}%
                </p>
              </div>
              <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                <p className="text-white/60 text-xs md:text-sm mb-1">Expense Ratio</p>
                <p className="text-xl md:text-2xl font-black text-orange-400">
                  {totalRevenue > 0 ? ((totalExpenses / totalRevenue) * 100).toFixed(1) : 0}%
                </p>
              </div>
            </div>
          </div>

          {/* Low Stock Warning Card */}
          {products.some(p => p.quantity < 3) && (
            <div className="bg-red-50 border border-red-100 rounded-3xl p-5 md:p-6">
              <div className="flex items-center gap-2 md:gap-3 text-red-600 mb-2">
                <AlertTriangle size={18} />
                <p className="font-bold text-sm md:text-base">Inventory Alert</p>
              </div>
              <p className="text-xs md:text-sm text-red-700 leading-relaxed">
                {products.filter(p => p.quantity < 3).length} items are critically low on stock. Check inventory soon.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}