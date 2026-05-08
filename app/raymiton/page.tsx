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
  LogOut,
  Package,
  TrendingUp as TrendingUpIcon
} from 'lucide-react';
import './dashboard.css';
import { ITransaction, DashboardMetrics, ROOM_DEFAULTS, CATEGORIES, Category, IInventoryItem } from './lib/types';
import DashboardOverview from './components/DashboardOverview';
import DataEntryForm from './components/DataEntryForm';
import TransactionTable from './components/TransactionTable';
import BarAnalytics from './components/BarAnalytics';
import RoomManager from './components/RoomManager';
import DebtorTracker from './components/DebtorTracker';
import InventoryManager from './components/InventoryManager';
import CalendarAnalytics from './components/CalendarAnalytics';

type Tab = 'overview' | 'analytics' | 'entry' | 'transactions' | 'bar' | 'rooms' | 'debtors' | 'inventory';

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={18} /> },
  { id: 'analytics', label: 'Analytics', icon: <TrendingUpIcon size={18} /> },
  { id: 'entry', label: 'New Entry', icon: <PlusCircle size={18} /> },
  { id: 'transactions', label: 'Transactions', icon: <List size={18} /> },
  { id: 'bar', label: 'Bar', icon: <Wine size={18} /> },
  { id: 'rooms', label: 'Rooms', icon: <BedDouble size={18} /> },
  { id: 'debtors', label: 'Debtors', icon: <Users size={18} /> },
  { id: 'inventory', label: 'Inventory', icon: <Package size={18} /> },
];

interface Toast {
  message: string;
  type: 'success' | 'error';
}

