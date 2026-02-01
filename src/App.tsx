import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { RefreshCw, X, Download } from 'lucide-react';
import './index.css';
import Layout from './layouts/Layout';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Orders from './pages/Orders';
import Expenses from './pages/Expenses';
import Finances from './pages/Finances';
import Settings from './pages/Settings';

// --- CONFIGURATION ---
const CURRENT_VERSION = "1.0.0"; 
const GITHUB_VAR_URL = "https://raw.githubusercontent.com/robert-stac/Fashion-Store-App/main/version.json";

/**
 * UpdateNotification Component
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
        console.log("Version check skipped.");
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
          <p className="text-xs text-white/60">Version {latestVersion} is ready. Refresh to update.</p>
        </div>
        <button onClick={() => setShowUpdate(false)} className="hover:bg-white/10 p-2 rounded-xl transition-colors">
          <X size={18} />
        </button>
      </div>
    </div>
  );
}

/**
 * InstallPrompt Component
 */
function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    });
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-28 right-6 z-[9999] animate-in slide-in-from-bottom duration-500">
      <div className="bg-white text-slate-900 p-5 rounded-3xl shadow-2xl border border-slate-200 flex items-center gap-4 max-w-sm">
        <div className="bg-slate-100 p-3 rounded-2xl flex-shrink-0 text-blue-600">
          <Download size={20} />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-sm text-slate-900">Install Desktop App</h4>
          <p className="text-xs text-slate-500">Add to your taskbar for quick access.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleInstall} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors">
            Install
          </button>
          <button onClick={() => setShowPrompt(false)} className="text-slate-400 p-2">
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <>
      <UpdateNotification />
      <InstallPrompt />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="orders" element={<Orders />} />
          <Route path="expenses" element={<Expenses />} />
          <Route path="finances" element={<Finances />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;