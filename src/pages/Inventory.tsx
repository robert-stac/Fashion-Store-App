import { useState } from "react";
import { useInventory, type Product } from "../context/InventoryContext";
import { Plus, Package, ShoppingBag, Trash2, AlertCircle, Edit3, X, Search, Filter } from "lucide-react";

export default function Inventory() {
  const { products, addProduct, deleteProduct } = useInventory();
  
  // State for Form Visibility and Editing
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  // Form Field States
  const [name, setName] = useState("");
  const [category, setCategory] = useState<"Bags" | "Shoes" | "Accessories">("Bags");
  const [quantity, setQuantity] = useState(0);
  const [costPrice, setCostPrice] = useState(0);
  const [sellPrice, setSellPrice] = useState(0);

  // --- SEARCH & FILTER LOGIC ---
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "All" || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Open form for a NEW product
  const handleAddNew = () => {
    setEditingId(null);
    setName(""); setQuantity(0); setCostPrice(0); setSellPrice(0);
    setShowForm(true);
  };

  // Open form to EDIT an existing product
  const handleEdit = (p: Product) => {
    setEditingId(p.id);
    setName(p.name);
    setCategory(p.category);
    setQuantity(p.quantity);
    setCostPrice(p.costPrice);
    setSellPrice(p.sellPrice);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      deleteProduct(editingId);
    }

    const newProduct: Product = {
      id: editingId || Date.now().toString(),
      name,
      category,
      quantity,
      costPrice,
      sellPrice,
    };

    addProduct(newProduct);
    setShowForm(false);
    setEditingId(null);
    setName(""); setQuantity(0); setCostPrice(0); setSellPrice(0);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#0F172A]">Inventory</h1>
          <p className="text-slate-500">Manage your items and track stock levels.</p>
        </div>
        <button 
          onClick={showForm ? () => setShowForm(false) : handleAddNew}
          className={`${showForm ? 'bg-slate-200 text-slate-700' : 'bg-[#0F172A] text-white'} px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-slate-200`}
        >
          {showForm ? <X size={20} /> : <Plus size={20} />}
          {showForm ? "Cancel" : "Add Product"}
        </button>
      </div>

      {/* DYNAMIC FORM (ADD OR EDIT) */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border-2 border-[#ED985F]/20 shadow-xl space-y-6 animate-in zoom-in-95 duration-300">
          <div className="flex items-center gap-2 text-[#ED985F] mb-2">
            <Edit3 size={18} />
            <span className="font-bold uppercase text-xs tracking-widest">
              {editingId ? "Editing Product" : "New Product Details"}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Product Name</label>
              <input required value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#ED985F] outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value as any)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#ED985F] outline-none">
                <option value="Bags">Bags</option>
                <option value="Shoes">Shoes</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Stock Quantity</label>
              <input type="number" required value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#ED985F] outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Cost (UGX)</label>
                <input type="number" required value={costPrice} onChange={(e) => setCostPrice(Number(e.target.value))} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#ED985F] outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Sale (UGX)</label>
                <input type="number" required value={sellPrice} onChange={(e) => setSellPrice(Number(e.target.value))} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#ED985F] outline-none" />
              </div>
            </div>
          </div>
          <button type="submit" className="w-full bg-[#ED985F] text-[#0F172A] font-black py-4 rounded-xl hover:opacity-90 transition-opacity">
            {editingId ? "UPDATE PRODUCT" : "SAVE TO INVENTORY"}
          </button>
        </form>
      )}

      {/* SEARCH AND FILTER TOOLS */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#ED985F] shadow-sm"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <select 
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="pl-12 pr-8 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#ED985F] shadow-sm appearance-none font-bold text-slate-600 cursor-pointer"
          >
            <option value="All">All Categories</option>
            <option value="Bags">Bags</option>
            <option value="Shoes">Shoes</option>
            <option value="Accessories">Accessories</option>
          </select>
        </div>
      </div>

      {/* PRODUCT TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-400 text-[10px] uppercase tracking-widest font-bold">
              <th className="px-8 py-5 text-center">Type</th>
              <th className="px-6 py-5">Product Details</th>
              <th className="px-6 py-5">Category</th>
              <th className="px-6 py-5">Stock</th>
              <th className="px-6 py-5">Price</th>
              <th className="px-6 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredProducts.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-5">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 group-hover:bg-white transition-colors">
                    {p.category === "Bags" ? <ShoppingBag size={18} /> : <Package size={18} />}
                  </div>
                </td>
                <td className="px-6 py-5 font-bold text-[#0F172A]">{p.name}</td>
                <td className="px-6 py-5 text-sm text-slate-500 font-medium">{p.category}</td>
                <td className="px-6 py-5">
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 w-fit ${p.quantity < 5 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    {p.quantity < 5 && <AlertCircle size={12} />}
                    {p.quantity} in stock
                  </span>
                </td>
                <td className="px-6 py-5 font-black text-[#0F172A]">{p.sellPrice.toLocaleString()} UGX</td>
                <td className="px-6 py-5 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => handleEdit(p)} className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all" title="Edit">
                      <Edit3 size={18} />
                    </button>
                    <button onClick={() => { if(window.confirm("Delete this item?")) deleteProduct(p.id) }} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Delete">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan={6} className="p-20 text-center text-slate-400 italic">No products found matching your search.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}