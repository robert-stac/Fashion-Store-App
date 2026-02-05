import { useState } from "react";
import { useInventory } from "../context/InventoryContext";
import { Plus, Calendar, Download } from "lucide-react";

export default function Orders() {
  const { products, orders, addOrder } = useInventory();
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [selectedProduct, setSelectedProduct] = useState("");
  const [qty, setQty] = useState(1);

  // --- CSV EXPORT LOGIC ---
  const exportToCSV = () => {
    if (orders.length === 0) {
      alert("No orders to export yet!");
      return;
    }

    const headers = ["Date", "Product Name", "Quantity", "Total Amount (UGX)", "Status"];
    
    const rows = orders.map(o => [
      o.date,
      o.productName,
      o.quantity,
      o.totalAmount,
      o.status
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Boutique_Sales_Report_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- UPDATED SALE LOGIC ---
  const handleSale = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const product = products.find(p => p.name === selectedProduct);
    
    if (!product) {
      alert("Please select a valid product.");
      return;
    }

    if (product.quantity < qty) {
      alert(`Not enough stock! Only ${product.quantity} left.`);
      return;
    }

    // Prepare the order data (Omit ID because Firebase handles it)
    const newOrderData = {
      productName: product.name,
      quantity: qty,
      totalAmount: product.sellPrice * qty,
      date: new Date().toLocaleDateString(),
      status: "Paid" as const,
    };

    try {
      // addOrder in Context now handles both:
      // 1. Adding the Order record to Firebase
      // 2. Subtracting the quantity from the Product in Firebase
      await addOrder(newOrderData);
      
      // Reset Form
      setShowForm(false);
      setSelectedProduct("");
      setQty(1);
    } catch (error) {
      console.error("Sale failed:", error);
      alert("Something went wrong with the cloud sync. Please try again.");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#0F172A]">Sales & Orders</h1>
          <p className="text-slate-500">Record new sales and download your reports.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={exportToCSV}
            className="bg-white text-slate-700 border border-slate-200 px-5 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
          >
            <Download size={18} /> Export CSV
          </button>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="bg-[#ED985F] text-[#0F172A] px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-orange-100"
          >
            <Plus size={20} /> {showForm ? "Close" : "Record a Sale"}
          </button>
        </div>
      </div>

      {/* RECORD SALE FORM */}
      {showForm && (
        <form onSubmit={handleSale} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Select Product</label>
              <select 
                required 
                value={selectedProduct} 
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#ED985F]"
              >
                <option value="">-- Choose Stock --</option>
                {products.map(p => (
                  <option key={p.id} value={p.name} disabled={p.quantity === 0}>
                    {p.name} ({p.quantity} left)
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Quantity Sold</label>
              <input 
                type="number" 
                min="1"
                value={qty} 
                onChange={(e) => setQty(Number(e.target.value))}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#ED985F]" 
              />
            </div>
          </div>
          <button type="submit" className="w-full bg-[#0F172A] text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-colors">
            COMPLETE SALE
          </button>
        </form>
      )}

      {/* ORDERS TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase tracking-widest font-bold">
            <tr>
              <th className="px-8 py-5">Date</th>
              <th className="px-6 py-5">Items</th>
              <th className="px-6 py-5">Qty</th>
              <th className="px-6 py-5 text-right">Total Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-8 py-5 text-sm text-slate-500 flex items-center gap-2">
                  <Calendar size={14} /> {order.date}
                </td>
                <td className="px-6 py-5 font-bold text-[#0F172A]">{order.productName}</td>
                <td className="px-6 py-5 text-slate-600">{order.quantity}</td>
                <td className="px-6 py-5 text-right font-black text-emerald-600">
                  {order.totalAmount.toLocaleString()} UGX
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={4} className="p-20 text-center text-slate-400 italic">No sales recorded yet. Start selling!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}