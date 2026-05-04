'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTheme } from 'next-themes';
import { 
  LayoutDashboard, 
  PlusCircle, 
  List, 
  Wine, 
  BedDouble, 
  Users,
  Building,
  Download,
  Sun,
  Moon,
  CheckCircle2,
  AlertCircle,
  Lock,
  LogOut
} from 'lucide-react';
import './dashboard.css';
import { ITransaction, DashboardMetrics, ROOM_DEFAULTS, CATEGORIES, Category } from './lib/types';
import DashboardOverview from './components/DashboardOverview';
import DataEntryForm from './components/DataEntryForm';
import TransactionTable from './components/TransactionTable';
import BarAnalytics from './components/BarAnalytics';
import RoomManager from './components/RoomManager';
import DebtorTracker from './components/DebtorTracker';

type Tab = 'overview' | 'entry' | 'transactions' | 'bar' | 'rooms' | 'debtors';

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={18} /> },
  { id: 'entry', label: 'New Entry', icon: <PlusCircle size={18} /> },
  { id: 'transactions', label: 'Transactions', icon: <List size={18} /> },
  { id: 'bar', label: 'Bar', icon: <Wine size={18} /> },
  { id: 'rooms', label: 'Rooms', icon: <BedDouble size={18} /> },
  { id: 'debtors', label: 'Debtors', icon: <Users size={18} /> },
];

interface Toast {
  message: string;
  type: 'success' | 'error';
}