export default function RaymitonDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<'admin' | 'employee' | null>(null);
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [inventory, setInventory] = useState<IInventoryItem[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<ITransaction | null>(null);
  const [activeSession, setActiveSession] = useState<any>(null);
  const [showSessionModal, setShowSessionModal] = useState<'OPEN' | 'CLOSE' | null>(null);
  const [sessionInput, setSessionInput] = useState('');
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

  const fetchInventory = useCallback(async () => {
    try {
      const res = await fetch('/raymiton/api/inventory');
      if (res.ok) {
        const data = await res.json();
        setInventory(data);
      }
    } catch (err) {
      console.error('Failed to fetch inventory:', err);
    }
  }, []);

  const fetchActiveSession = useCallback(async () => {
    try {
      const res = await fetch('/raymiton/api/sessions?active=true');
      if (res.ok) {
        const data = await res.json();
        setActiveSession(data);
      }
    } catch (err) {
      console.error('Failed to fetch session:', err);
    }
  }, []);

  const refreshData = useCallback(async () => {
    try {
      const metricsRes = await fetch('/raymiton/api/metrics');
      if (metricsRes.status === 200) {
        const data = await metricsRes.json();
        setMetrics(data);
        setUserRole('admin');
        setIsAuthenticated(true);
        await Promise.all([fetchTransactions(), fetchInventory(), fetchActiveSession()]);
      } else if (metricsRes.status === 401) {
        const invRes = await fetch('/raymiton/api/inventory');
        if (invRes.status === 200) {
          const invData = await invRes.json();
          setInventory(invData);
          setUserRole('employee');
          setIsAuthenticated(true);
          setActiveTab('entry');
          await fetchActiveSession();
        } else {
          setIsAuthenticated(false);
        }
      }
    } catch (err: any) {
      setIsAuthenticated(false);
    }
  }, [fetchTransactions, fetchInventory, showToast]);

  useEffect(() => {
    setAuthLoading(true);
    refreshData().finally(() => setAuthLoading(false));
  }, [refreshData]);

  const handleOpenDay = async () => {
    try {
      const res = await fetch('/raymiton/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ openingBalance: parseFloat(sessionInput) || 0 }),
      });
      if (res.ok) {
        const data = await res.json();
        setActiveSession(data);
        setShowSessionModal(null);
        setSessionInput('');
        showToast('Day opened successfully!');
      } else {
        const err = await res.json();
        showToast(err.error || 'Failed to open day', 'error');
      }
    } catch (err) {
      showToast('Error opening day', 'error');
    }
  };

  const handleCloseDay = async () => {
    if (!activeSession) return;
    try {
      const res = await fetch('/raymiton/api/sessions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: activeSession._id,
          actualCashAtClose: parseFloat(sessionInput) || 0
        }),
      });
      if (res.ok) {
        setActiveSession(null);
        setShowSessionModal(null);
        setSessionInput('');
        showToast('Day closed successfully!');
        refreshData();
      } else {
        const err = await res.json();
        showToast(err.error || 'Failed to close day', 'error');
      }
    } catch (err) {
      showToast('Error closing day', 'error');
    }
  };

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
        const data = await res.json();
        setIsAuthenticated(true);
        setUserRole(data.role);
        if (data.role === 'admin') {
          refreshData();
          setActiveTab('overview');
        } else {
          setActiveTab('entry');
        }
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
      setUserRole(null);
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
      if (userRole === 'admin') refreshData();
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

  const handleQuickPayment = async (transactionId: string, additionalAmount: number) => {
    try {
      const tx = transactions.find(t => t._id === transactionId);
      if (!tx) return;

      const newAmountPaid = tx.amountPaid + additionalAmount;
      const response = await fetch(`/api/transactions/${transactionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amountPaid: newAmountPaid }),
      });

      if (response.ok) {
        const updatedTx = await response.json();
        setTransactions(prev => prev.map(t => t._id === transactionId ? updatedTx : t));
      }
    } catch (err) {
      console.error('Failed to record payment:', err);
    }
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
            <h1 style={{ fontSize: 24, marginBottom: 8 }}>Raymiton Dashboard</h1>
            <p style={{ color: 'var(--r-text-muted)', marginBottom: 30, fontSize: 14 }}>Enter your password to access the system</p>

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
                Login
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
            <div className="r-header-subtitle">
              {userRole === 'admin' ? 'Admin Dashboard' : 'Data Entry Terminal'}
            </div>
          </div>
        </div>
        <div className="r-header-actions">
          {userRole === 'admin' && transactions.length === 0 && (
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

      {/* Tabs - Only show for Admin */}
      {userRole === 'admin' && (
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
      )}

      {/* Content */}
      <main className="r-content">
        {userRole === 'admin' && (
          <div className="r-session-banner" style={{
            marginBottom: 20,
            padding: '12px 20px',
            borderRadius: 'var(--r-radius)',
            background: activeSession ? 'var(--r-green-bg)' : 'var(--r-red-bg)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            border: `1px solid ${activeSession ? 'var(--r-green)' : 'var(--r-red)'}`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: activeSession ? 'var(--r-green)' : 'var(--r-red)',
                boxShadow: `0 0 10px ${activeSession ? 'var(--r-green)' : 'var(--r-red)'}`
              }} />
              <div style={{ fontWeight: 600, color: activeSession ? 'var(--r-green)' : 'var(--r-red)' }}>
                {activeSession ? `Day Open: ${activeSession.date}` : 'Day Closed'}
              </div>
              {activeSession && (
                <div style={{ fontSize: 13, color: 'var(--r-text-dim)' }}>
                  Opening Balance: ₦{activeSession.openingBalance.toLocaleString()}
                </div>
              )}
            </div>
            {activeSession ? (
              <button className="r-btn r-btn-sm" onClick={() => { setShowSessionModal('CLOSE'); setSessionInput(''); }} style={{ background: 'var(--r-red)', color: 'white' }}>
                <Lock size={14} /> Close Day
              </button>
            ) : (
              <button className="r-btn r-btn-sm" onClick={() => { setShowSessionModal('OPEN'); setSessionInput('0'); }} style={{ background: 'var(--r-green)', color: 'white' }}>
                <PlusCircle size={14} /> Open New Day
              </button>
            )}
          </div>
        )}

        {/* Session Modal */}
        {showSessionModal && (
          <div className="r-modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <div className="r-card" style={{ maxWidth: 400, width: '100%', padding: 32, animation: 'slideUp 0.3s ease-out' }}>
              <h2 style={{ fontSize: 20, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
                {showSessionModal === 'OPEN' ? <PlusCircle className="r-text-green" /> : <Lock className="r-text-red" />}
                {showSessionModal === 'OPEN' ? 'Open New Day' : 'Close Active Day'}
              </h2>
              <p style={{ color: 'var(--r-text-dim)', fontSize: 14, marginBottom: 24 }}>
                {showSessionModal === 'OPEN' 
                  ? 'Enter the starting cash balance for today.' 
                  : 'Enter the actual cash amount in the drawer for reconciliation.'}
              </p>
              
              <div className="r-field" style={{ marginBottom: 24 }}>
                <label className="r-label">{showSessionModal === 'OPEN' ? 'Opening Balance (₦)' : 'Actual Cash in Hand (₦)'}</label>
                <input 
                  type="number" 
                  className="r-input" 
                  autoFocus 
                  value={sessionInput} 
                  onChange={(e) => setSessionInput(e.target.value)}
                  placeholder="0"
                />
              </div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button className="r-btn r-btn-ghost" onClick={() => setShowSessionModal(null)}>Cancel</button>
                <button 
                  className={`r-btn ${showSessionModal === 'OPEN' ? 'r-btn-success' : 'r-btn-danger'}`} 
                  onClick={showSessionModal === 'OPEN' ? handleOpenDay : handleCloseDay}
                >
                  {showSessionModal === 'OPEN' ? 'Open Day' : 'Close Day'}
                </button>
              </div>
            </div>
          </div>
        )}

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
                onRecordPayment={handleQuickPayment}
                activeSession={activeSession}
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
                inventory={inventory}
                recordedBy={userRole === 'admin' ? 'Admin' : 'Staff'}
              />
            )}

            {activeTab === 'transactions' && userRole === 'admin' && (
              <TransactionTable
                transactions={transactions}
                onEdit={handleEditClick}
                onDelete={handleDeleteTransaction}
                formatCurrency={formatCurrency}
                activeSession={activeSession}
              />
            )}
            {activeTab === 'inventory' && userRole === 'admin' && (
              <InventoryManager
                formatCurrency={formatCurrency}
                transactions={transactions}
              />
            )}


            {activeTab === 'bar' && userRole === 'admin' && (
              <BarAnalytics
                transactions={transactions}
                metrics={metrics}
                formatCurrency={formatCurrency}
              />
            )}

            {activeTab === 'rooms' && userRole === 'admin' && (
              <RoomManager
                transactions={transactions}
                roomDefaults={ROOM_DEFAULTS}
                formatCurrency={formatCurrency}
                onMarkPaid={handleMarkPaid}
              />
            )}

            {activeTab === 'analytics' && userRole === 'admin' && (
              <CalendarAnalytics
                transactions={transactions}
                formatCurrency={formatCurrency}
              />
            )}

            {activeTab === 'debtors' && userRole === 'admin' && (
              <DebtorTracker
                transactions={transactions}
                formatCurrency={formatCurrency}
                onMarkPaid={handleMarkPaid}
                onRecordPayment={handleQuickPayment}
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
