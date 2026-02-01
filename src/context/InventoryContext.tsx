import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

// --- ALL DATA TYPES ---
export type Product = {
  id: string;
  name: string;
  category: "Bags" | "Shoes" | "Accessories";
  quantity: number;
  costPrice: number;
  sellPrice: number;
};

export type Order = {
  id: string;
  productName: string;
  quantity: number;
  totalAmount: number;
  date: string;
  status: "Paid" | "Unpaid";
};

export type Expense = {
  id: string;
  description: string;
  amount: number;
  category: "Rent" | "Utilities" | "Marketing" | "Staff" | "Other";
  date: string;
};

export type StockPurchase = {
  id: string;
  description: string;
  amount: number;
  date: string;
};

export type Withdrawal = {
  id: string;
  amount: number;
  date: string;
  note: string;
};

export type CapitalInjection = {
  id: string;
  amount: number;
  date: string;
  source: string;
};

// --- INTERFACE (The Contract) ---
interface InventoryContextType {
  products: Product[];
  orders: Order[];
  expenses: Expense[];
  stockPurchases: StockPurchase[];
  withdrawals: Withdrawal[];
  injections: CapitalInjection[];
  addProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;
  addOrder: (o: Order) => void;
  addExpense: (e: Expense) => void;
  deleteExpense: (id: string) => void;
  addStockPurchase: (p: StockPurchase) => void;
  addWithdrawal: (w: Withdrawal) => void;
  addInjection: (i: CapitalInjection) => void;
  importAllData: (data: string) => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

// --- PROVIDER (The Engine) ---
export const InventoryProvider = ({ children }: { children: ReactNode }) => {
  // Load initial data from localStorage
  const [products, setProducts] = useState<Product[]>(() => JSON.parse(localStorage.getItem("fsm_products") || "[]"));
  const [orders, setOrders] = useState<Order[]>(() => JSON.parse(localStorage.getItem("fsm_orders") || "[]"));
  const [expenses, setExpenses] = useState<Expense[]>(() => JSON.parse(localStorage.getItem("fsm_expenses") || "[]"));
  const [stockPurchases, setStockPurchases] = useState<StockPurchase[]>(() => JSON.parse(localStorage.getItem("fsm_stock_purchases") || "[]"));
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>(() => JSON.parse(localStorage.getItem("fsm_withdrawals") || "[]"));
  const [injections, setInjections] = useState<CapitalInjection[]>(() => JSON.parse(localStorage.getItem("fsm_injections") || "[]"));

  // Save to localStorage whenever anything changes
  useEffect(() => {
    localStorage.setItem("fsm_products", JSON.stringify(products));
    localStorage.setItem("fsm_orders", JSON.stringify(orders));
    localStorage.setItem("fsm_expenses", JSON.stringify(expenses));
    localStorage.setItem("fsm_stock_purchases", JSON.stringify(stockPurchases));
    localStorage.setItem("fsm_withdrawals", JSON.stringify(withdrawals));
    localStorage.setItem("fsm_injections", JSON.stringify(injections));
  }, [products, orders, expenses, stockPurchases, withdrawals, injections]);

  // --- ACTIONS ---
  const addProduct = (p: Product) => setProducts((prev) => [...prev, p]);
  
  const deleteProduct = (id: string) => setProducts((prev) => prev.filter(p => p.id !== id));

  const addOrder = (o: Order) => {
    setOrders((prev) => [...prev, o]);
    // Logic to subtract quantity from inventory when sold
    setProducts((prev) => 
      prev.map(p => 
        p.name === o.productName 
          ? { ...p, quantity: Math.max(0, p.quantity - o.quantity) } 
          : p
      )
    );
  };

  const addExpense = (e: Expense) => setExpenses((prev) => [...prev, e]);
  
  const deleteExpense = (id: string) => setExpenses((prev) => prev.filter(ex => ex.id !== id));

  const addStockPurchase = (p: StockPurchase) => setStockPurchases((prev) => [...prev, p]);

  const addWithdrawal = (w: Withdrawal) => setWithdrawals((prev) => [...prev, w]);

  const addInjection = (i: CapitalInjection) => setInjections((prev) => [...prev, i]);

  const importAllData = (data: string) => {
    try {
      const parsed = JSON.parse(data);
      // Validating properties before setting state
      if (parsed.products) setProducts(parsed.products);
      if (parsed.orders) setOrders(parsed.orders);
      if (parsed.expenses) setExpenses(parsed.expenses);
      if (parsed.stockPurchases) setStockPurchases(parsed.stockPurchases);
      if (parsed.withdrawals) setWithdrawals(parsed.withdrawals);
      if (parsed.injections) setInjections(parsed.injections);
      alert("Success! All data has been restored.");
    } catch (err) {
      alert("Error: The backup file is corrupted or invalid.");
    }
  };

  return (
    <InventoryContext.Provider value={{ 
      products, orders, expenses, stockPurchases, withdrawals, injections,
      addProduct, deleteProduct, addOrder, addExpense, deleteExpense,
      addStockPurchase, addWithdrawal, addInjection, importAllData 
    }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) throw new Error("useInventory must be used within an InventoryProvider");
  return context;
};