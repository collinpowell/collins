'use client';

import { ITransaction, DashboardMetrics } from '../lib/types';
import { Wine, Package, CircleDollarSign, CircleDot, AlertTriangle, ShoppingCart } from 'lucide-react';

interface Props {
  transactions: ITransaction[];
  metrics: DashboardMetrics | null;
  formatCurrency: (n: number) => string;
}

export default function BarAnalytics({ transactions, metrics, formatCurrency }: Props) {
  const barIncome = transactions.filter((t) => t.type === 'INCOME' && t.category === 'Bar' && !t.isSnooker);
  const barExpenses = transactions.filter((t) => t.type === 'EXPENSE' && t.category === 'Bar');
  const snookerEntries = transactions.filter((t) => t.isSnooker);
  const barDebtors = barIncome.filter((t) => t.balanceOwed > 0);

  // Group bar sales by description for "items sold" view
  const salesMap = new Map<string, { qty: number; total: number }>();
  barIncome.forEach((t) => {
    const key = t.description;
    const existing = salesMap.get(key) || { qty: 0, total: 0 };
    salesMap.set(key, { qty: existing.qty + 1, total: existing.total + t.totalCharged });
  });

  // Group bar purchases
  const purchaseMap = new Map<string, { qty: number; total: number }>();
  barExpenses.forEach((t) => {
    const key = t.description;
    const existing = purchaseMap.get(key) || { qty: 0, total: 0 };
    purchaseMap.set(key, { qty: existing.qty + 1, total: existing.total + t.totalCharged });
  });

  return (
    <div>
      {/* Bar Metric Cards */}
      <div className="r-metrics" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
        <div className="r-metric-card">
          <div className="r-metric-header">
            <div className="r-metric-icon" style={{ background: 'var(--r-green-bg)', color: 'var(--r-green)' }}><Wine size={24} /></div>
          </div>
          <div className="r-metric-label">Bar Revenue</div>
          <div className="r-metric-value r-currency r-positive">{formatCurrency(metrics?.barRevenue || 0)}</div>
          <div className="r-metric-sub">Excl. snooker</div>
        </div>
        <div className="r-metric-card">
          <div className="r-metric-header">
            <div className="r-metric-icon" style={{ background: 'var(--r-red-bg)', color: 'var(--r-red)' }}><Package size={24} /></div>
          </div>
          <div className="r-metric-label">Bar Purchases</div>
          <div className="r-metric-value r-currency r-negative">{formatCurrency(metrics?.barExpenses || 0)}</div>
          <div className="r-metric-sub">Restocking costs</div>
        </div>
        <div className="r-metric-card">
          <div className="r-metric-header">
            <div className="r-metric-icon" style={{ background: (metrics?.barProfit || 0) >= 0 ? 'var(--r-green-bg)' : 'var(--r-red-bg)', color: (metrics?.barProfit || 0) >= 0 ? 'var(--r-green)' : 'var(--r-red)' }}><CircleDollarSign size={24} /></div>
          </div>
          <div className="r-metric-label">Bar Profit</div>
          <div className="r-metric-value r-currency" style={{ color: (metrics?.barProfit || 0) >= 0 ? 'var(--r-green)' : 'var(--r-red)' }}>{formatCurrency(metrics?.barProfit || 0)}</div>
          <div className="r-metric-sub">Revenue − Purchases</div>
        </div>
        <div className="r-metric-card">
          <div className="r-metric-header">
            <div className="r-metric-icon" style={{ background: 'var(--r-accent-glow)', color: 'var(--r-accent)' }}><CircleDot size={24} /></div>
          </div>
          <div className="r-metric-label">Snooker</div>
          <div className="r-metric-value r-currency" style={{ color: 'var(--r-accent)' }}>{formatCurrency(metrics?.snookerRevenue || 0)}</div>
          <div className="r-metric-sub">{snookerEntries.length} sessions</div>
        </div>
        <div className="r-metric-card">
          <div className="r-metric-header">
            <div className="r-metric-icon" style={{ background: barDebtors.length > 0 ? 'var(--r-red-bg)' : 'var(--r-green-bg)', color: barDebtors.length > 0 ? 'var(--r-red)' : 'var(--r-green)' }}><AlertTriangle size={24} /></div>
          </div>
          <div className="r-metric-label">Bar Debts</div>
          <div className="r-metric-value r-currency" style={{ color: barDebtors.length > 0 ? 'var(--r-red)' : 'var(--r-green)' }}>
            {formatCurrency(barDebtors.reduce((s, t) => s + t.balanceOwed, 0))}
          </div>
          <div className="r-metric-sub">{barDebtors.length} unpaid</div>
        </div>
      </div>

      <div className="r-bar-grid">
        {/* Items Sold */}
        <div className="r-bar-card">
          <div className="r-bar-card-title"><ShoppingCart size={18} className="r-text-accent" /> Items Sold ({barIncome.length} sales)</div>
          {salesMap.size === 0 ? (
            <div style={{ color: 'var(--r-text-dim)', fontSize: 13, padding: '12px 0' }}>No bar sales recorded</div>
          ) : (
            Array.from(salesMap.entries()).map(([desc, data]) => (
              <div key={desc} className="r-bar-row">
                <span style={{ flex: 1 }}>{desc}</span>
                <span style={{ color: 'var(--r-text-muted)', marginRight: 12 }}>×{data.qty}</span>
                <span style={{ fontWeight: 600, color: 'var(--r-green)' }}>{formatCurrency(data.total)}</span>
              </div>
            ))
          )}
        </div>

        {/* Purchases / Restock */}
        <div className="r-bar-card">
          <div className="r-bar-card-title"><Package size={18} className="r-text-accent" /> Purchases / Restock ({barExpenses.length} items)</div>
          {purchaseMap.size === 0 ? (
            <div style={{ color: 'var(--r-text-dim)', fontSize: 13, padding: '12px 0' }}>No bar purchases recorded</div>
          ) : (
            Array.from(purchaseMap.entries()).map(([desc, data]) => (
              <div key={desc} className="r-bar-row">
                <span style={{ flex: 1 }}>{desc}</span>
                <span style={{ color: 'var(--r-text-muted)', marginRight: 12 }}>×{data.qty}</span>
                <span style={{ fontWeight: 600, color: 'var(--r-red)' }}>{formatCurrency(data.total)}</span>
              </div>
            ))
          )}
        </div>

        {/* Bar Debts */}
        {barDebtors.length > 0 && (
          <div className="r-bar-card">
            <div className="r-bar-card-title"><AlertTriangle size={18} className="r-text-accent" /> Unpaid Bar Tabs</div>
            {barDebtors.map((t) => (
              <div key={t._id} className="r-bar-row">
                <span style={{ flex: 1 }}>{t.description}</span>
                <span style={{ color: 'var(--r-text-muted)', fontSize: 12, marginRight: 12 }}>{new Date(t.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</span>
                <span style={{ fontWeight: 600, color: 'var(--r-red)' }}>{formatCurrency(t.balanceOwed)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