export default function RaymitonDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<ITransaction | null>(null);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const fetchTransactions = useCallback(async () => {
    const res = await fetch('/raymiton/api/transactions');
    if (res.status === 401) throw new Error('Unauthorized');
    if (!res.ok) throw new Error('Failed to fetch');
    const data = await res.json();
    setTransactions(data);
  }, []);

  const fetchMetrics = useCallback(async () => {
    const res = await fetch('/raymiton/api/metrics');
    if (res.status === 401) throw new Error('Unauthorized');
    if (!res.ok) throw new Error('Failed to fetch');
    const data = await res.json();
    setMetrics(data);
  }, []);

  const refreshData = useCallback(async () => {
    try {
      await Promise.all([fetchTransactions(), fetchMetrics()]);
      setIsAuthenticated(true);
    } catch (err: any) {
      if (err.message === 'Unauthorized') {
        setIsAuthenticated(false);
      } else {
        showToast('Failed to load data', 'error');
      }
    }
  }, [fetchTransactions, fetchMetrics, showToast]);

  useEffect(() => {
    setAuthLoading(true);
    refreshData().finally(() => setAuthLoading(false));
  }, [refreshData]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      const res = await fetch('/raymiton/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setIsAuthenticated(true);
        refreshData();
      } else {
        showToast('Incorrect password', 'error');
      }
    } catch (err) {
      showToast('Login failed', 'error');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/raymiton/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'logout' }),
      });
      setIsAuthenticated(false);
      setTransactions([]);
      setMetrics(null);
    } catch (err) {
      showToast('Failed to logout', 'error');
    }
  };

  const handleSeedData = async () => {
    try {
      const res = await fetch('/raymiton/api/seed', { method: 'POST' });
      if (res.status === 401) {
        setIsAuthenticated(false);
        return;
      }
      const data = await res.json();
      showToast(data.message, data.seeded ? 'success' : 'error');
      if (data.seeded) refreshData();
    } catch {
      showToast('Failed to seed data', 'error');
    }
  };

  const handleCreateTransaction = async (tx: Partial<ITransaction>) => {
    try {
      const res = await fetch('/raymiton/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tx),
      });
      if (res.status === 401) {
        setIsAuthenticated(false);
        return false;
      }
      if (!res.ok) throw new Error('Failed to create');
      showToast('Transaction added successfully');
      refreshData();
      return true;
    } catch {
      showToast('Failed to add transaction', 'error');
      return false;
    }
  };

  const handleUpdateTransaction = async (id: string, tx: Partial<ITransaction>) => {
    try {
      const res = await fetch(`/raymiton/api/transactions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tx),
      });
      if (res.status === 401) {
        setIsAuthenticated(false);
        return false;
      }
      if (!res.ok) throw new Error('Failed to update');
      showToast('Transaction updated successfully');
      setEditingTransaction(null);
      refreshData();
      return true;
    } catch {
      showToast('Failed to update transaction', 'error');
      return false;
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    if (!confirm('Delete this transaction?')) return;
    try {
      const res = await fetch(`/raymiton/api/transactions/${id}`, { method: 'DELETE' });
      if (res.status === 401) {
        setIsAuthenticated(false);
        return;
      }
      if (!res.ok) throw new Error('Failed to delete');
      showToast('Transaction deleted');
      refreshData();
    } catch {
      showToast('Failed to delete transaction', 'error');
    }
  };

  const handleMarkPaid = async (id: string, totalCharged: number) => {
    try {
      const tx = transactions.find(t => t._id === id);
      if (!tx) return;
      const res = await fetch(`/raymiton/api/transactions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...tx, amountPaid: totalCharged }),
      });
      if (res.status === 401) {
        setIsAuthenticated(false);
        return;
      }
      if (!res.ok) throw new Error('Failed to update');
      showToast('Marked as paid successfully');
      refreshData();
    } catch {
      showToast('Failed to mark as paid', 'error');
    }
  };

  const handleEditClick = (tx: ITransaction) => {
    setEditingTransaction(tx);
    setActiveTab('entry');
  };

  const handleCancelEdit = () => {
    setEditingTransaction(null);
  };

  const formatCurrency = (amount: number) => {
    return '₦' + amount.toLocaleString('en-NG');
  };

  if (authLoading) {
    return (
      <div className="raymiton">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: 20 }}>
          <Building size={48} className="r-text-accent" />
          <div className="r-spinner" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="raymiton">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', padding: 20 }}>
          <div className="r-card" style={{ maxWidth: 400, width: '100%', padding: '40px 30px', textAlign: 'center' }}>
            <Building size={48} className="r-text-accent" style={{ margin: '0 auto 20px' }} />
            <h1 style={{ fontSize: 24, marginBottom: 8 }}>Raymiton Admin</h1>
            <p style={{ color: 'var(--r-text-muted)', marginBottom: 30, fontSize: 14 }}>Enter your password to access the dashboard</p>
            
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--r-text-muted)' }} />
                <input
                  type="password"
                  placeholder="Password"
                  className="r-input"
                  style={{ paddingLeft: 36, width: '100%' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                />
              </div>
              <button type="submit" className="r-btn r-btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Access Dashboard
              </button>
            </form>
          </div>
        </div>

        {toast && (
          <div className={`r-toast ${toast.type}`}>
            {toast.type === 'success' ? <CheckCircle2 size={18} color="var(--r-green)" /> : <AlertCircle size={18} color="var(--r-red)" />}
            <span>{toast.message}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="raymiton">
      {/* Header */}
      <header className="r-header">
        <div className="r-header-left">
          <div className="r-logo">
            <Building size={24} />
          </div>
          <div>
            <h1>RAYMITON HOTEL</h1>
            <div className="r-header-subtitle">Management Dashboard</div>
          </div>
        </div>
        <div className="r-header-actions">
          {transactions.length === 0 && (
            <button className="r-btn r-btn-primary r-btn-sm" onClick={handleSeedData}>
              <Download size={16} />
              Load Spreadsheet
            </button>
          )}
          {mounted && (
            <>
              <button 
                className="r-icon-btn" 
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button 
                className="r-icon-btn" 
                onClick={handleLogout}
                aria-label="Logout"
                style={{ marginLeft: 8 }}
              >
                <LogOut size={20} />
              </button>
            </>
          )}
        </div>
      </header>

      {/* Tabs */}
      <nav className="r-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`r-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => {
              setActiveTab(tab.id);
              if (tab.id !== 'entry') setEditingTransaction(null);
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </nav>

      {/* Content */}
      <main className="r-content">
        {loading ? (
          <div className="r-loading">
            <div className="r-spinner" />
            Loading...
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <DashboardOverview
                metrics={metrics}
                transactions={transactions}
                formatCurrency={formatCurrency}
              />
            )}

            {activeTab === 'entry' && (
              <DataEntryForm
                onSubmit={editingTransaction
                  ? (tx) => handleUpdateTransaction(editingTransaction._id!, tx)
                  : handleCreateTransaction
                }
                editingTransaction={editingTransaction}
                onCancelEdit={handleCancelEdit}
                roomDefaults={ROOM_DEFAULTS}
                categories={CATEGORIES}
              />
            )}

            {activeTab === 'transactions' && (
              <TransactionTable
                transactions={transactions}
                onEdit={handleEditClick}
                onDelete={handleDeleteTransaction}
                formatCurrency={formatCurrency}
              />
            )}

            {activeTab === 'bar' && (
              <BarAnalytics
                transactions={transactions}
                metrics={metrics}
                formatCurrency={formatCurrency}
              />
            )}

            {activeTab === 'rooms' && (
              <RoomManager
                transactions={transactions}
                roomDefaults={ROOM_DEFAULTS}
                formatCurrency={formatCurrency}
                onMarkPaid={handleMarkPaid}
              />
            )}

            {activeTab === 'debtors' && (
              <DebtorTracker
                transactions={transactions}
                formatCurrency={formatCurrency}
                onMarkPaid={handleMarkPaid}
                onEdit={handleEditClick}
              />
            )}
          </>
        )}
      </main>

      {/* Toast */}
      {toast && (
        <div className={`r-toast ${toast.type}`}>
          {toast.type === 'success' ? <CheckCircle2 size={18} color="var(--r-green)" /> : <AlertCircle size={18} color="var(--r-red)" />}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
