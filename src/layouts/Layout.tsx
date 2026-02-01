import { Outlet, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingBag, Receipt, Wallet, Settings } from "lucide-react";

export default function Layout() {
  const location = useLocation();

  return (
    <div className="flex h-screen w-full bg-[#F8FAFC]">
      <aside className="w-64 bg-[#0F172A] text-white flex flex-col shrink-0 shadow-2xl">
        <div className="p-8 text-xl font-black border-b border-slate-800 tracking-tighter uppercase">
          Ricollections <span className="text-[#ED985F]">Store</span>
        </div>
        <nav className="flex-1 p-4 space-y-2 mt-4">
          <NavItem to="/" icon={<LayoutDashboard size={20}/>} label="Dashboard" active={location.pathname === "/"} />
          <NavItem to="/inventory" icon={<Package size={20}/>} label="Inventory" active={location.pathname === "/inventory"} />
          <NavItem to="/orders" icon={<ShoppingBag size={20}/>} label="Orders" active={location.pathname === "/orders"} />
          <NavItem to="/expenses" icon={<Receipt size={20}/>} label="Expenses" active={location.pathname === "/expenses"} />
          <NavItem to="/finances" icon={<Wallet size={20}/>} label="Finances" active={location.pathname === "/finances"} />
          <NavItem to="/settings" icon={<Settings size={20}/>} label="Settings" active={location.pathname === "/settings"} />

        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto p-10">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function NavItem({ to, icon, label, active }: any) {
  return (
    <Link to={to} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
      active ? "bg-[#ED985F] text-[#0F172A] font-bold" : "text-slate-400 hover:bg-slate-800 hover:text-white"
    }`}>
      {icon} {label}
    </Link>
  );
}