import { useState } from "react";
import { useInventory, type Expense } from "../context/InventoryContext";
import { Plus, Receipt, Trash2, Calendar } from "lucide-react";

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
          <h1 className="text-3xl font-bold text-[#0F172A]">Shop Expenses</h1>
          <p className="text-slate-500">Track your overhead costs to see real profit.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-red-500 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-red-600 transition-all"
        >
          <Plus size={20} /> Record Expense
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
              <input required value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-3 bg-slate-50 border rounded-xl" placeholder="e.g. Monthly Rent" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value as any)} className="w-full p-3 bg-slate-50 border rounded-xl">
                <option value="Rent">Rent</option>
                <option value="Utilities">Utilities</option>
                <option value="Marketing">Marketing</option>
                <option value="Staff">Staff</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Amount (UGX)</label>
              <input type="number" required value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full p-3 bg-slate-50 border rounded-xl" />
            </div>
          </div>
          <button type="submit" className="w-full bg-[#0F172A] text-white font-bold py-4 rounded-xl">SAVE EXPENSE</button>
        </form>
      )}

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold">
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
              <tr key={ex.id}>
                <td className="px-8 py-5 text-sm flex items-center gap-2"><Calendar size={14}/> {ex.date}</td>
                <td className="px-6 py-5"><span className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-bold">{ex.category}</span></td>
                <td className="px-6 py-5 text-[#0F172A] font-medium">{ex.description}</td>
                <td className="px-6 py-5 text-right font-bold text-red-500">-{ex.amount.toLocaleString()} UGX</td>
                <td className="px-6 py-5 text-right">
                  <button onClick={() => deleteExpense(ex.id)} className="text-slate-300 hover:text-red-500"><Trash2 size={18}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}