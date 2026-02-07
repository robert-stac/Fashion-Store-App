import { Outlet, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingBag, Receipt, Wallet, Settings } from "lucide-react";

export default function Layout() {
  const location = useLocation();

  const navItems = [
    { to: "/", icon: <LayoutDashboard size={20}/>, label: "Dashboard" },
    { to: "/inventory", icon: <Package size={20}/>, label: "Stock" },
    { to: "/orders", icon: <ShoppingBag size={20}/>, label: "Orders" },
    { to: "/expenses", icon: <Receipt size={20}/>, label: "Expenses" },
    { to: "/finances", icon: <Wallet size={20}/>, label: "Finances" },
    { to: "/settings", icon: <Settings size={20}/>, label: "Settings" },
  ];

  return (
    <div className="flex h-screen w-full bg-[#F8FAFC]">
      {/* --- DESKTOP SIDEBAR (Hidden on Mobile) --- */}
      <aside className="hidden md:flex w-64 bg-[#0F172A] text-white flex-col shrink-0 shadow-2xl">
        <div className="p-8 text-xl font-black border-b border-slate-800 tracking-tighter uppercase">
          Ricollections <span className="text-[#ED985F]">Store</span>
        </div>
        <nav className="flex-1 p-4 space-y-2 mt-4">
          {navItems.map((item) => (
            <NavItem 
              key={item.to}
              to={item.to} 
              icon={item.icon} 
              label={item.label} 
              active={location.pathname === item.to} 
            />
          ))}
        </nav>
      </aside>

      {/* --- MOBILE BOTTOM NAV (Visible only on Phone) --- */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around items-center px-2 py-3 z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link 
              key={item.to}
              to={item.to} 
              className={`flex flex-col items-center gap-1 transition-colors ${
                isActive ? "text-[#ED985F]" : "text-slate-400"
              }`}
            >
              {item.icon}
              <span className="text-[10px] font-bold uppercase tracking-tighter">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* --- MAIN CONTENT --- */}
      {/* Added pb-20 so the bottom nav doesn't block content on mobile */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10 pb-24 md:pb-10">
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