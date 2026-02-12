import { useState } from "react";
import { useInventory, type Expense } from "../context/InventoryContext";
import { Plus, Trash2, Calendar, X } from "lucide-react";

export default function Expenses() {
  const { expenses, addExpense, deleteExpense } = useInventory();
  const [showForm, setShowForm] = useState(false);
  
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState<Expense["category"]>("Rent");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newExpense: Expense = {
      id: Date.now().toString(),
      description,
      amount,
      category,
      date: new Date().toLocaleDateString(),
    };
    addExpense(newExpense);
    setShowForm(false);
    setDescription(""); setAmount(0);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#0F172A]">Shop Expenses</h1>
          <p className="text-slate-500 text-sm md:text-base">Track overhead costs to see real profit.</p>
        </div>
        
        {/* RESPONSIVE BUTTON: Icon on mobile, Text on desktop */}
        <button 
          onClick={() => setShowForm(!showForm)}
          className={`${showForm ? 'bg-slate-200 text-slate-700' : 'bg-red-500 text-white'} 
            p-3 md:px-6 md:py-3 rounded-2xl font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-red-100`}
        >
          {showForm ? <X size={20} /> : <Plus size={20} />}
          <span className="hidden md:inline">{showForm ? "Cancel" : "Record Expense"}</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xl max-w-2xl animate-in zoom-in-95 duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
              <input required value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-red-500" placeholder="e.g. Monthly Rent" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value as any)} className="w-full p-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-red-500">
                <option value="Rent">Rent</option>
                <option value="Utilities">Utilities</option>
                <option value="Marketing">Marketing</option>
                <option value="Staff">Staff</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Amount (UGX)</label>
              <input type="number" required value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full p-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-red-500" />
            </div>
          </div>
          <button type="submit" className="w-full bg-[#0F172A] text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-colors">
            SAVE EXPENSE
          </button>
        </form>
      )}

      {/* EXPENSES TABLE - WRAPPED FOR MOBILE SCROLLING */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left min-w-[700px]">
            <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-widest">
              <tr>
                <th className="px-8 py-5">Date</th>
                <th className="px-6 py-5">Category</th>
                <th className="px-6 py-5">Description</th>
                <th className="px-6 py-5 text-right">Amount</th>
                <th className="px-6 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {expenses.map((ex) => (
                <tr key={ex.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-5 text-sm flex items-center gap-2 whitespace-nowrap text-slate-500">
                    <Calendar size={14}/> {ex.date}
                  </td>
                  <td className="px-6 py-5">
                    <span className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-600">
                      {ex.category}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-[#0F172A] font-medium">{ex.description}</td>
                  <td className="px-6 py-5 text-right font-black text-red-500 whitespace-nowrap">
                    -{ex.amount.toLocaleString()} UGX
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button 
                      onClick={() => { if(window.confirm("Delete this expense?")) deleteExpense(ex.id) }} 
                      className="text-slate-300 hover:text-red-500 p-2 transition-colors"
                    >
                      <Trash2 size={18}/>
                    </button>
                  </td>
                </tr>
              ))}
              {expenses.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-20 text-center text-slate-400 italic">
                    No expenses recorded. Good job keeping costs low!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}