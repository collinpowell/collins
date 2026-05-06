'use client';

import { ITransaction } from '../lib/types';
import { ShieldCheck, CircleDollarSign, Users, UserMinus, Edit2, CheckCircle2 } from 'lucide-react';

interface Props {
  transactions: ITransaction[];
  formatCurrency: (n: number) => string;
  onMarkPaid: (id: string, totalCharged: number) => void;
  onRecordPayment: (id: string, amount: number) => void;
  onEdit: (tx: ITransaction) => void;
}

function extractName(description: string): string {
  // Try to extract a person's name from descriptions like "Lodge Jiro (Night) Room 2"
  // or "2 Malt 1 Fanta 2 bottle water (Jiro)"
  const patterns = [
    /Lodge\s+[-–]?\s*(.+?)\s*\(/i,
    /Lodge\s+(.+?)\s+Room/i,
    /\(([A-Za-z\s]+)\)\s*$/,
    /Lodge\s+[-–]?\s*\((.+?)\)/i,
  ];
  for (const p of patterns) {
    const match = description.match(p);
    if (match && match[1]) {
      const name = match[1].trim().replace(/^[-–\s]+/, '');
      // Filter out generic words
      if (!['Night', 'Short', 'Room', 'Customer'].some(w => name === w)) {
        return name;
      }
    }
  }
  return 'Unknown';
}

export default function DebtorTracker({ transactions, formatCurrency, onMarkPaid, onRecordPayment, onEdit }: Props) {
  const unpaid = transactions.filter((t) => t.type === 'INCOME' && t.balanceOwed > 0);

  // Group by extracted name
  const debtorMap = new Map<string, ITransaction[]>();
  unpaid.forEach((t) => {
    const name = extractName(t.description);
    const existing = debtorMap.get(name) || [];
    debtorMap.set(name, [...existing, t]);
  });

  const debtors = Array.from(debtorMap.entries())
    .map(([name, txs]) => ({
      name,
      transactions: txs,
      totalOwed: txs.reduce((s, t) => s + t.balanceOwed, 0),
      categories: [...new Set(txs.map(t => t.category))],
    }))
    .sort((a, b) => b.totalOwed - a.totalOwed);

  const totalOwed = debtors.reduce((s, d) => s + d.totalOwed, 0);

  if (debtors.length === 0) {
    return (
      <div className="r-empty">
        <div className="r-empty-icon"><ShieldCheck size={48} className="r-text-green" /></div>
        <div className="r-empty-text">No outstanding debts!</div>
        <div className="r-empty-sub">Everyone is paid up</div>
      </div>
    );
  }

  return (
    <div>
      {/* Summary */}
      <div className="r-metrics" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: 24 }}>
        <div className="r-metric-card">
          <div className="r-metric-header">
            <div className="r-metric-icon" style={{ background: 'var(--r-red-bg)', color: 'var(--r-red)' }}><CircleDollarSign size={24} /></div>
          </div>
          <div className="r-metric-label">Total Outstanding</div>
          <div className="r-metric-value r-currency r-negative">{formatCurrency(totalOwed)}</div>
          <div className="r-metric-sub">{unpaid.length} unpaid entries</div>
        </div>
        <div className="r-metric-card">
          <div className="r-metric-header">
            <div className="r-metric-icon" style={{ background: 'var(--r-yellow-bg)', color: 'var(--r-yellow)' }}><Users size={24} /></div>
          </div>
          <div className="r-metric-label">Debtors</div>
          <div className="r-metric-value" style={{ color: 'var(--r-yellow)' }}>{debtors.length}</div>
          <div className="r-metric-sub">people owing</div>
        </div>
      </div>

      <div className="r-section-title"><UserMinus size={22} className="r-text-accent" /> Who Owes What</div>
      <div className="r-debtor-list">
        {debtors.map((debtor) => (
          <div key={debtor.name} className="r-debtor-card">
            <div className="r-debtor-header">
              <div>
                <div className="r-debtor-name">{debtor.name}</div>
                <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                  {debtor.categories.map((cat) => (
                    <span key={cat} className={`r-badge ${cat === 'Rooms' ? 'r-badge-room' : 'r-badge-bar'}`}>
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
              <div className="r-debtor-total">{formatCurrency(debtor.totalOwed)}</div>
            </div>
            <div className="r-debtor-items">
              {debtor.transactions.map((t) => (
                <div key={t._id} className="r-debtor-item">
                  <span style={{ fontSize: 12, color: 'var(--r-text-dim)', marginRight: 10, whiteSpace: 'nowrap' }}>
                    {new Date(t.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                  </span>
                  <span className="r-debtor-item-desc">{t.description}</span>
                  <span className="r-debtor-item-amt">{formatCurrency(t.balanceOwed)}</span>
                  {t.amountPaid > 0 && (
                    <span style={{ fontSize: 11, color: 'var(--r-yellow)', marginRight: 8 }}>
                      (paid {formatCurrency(t.amountPaid)})
                    </span>
                  )}
                  <button className="r-btn-icon" onClick={() => onEdit(t)} title="Edit payment" style={{ marginRight: 4 }}>
                    <Edit2 size={16} />
                  </button>
                  <button className="r-btn r-btn-ghost r-btn-sm" onClick={() => {
                    const amt = prompt('Enter amount to pay:');
                    if (amt && !isNaN(parseFloat(amt))) {
                      onRecordPayment(t._id!, parseFloat(amt));
                    }
                  }} style={{ fontSize: 11, padding: '4px 8px', marginRight: 4 }}>
                    Pay Part
                  </button>
                  <button className="r-btn r-btn-success r-btn-sm" onClick={() => onMarkPaid(t._id!, t.totalCharged)} style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <CheckCircle2 size={14} /> Full Pay
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
