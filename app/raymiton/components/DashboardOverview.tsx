'use client';

import { useState } from 'react';
import { DashboardMetrics, ITransaction } from '../lib/types';
import {
  BarChart3,
  Banknote,
  TrendingUp,
  TrendingDown,
  BedDouble,
  Wine,
  CircleDollarSign,
  CircleDot,
  AlertTriangle,
  History,
  CalendarDays
} from 'lucide-react';

interface Props {
  metrics: DashboardMetrics | null;
  transactions: ITransaction[];
  formatCurrency: (n: number) => string;
  onRecordPayment: (transactionId: string, additionalAmount: number) => Promise<void>;
  activeSession: any;
}

export default function DashboardOverview({ metrics, transactions, formatCurrency, onRecordPayment, activeSession }: Props) {
  const [viewMode, setViewMode] = useState<'Daily' | 'Cumulative'>('Daily');

  if (!metrics) {
    return (
      <div className="r-empty">
        <div className="r-empty-icon"><BarChart3 size={48} /></div>
        <div className="r-empty-text">No data yet</div>
        <div className="r-empty-sub">Click &quot;Load Spreadsheet Data&quot; to import your existing records</div>
      </div>
    );
  }

  // Today's Date or Active Session Date
  const displayDate = activeSession ? activeSession.date : new Date().toISOString().split('T')[0];
  
  // Filter transactions for calculations
  const filteredTx = viewMode === 'Daily' 
    ? transactions.filter(t => new Date(t.date).toISOString().split('T')[0] === displayDate)
    : transactions;

  // Recent transactions (last 5)
  const recent = filteredTx.slice(0, 5);

  // Daily Summary (always show today/active date summary)
  const todayTx = transactions.filter((t) => {
    const txDate = new Date(t.date).toISOString().split('T')[0];
    return txDate === displayDate;
  });
  const todayIncome = todayTx
    .filter((t) => t.type === 'INCOME')
    .reduce((s, t) => s + t.amountPaid, 0);
  const todayExpense = todayTx
    .filter((t) => t.type === 'EXPENSE')
    .reduce((s, t) => s + t.totalCharged, 0);

  // Metrics for display
  const currentMetrics = viewMode === 'Daily' ? {
    totalRevenue: todayIncome,
    totalExpenses: todayExpense,
    netProfit: todayIncome - todayExpense,
    roomRevenue: todayTx.filter(t => t.category === 'Rooms' && t.type === 'INCOME').reduce((s, t) => s + t.amountPaid, 0),
    barRevenue: todayTx.filter(t => t.category === 'Bar' && t.type === 'INCOME' && !t.isSnooker).reduce((s, t) => s + t.amountPaid, 0),
    barExpenses: todayTx.filter(t => t.category === 'Bar' && t.type === 'EXPENSE').reduce((s, t) => s + t.totalCharged, 0),
    barProfit: 0, // Calculated below
    snookerRevenue: todayTx.filter(t => t.isSnooker && t.type === 'INCOME').reduce((s, t) => s + t.amountPaid, 0),
    totalOutstanding: todayTx.reduce((s, t) => s + t.balanceOwed, 0),
    transactionCount: todayTx.length
  } : metrics;

  // Fix barProfit for daily
  if (viewMode === 'Daily') {
    currentMetrics.barProfit = currentMetrics.barRevenue - currentMetrics.barExpenses;
  }

  const cards = [
    {
      label: 'Total Revenue',
      value: formatCurrency(currentMetrics.totalRevenue),
      icon: <Banknote size={24} />,
      bg: 'var(--r-green-bg)',
      color: 'var(--r-green)',
      sub: `${filteredTx.filter((t) => t.type === 'INCOME').length} income entries`,
    },
    {
      label: 'Total Expenses',
      value: formatCurrency(currentMetrics.totalExpenses),
      icon: <TrendingDown size={24} />,
      bg: 'var(--r-red-bg)',
      color: 'var(--r-red)',
      sub: `${filteredTx.filter((t) => t.type === 'EXPENSE').length} expense entries`,
    },
    {
      label: 'Net Profit',
      value: formatCurrency(currentMetrics.netProfit),
      icon: currentMetrics.netProfit >= 0 ? <TrendingUp size={24} /> : <TrendingDown size={24} />,
      bg: currentMetrics.netProfit >= 0 ? 'var(--r-green-bg)' : 'var(--r-red-bg)',
      color: currentMetrics.netProfit >= 0 ? 'var(--r-green)' : 'var(--r-red)',
      sub: currentMetrics.netProfit >= 0 ? 'In the green' : 'In the red',
    },
    {
      label: 'Room Revenue',
      value: formatCurrency(currentMetrics.roomRevenue),
      icon: <BedDouble size={24} />,
      bg: 'var(--r-blue-bg)',
      color: 'var(--r-blue)',
      sub: `${filteredTx.filter((t) => t.category === 'Rooms' && t.type === 'INCOME').length} bookings`,
    },
    {
      label: 'Bar Revenue',
      value: formatCurrency(currentMetrics.barRevenue),
      icon: <Wine size={24} />,
      bg: 'var(--r-orange-bg)',
      color: 'var(--r-orange)',
      sub: 'Excluding snooker',
    },
    {
      label: 'Bar Profit',
      value: formatCurrency(currentMetrics.barProfit),
      icon: <CircleDollarSign size={24} />,
      bg: currentMetrics.barProfit >= 0 ? 'var(--r-green-bg)' : 'var(--r-red-bg)',
      color: currentMetrics.barProfit >= 0 ? 'var(--r-green)' : 'var(--r-red)',
      sub: `Cost: ${formatCurrency(currentMetrics.barExpenses)}`,
    },
    {
      label: 'Snooker Revenue',
      value: formatCurrency(currentMetrics.snookerRevenue),
      icon: <CircleDot size={24} />,
      bg: 'var(--r-accent-glow)',
      color: 'var(--r-accent)',
      sub: 'Tracked separately',
    },
    {
      label: 'Outstanding Debts',
      value: formatCurrency(currentMetrics.totalOutstanding),
      icon: <AlertTriangle size={24} />,
      bg: currentMetrics.totalOutstanding > 0 ? 'var(--r-red-bg)' : 'var(--r-green-bg)',
      color: currentMetrics.totalOutstanding > 0 ? 'var(--r-red)' : 'var(--r-green)',
      sub: `${filteredTx.filter((t) => t.balanceOwed > 0).length} unpaid entries`,
    },
  ];

  return (
    <div>
      {/* Header with Title and Subtle Toggle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10 }}>
          <CalendarDays size={20} className="r-text-accent" />
          {viewMode === 'Daily' ? 'Today\'s Performance' : 'All-Time Performance'}
        </h2>
        <button 
          onClick={() => setViewMode(viewMode === 'Daily' ? 'Cumulative' : 'Daily')}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: 'var(--r-text-dim)', 
            fontSize: 12, 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 8px',
            borderRadius: 4,
            transition: 'var(--r-transition)'
          }}
          className="r-hover-bg"
        >
          {viewMode === 'Daily' ? <History size={14} /> : <CalendarDays size={14} />}
          {viewMode === 'Daily' ? 'Switch to All-Time' : 'Back to Daily View'}
        </button>
      </div>

      {/* Today's Quick Stats */}
      {(todayIncome > 0 || todayExpense > 0) && (
        <div style={{ marginBottom: 24, padding: '16px 20px', background: 'var(--r-bg-card)', borderRadius: 'var(--r-radius)', border: '1px solid var(--r-border)' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--r-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 12 }}>
            {viewMode === 'Daily' ? 'Current Session Performance' : "Today's Summary"}
          </div>
          <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
            <div>
              <span style={{ color: 'var(--r-green)', fontWeight: 800, fontSize: 20 }}>{formatCurrency(todayIncome)}</span>
              <span style={{ color: 'var(--r-text-muted)', fontSize: 13, marginLeft: 8, fontWeight: 500 }}>income</span>
            </div>
            <div>
              <span style={{ color: 'var(--r-red)', fontWeight: 800, fontSize: 20 }}>{formatCurrency(todayExpense)}</span>
              <span style={{ color: 'var(--r-text-muted)', fontSize: 13, marginLeft: 8, fontWeight: 500 }}>expenses</span>
            </div>
            <div>
              <span style={{ color: todayIncome - todayExpense >= 0 ? 'var(--r-green)' : 'var(--r-red)', fontWeight: 800, fontSize: 20 }}>
                {formatCurrency(todayIncome - todayExpense)}
              </span>
              <span style={{ color: 'var(--r-text-muted)', fontSize: 13, marginLeft: 8, fontWeight: 500 }}>net</span>
            </div>
          </div>
        </div>
      )}

      {/* Metric Cards */}
      <div className="r-metrics">
        {cards.map((card) => (
          <div key={card.label} className="r-metric-card">
            <div className="r-metric-header">
              <div className="r-metric-icon" style={{ background: card.bg, color: card.color }}>
                {card.icon}
              </div>
            </div>
            <div className="r-metric-label">{card.label}</div>
            <div className="r-metric-value r-currency" style={{ color: card.color }}>
              {card.value}
            </div>
            <div className="r-metric-sub">{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Recent Transactions */}
      <div className="r-table-wrap">
        <div className="r-table-header">
          <div className="r-table-title">{viewMode === 'Daily' ? 'Session Transactions' : 'Recent Transactions'}</div>
          <div className="r-metric-sub">{viewMode === 'Daily' ? `${todayTx.length} items recorded today` : `${metrics.transactionCount} total entries`}</div>
        </div>
        <div className="r-table-overflow">
          <table className="r-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Category</th>
                <th>Description</th>
                <th>Charged</th>
                <th>Paid</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--r-text-muted)' }}>
                    No transactions yet
                  </td>
                </tr>
              ) : (
                recent.map((tx) => (
                  <tr key={tx._id}>
                    <td>{new Date(tx.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</td>
                    <td>
                      <span className={`r-badge r-badge-${tx.type.toLowerCase()}`}>
                        {tx.type}
                      </span>
                    </td>
                    <td>{tx.category}</td>
                    <td>{tx.description}</td>
                    <td className="r-currency">{formatCurrency(tx.totalCharged)}</td>
                    <td className="r-currency">{formatCurrency(tx.amountPaid)}</td>
                    <td>
                      <span className={`r-badge ${tx.status === 'Paid' ? 'r-badge-paid' : tx.status === 'Part Payment' ? 'r-badge-part' : 'r-badge-not-paid'}`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
