import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { db } from "../firebase"; 
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc, 
  query, 
  writeBatch,
  increment 
} from "firebase/firestore";

// --- ALL DATA TYPES ---
export type Product = { id: string; name: string; category: "Bags" | "Shoes" | "Accessories"; quantity: number; costPrice: number; sellPrice: number; };
export type Order = { id: string; productName: string; quantity: number; totalAmount: number; date: string; status: "Paid" | "Unpaid"; };
export type Expense = { id: string; description: string; amount: number; category: "Rent" | "Utilities" | "Marketing" | "Staff" | "Other"; date: string; };
export type StockPurchase = { id: string; description: string; amount: number; date: string; };
export type Withdrawal = { id: string; amount: number; date: string; note: string; };
export type CapitalInjection = { id: string; amount: number; date: string; source: string; };

interface InventoryContextType {
  products: Product[];
  orders: Order[];
  expenses: Expense[];
  stockPurchases: StockPurchase[];
  withdrawals: Withdrawal[];
  injections: CapitalInjection[];
  loading: boolean;
  addProduct: (p: Omit<Product, "id">) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addOrder: (o: Omit<Order, "id">) => Promise<void>;
  addExpense: (e: Omit<Expense, "id">) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  addStockPurchase: (p: Omit<StockPurchase, "id">) => Promise<void>;
  addWithdrawal: (w: Omit<Withdrawal, "id">) => Promise<void>;
  addInjection: (i: Omit<CapitalInjection, "id">) => Promise<void>;
  importAllData: (data: string) => Promise<void>;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [stockPurchases, setStockPurchases] = useState<StockPurchase[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [injections, setInjections] = useState<CapitalInjection[]>([]);
  const [loading, setLoading] = useState(true);

  // --- 1. REAL-TIME SYNC ENGINE (FIXED) ---
  useEffect(() => {
    const syncCollection = (name: string, setter: (data: any) => void) => {
      return onSnapshot(query(collection(db, name)), (snapshot) => {
        // BUG FIX: We put '...doc.data()' FIRST, and 'id: doc.id' LAST.
        // This ensures the real Firebase ID overwrites any 'id' saved inside the data.
        const items = snapshot.docs.map(doc => ({ 
          ...doc.data(), 
          id: doc.id 
        }));
        setter(items);
      });
    };

    const unsubProducts = syncCollection("products", setProducts);
    const unsubOrders = syncCollection("orders", setOrders);
    const unsubExpenses = syncCollection("expenses", setExpenses);
    const unsubStock = syncCollection("stockPurchases", setStockPurchases);
    const unsubWithdrawals = syncCollection("withdrawals", setWithdrawals);
    const unsubInjections = syncCollection("injections", setInjections);

    setLoading(false);
    return () => {
      unsubProducts(); unsubOrders(); unsubExpenses(); 
      unsubStock(); unsubWithdrawals(); unsubInjections();
    };
  }, []);

  // --- 2. ACTIONS ---
  const addProduct = async (p: Omit<Product, "id">) => {
    await addDoc(collection(db, "products"), p);
  };

  const deleteProduct = async (id: string) => {
    await deleteDoc(doc(db, "products", id));
  };

  // --- FIXED ADD ORDER (Using Increment) ---
  const addOrder = async (o: Omit<Order, "id">) => {
    const batch = writeBatch(db);
    
    // 1. Create the order
    const orderRef = doc(collection(db, "orders"));
    batch.set(orderRef, o);

    // 2. Find product ID (Case insensitive check)
    const productToUpdate = products.find(p => 
      p.name.trim().toLowerCase() === o.productName.trim().toLowerCase()
    );

    if (productToUpdate) {
      const productRef = doc(db, "products", productToUpdate.id);
      
      // DEBUG: Log this to see if we have the correct ID now
      console.log("Updating Stock for ID:", productToUpdate.id);

      // USE INCREMENT: This is safer than calculating numbers manually
      batch.update(productRef, {
        quantity: increment(-o.quantity)
      });
    } else {
      console.error("Critical Error: Product not found in local list:", o.productName);
    }

    await batch.commit();
  };

  const addExpense = async (e: Omit<Expense, "id">) => {
    await addDoc(collection(db, "expenses"), e);
  };

  const deleteExpense = async (id: string) => {
    await deleteDoc(doc(db, "expenses", id));
  };

  const addStockPurchase = async (p: Omit<StockPurchase, "id">) => {
    await addDoc(collection(db, "stockPurchases"), p);
  };

  const addWithdrawal = async (w: Omit<Withdrawal, "id">) => {
    await addDoc(collection(db, "withdrawals"), w);
  };

  const addInjection = async (i: Omit<CapitalInjection, "id">) => {
    await addDoc(collection(db, "injections"), i);
  };

  const importAllData = async (data: string) => {
    try {
      const parsed = JSON.parse(data);
      const batch = writeBatch(db);
      
      const addToBatch = (collectionName: string, items: any[]) => {
        items.forEach(item => {
          const { id, ...dataOnly } = item;
          const ref = doc(collection(db, collectionName));
          batch.set(ref, dataOnly);
        });
      };

      if (parsed.products) addToBatch("products", parsed.products);
      if (parsed.orders) addToBatch("orders", parsed.orders);
      if (parsed.expenses) addToBatch("expenses", parsed.expenses);
      
      await batch.commit();
      alert("Success! All data migrated to Firebase.");
    } catch (err) {
      alert("Error: Data migration failed.");
    }
  };

  return (
    <InventoryContext.Provider value={{ 
      products, orders, expenses, stockPurchases, withdrawals, injections, loading,
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