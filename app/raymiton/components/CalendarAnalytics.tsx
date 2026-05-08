'use client';

import { useState } from 'react';
import { ITransaction } from '../lib/types';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  TrendingUp, 
  TrendingDown, 
  Wallet,
  BarChart2,
  PieChart
} from 'lucide-react';

interface Props {
  transactions: ITransaction[];
  formatCurrency: (n: number) => string;
}

type ViewType = 'daily' | 'weekly' | 'monthly';

export default function CalendarAnalytics({ transactions, formatCurrency }: Props) {
  const [view, setView] = useState<ViewType>('daily');
  const [currentDate, setCurrentDate] = useState(new Date());

  // Navigation handlers
  const navigate = (direction: number) => {
    const next = new Date(currentDate);
    if (view === 'daily') next.setDate(next.getDate() + direction);
    if (view === 'weekly') next.setDate(next.getDate() + (direction * 7));
    if (view === 'monthly') next.setMonth(next.getMonth() + direction);
    setCurrentDate(next);
  };

  // Date Range Logic
  const getRange = () => {
    const start = new Date(currentDate);
    const end = new Date(currentDate);

    if (view === 'daily') {
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      return { start, end, label: start.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) };
    }

    if (view === 'weekly') {
      const day = start.getDay();
      const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Start Monday
      start.setDate(diff);
      start.setHours(0, 0, 0, 0);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      return { 
        start, 
        end, 
        label: `${start.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} - ${end.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}` 
      };
    }

    if (view === 'monthly') {
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(start.getMonth() + 1);
      end.setDate(0);
      end.setHours(23, 59, 59, 999);
      return { start, end, label: start.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }) };
    }

    return { start, end, label: '' };
  };

  const { start, end, label } = getRange();

  // Filter transactions
  const filtered = transactions.filter(t => {
    const d = new Date(t.date);
    return d >= start && d <= end;
  });

  // Calculate Metrics
  const income = filtered.filter(t => t.type === 'INCOME').reduce((s, t) => s + t.amountPaid, 0);
  const expense = filtered.filter(t => t.type === 'EXPENSE').reduce((s, t) => s + t.totalCharged, 0);
  const profit = income - expense;

  // Breakdown by Category
  const categories = ['Rooms', 'Bar', 'Utilities', 'Supplies', 'Salaries', 'Other'];
  const catData = categories.map(cat => ({
    name: cat,
    income: filtered.filter(t => t.category === cat && t.type === 'INCOME').reduce((s, t) => s + t.amountPaid, 0),
    expense: filtered.filter(t => t.category === cat && t.type === 'EXPENSE').reduce((s, t) => s + t.totalCharged, 0)
  })).filter(c => c.income > 0 || c.expense > 0);

  return (
    <div className="r-analytics">
      {/* Header Controls */}
      <div className="r-analytics-header">
        <div className="r-toggle-group">
          <button className={`r-toggle-btn ${view === 'daily' ? 'active' : ''}`} onClick={() => setView('daily')}>Daily</button>
          <button className={`r-toggle-btn ${view === 'weekly' ? 'active' : ''}`} onClick={() => setView('weekly')}>Weekly</button>
          <button className={`r-toggle-btn ${view === 'monthly' ? 'active' : ''}`} onClick={() => setView('monthly')}>Monthly</button>
        </div>

        <div className="r-calendar-nav">
          <button className="r-btn-icon" onClick={() => navigate(-1)}><ChevronLeft size={20} /></button>
          <div className="r-calendar-label">
            <Calendar size={18} className="r-text-accent" />
            <span>{label}</span>
          </div>
          <button className="r-btn-icon" onClick={() => navigate(1)}><ChevronRight size={20} /></button>
        </div>
      </div>

      {/* Main Stats */}
      <div className="r-metrics" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', marginBottom: 32 }}>
        <div className="r-metric-card" style={{ borderLeft: '4px solid var(--r-green)' }}>
          <div className="r-metric-label">Total Revenue</div>
          <div className="r-metric-value" style={{ color: 'var(--r-green)' }}>{formatCurrency(income)}</div>
          <div className="r-metric-sub">{filtered.filter(t => t.type === 'INCOME').length} income entries</div>
        </div>
        <div className="r-metric-card" style={{ borderLeft: '4px solid var(--r-red)' }}>
          <div className="r-metric-label">Total Expenses</div>
          <div className="r-metric-value" style={{ color: 'var(--r-red)' }}>{formatCurrency(expense)}</div>
          <div className="r-metric-sub">{filtered.filter(t => t.type === 'EXPENSE').length} expense entries</div>
        </div>
        <div className="r-metric-card" style={{ borderLeft: `4px solid ${profit >= 0 ? 'var(--r-accent)' : 'var(--r-red)'}` }}>
          <div className="r-metric-label">Net Profit</div>
          <div className="r-metric-value" style={{ color: profit >= 0 ? 'var(--r-accent)' : 'var(--r-red)' }}>{formatCurrency(profit)}</div>
          <div className="r-metric-sub">{profit >= 0 ? 'Surplus' : 'Deficit'} for this {view}</div>
        </div>
      </div>

      <div className="r-analytics-grid">
        {/* Category Breakdown */}
        <div className="r-bar-card">
          <div className="r-bar-card-title"><PieChart size={18} className="r-text-accent" /> Financial Breakdown by Category</div>
          <div style={{ marginTop: 16 }}>
            {catData.length === 0 ? (
              <div className="r-empty-sub" style={{ padding: '20px 0' }}>No activity in this timeframe</div>
            ) : (
              catData.map(cat => (
                <div key={cat.name} style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14, fontWeight: 600 }}>
                    <span>{cat.name}</span>
                    <span style={{ color: cat.income - cat.expense >= 0 ? 'var(--r-green)' : 'var(--r-red)' }}>
                      {formatCurrency(cat.income - cat.expense)}
                    </span>
                  </div>
                  <div className="r-progress-bg" style={{ height: 10, background: 'var(--r-bg-input)', borderRadius: 5, overflow: 'hidden', display: 'flex' }}>
                    <div style={{ 
                      width: `${(cat.income / (income + expense || 1)) * 100}%`, 
                      background: 'var(--r-green)',
                      opacity: 0.8
                    }} />
                    <div style={{ 
                      width: `${(cat.expense / (income + expense || 1)) * 100}%`, 
                      background: 'var(--r-red)',
                      opacity: 0.8
                    }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 11, color: 'var(--r-text-dim)' }}>
                    <span>In: {formatCurrency(cat.income)}</span>
                    <span>Out: {formatCurrency(cat.expense)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Expenses */}
        <div className="r-bar-card">
          <div className="r-bar-card-title"><TrendingDown size={18} className="r-red" /> Largest Expenses</div>
          <div style={{ marginTop: 16 }}>
            {filtered.filter(t => t.type === 'EXPENSE').sort((a, b) => b.totalCharged - a.totalCharged).slice(0, 5).map((t, i) => (
              <div key={i} className="r-bar-row">
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{t.description}</div>
                  <div style={{ fontSize: 12, color: 'var(--r-text-dim)' }}>{t.category} • {new Date(t.date).toLocaleDateString()}</div>
                </div>
                <div style={{ fontWeight: 700, color: 'var(--r-red)' }}>{formatCurrency(t.totalCharged)}</div>
              </div>
            ))}
            {filtered.filter(t => t.type === 'EXPENSE').length === 0 && (
               <div className="r-empty-sub" style={{ padding: '20px 0' }}>No expenses recorded</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
