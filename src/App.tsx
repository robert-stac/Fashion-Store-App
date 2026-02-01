import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { RefreshCw, X } from 'lucide-react';
import Layout from './layouts/Layout';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Orders from './pages/Orders';
import Expenses from './pages/Expenses';
import Finances from './pages/Finances';
import Settings from './pages/Settings';

// --- VERSION CONFIGURATION ---
// Increment this number when you push new features to GitHub
const CURRENT_VERSION = "1.0.0"; 
// Replace with your actual GitHub Raw URL once deployed
const GITHUB_VAR_URL = "https://raw.githubusercontent.com/robert-stac/Fashion-Store-App/main/version.json";

/**
 * UpdateNotification Component
 * Checks GitHub for a version mismatch and alerts the user.
 */
function UpdateNotification() {
  const [showUpdate, setShowUpdate] = useState(false);
  const [latestVersion, setLatestVersion] = useState("");

  useEffect(() => {
    const checkVersion = async () => {
      try {
        const response = await fetch(GITHUB_VAR_URL);
        const data = await response.json();
        
        if (data.version !== CURRENT_VERSION) {
          setLatestVersion(data.version);
          setShowUpdate(true);
        }
      } catch (error) {
        // Silently fail if offline or repo is private/not found
        console.log("Version check skipped (Offline or URL incorrect).");
      }
    };

    checkVersion();
  }, []);

  if (!showUpdate) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] animate-in slide-in-from-right duration-500">
      <div className="bg-[#0F172A] text-white p-5 rounded-3xl shadow-2xl border border-blue-500/30 flex items-center gap-4 max-w-sm">
        <div className="bg-blue-600 p-3 rounded-2xl flex-shrink-0">
          <RefreshCw size={20} className="animate-spin" style={{ animationDuration: '3s' }} />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-sm">Update Available</h4>
          <p className="text-xs text-white/60">New version {latestVersion} is out! Refresh to apply updates.</p>
        </div>
        <button 
          onClick={() => setShowUpdate(false)}
          className="hover:bg-white/10 p-2 rounded-xl transition-colors"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <>
      <UpdateNotification />
      <Routes>
        {/* All pages inside this Route will have the Sidebar (Layout) */}
        <Route path="/" element={<Layout />}>
          
          {/* The Home/Dashboard Page */}
          <Route index element={<Dashboard />} />
          
          {/* The Inventory Management Page */}
          <Route path="inventory" element={<Inventory />} />
          
          {/* The Sales/Orders Page */}
          <Route path="orders" element={<Orders />} />

          {/* The Expenses Tracking Page */}
          <Route path="expenses" element={<Expenses />} />

          {/* The Finances Page */}
          <Route path="finances" element={<Finances />} />

          {/* Settings Page */}
          <Route path="settings" element={<Settings />} />

        </Route>
      </Routes>
    </>
  );
}

export default App;