import { useInventory } from "../context/InventoryContext";
import { Download, Upload, ShieldCheck, Database, Info, AlertTriangle } from "lucide-react";

export default function Settings() {
  const context = useInventory();
  const softwareVersion = "v1.0.0 (Initial Build)";

  const handleExport = () => {
    // Collect everything from context
    const fullData = {
      products: context.products,
      orders: context.orders,
      expenses: context.expenses,
      stockPurchases: context.stockPurchases,
      withdrawals: context.withdrawals,
      injections: context.injections,
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(fullData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `fashion_store_backup_${new Date().toLocaleDateString()}.json`;
    link.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (window.confirm("This will overwrite all current data. Are you sure?")) {
        context.importAllData(content);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      <header>
        <h1 className="text-3xl font-black text-slate-900">Settings</h1>
        <p className="text-slate-500 font-medium">Software configuration and data security.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* DATA MANAGEMENT */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b pb-4">
              <Database className="text-blue-600" size={24} />
              <h2 className="text-xl font-bold">Backup & Recovery</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 bg-slate-50 rounded-2xl space-y-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <Download className="text-blue-600" size={20} />
                </div>
                <h3 className="font-bold text-slate-900">Export Data</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Download a backup of all your products, sales, and financial records.
                </p>
                <button 
                  onClick={handleExport}
                  className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors"
                >
                  SAVE BACKUP FILE
                </button>
              </div>

              <div className="p-6 bg-slate-50 rounded-2xl space-y-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <Upload className="text-orange-600" size={20} />
                </div>
                <h3 className="font-bold text-slate-900">Import Data</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Upload a previously saved backup file to restore your store records.
                </p>
                <label className="block w-full bg-white border-2 border-dashed border-slate-200 text-slate-600 text-center font-bold py-3 rounded-xl hover:border-orange-400 cursor-pointer transition-colors">
                  SELECT FILE
                  <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                </label>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-amber-50 rounded-2xl border border-amber-100">
              <AlertTriangle className="text-amber-600 shrink-0" size={20} />
              <p className="text-xs text-amber-800 font-medium italic">
                Caution: Importing a data file will replace everything you currently see in the system. Make sure you have the correct file before proceeding.
              </p>
            </div>
          </div>
        </div>

        {/* SYSTEM INFO */}
        <div className="space-y-6">
          <div className="bg-[#0F172A] p-8 rounded-3xl text-white shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <Info className="text-blue-400" size={20} />
              <h2 className="text-lg font-bold">Software Info</h2>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Current Version</p>
                <p className="text-xl font-black text-blue-400">{softwareVersion}</p>
              </div>
              <div>
                <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Status</p>
                <p className="text-emerald-400 font-bold flex items-center gap-2">
                  <ShieldCheck size={16} /> Fully Operational
                </p>
              </div>
              <div className="pt-4 border-t border-white/10">
                <p className="text-[10px] text-white/40 leading-relaxed italic">
                  This system is running locally on your laptop. All data is stored in your browser's secure local storage.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}