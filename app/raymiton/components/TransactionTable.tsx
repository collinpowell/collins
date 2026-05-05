'use client';

import { useState } from 'react';
import { ITransaction } from '../lib/types';
import { 
  List, 
  Search, 
  TrendingUp, 
  TrendingDown, 
  CircleDot, 
  Edit2, 
  Trash2,
  RefreshCcw,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface Props {
  transactions: ITransaction[];
  onEdit: (tx: ITransaction) => void;
  onDelete: (id: string) => void;
  formatCurrency: (n: number) => string;
}

export default function TransactionTable({ transactions, onEdit, onDelete, formatCurrency }: Props) {
  const [filterCat, setFilterCat] = useState<string>('All');
  const [filterType, setFilterType] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const filtered = transactions.filter((tx) => {
    if (filterCat !== 'All' && tx.category !== filterCat) return false;
    if (filterType !== 'All' && tx.type !== filterType) return false;
    if (filterStatus !== 'All' && tx.status !== filterStatus) return false;
    if (search && !tx.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }).sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return sortDir === 'desc' ? dateB - dateA : dateA - dateB;
  });

  const toggleSort = () => {
    setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="r-table-wrap">
      <div className="r-table-header">
        <div className="r-table-title">
          <List size={22} className="r-text-accent" style={{ marginRight: 8 }} />
          All Transactions ({filtered.length})
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: 10, color: 'var(--r-text-muted)' }} />
          <input
            type="text"
            className="r-input"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 180, padding: '6px 12px 6px 30px', fontSize: 12 }}
          />
        </div>
      </div>
      <div style={{ padding: '8px 20px', display: 'flex', gap: 6, flexWrap: 'wrap', borderBottom: '1px solid var(--r-border)' }}>
        {['All', 'INCOME', 'EXPENSE'].map((t) => (
          <button 
            key={t} 
            className={`r-filter-chip ${filterType === t ? 'active' : ''}`} 
            onClick={() => setFilterType(t)}
          >
            {t === 'All' ? <><RefreshCcw size={14} /> All Types</> : t === 'INCOME' ? <><TrendingUp size={14} /> Income</> : <><TrendingDown size={14} /> Expense</>}
          </button>
        ))}
        <span style={{ borderLeft: '1px solid var(--r-border)', margin: '0 4px' }} />
        {['All', 'Rooms', 'Bar', 'Utilities', 'Supplies', 'Salaries'].map((c) => (
          <button key={c} className={`r-filter-chip ${filterCat === c ? 'active' : ''}`} onClick={() => setFilterCat(c)}>{c}</button>
        ))}
        <span style={{ borderLeft: '1px solid var(--r-border)', margin: '0 4px' }} />
        {['All', 'Paid', 'Part Payment', 'Not Paid'].map((s) => (
          <button key={s} className={`r-filter-chip ${filterStatus === s ? 'active' : ''}`} onClick={() => setFilterStatus(s)}>{s}</button>
        ))}
      </div>
      <div className="r-table-overflow">
        <table className="r-table">
          <thead>
            <tr>
              <th onClick={toggleSort} style={{ cursor: 'pointer', userSelect: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  Date {sortDir === 'desc' ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                </div>
              </th>
              <th>Type</th>
              <th>Category</th>
              <th>Description</th>
              <th>Charged</th>
              <th>Paid</th>
              <th>Balance</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={9} style={{ textAlign: 'center', padding: 40, color: 'var(--r-text-muted)' }}>No transactions found</td></tr>
            ) : (
              filtered.map((tx) => (
                <tr key={tx._id}>
                  <td style={{ whiteSpace: 'nowrap' }}>{new Date(tx.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                  <td><span className={`r-badge r-badge-${tx.type.toLowerCase()}`}>{tx.type}</span></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {tx.isSnooker && <CircleDot size={14} className="r-text-accent" />}
                      {tx.category}
                    </div>
                  </td>
                  <td style={{ maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tx.description}</td>
                  <td className="r-currency">{formatCurrency(tx.totalCharged)}</td>
                  <td className="r-currency">{formatCurrency(tx.amountPaid)}</td>
                  <td className="r-currency" style={{ color: tx.balanceOwed > 0 ? 'var(--r-red)' : 'var(--r-text-dim)' }}>{tx.balanceOwed > 0 ? formatCurrency(tx.balanceOwed) : '-'}</td>
                  <td><span className={`r-badge ${tx.status === 'Paid' ? 'r-badge-paid' : tx.status === 'Part Payment' ? 'r-badge-part' : 'r-badge-not-paid'}`}>{tx.status}</span></td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="r-btn-icon" onClick={() => onEdit(tx)} title="Edit">
                        <Edit2 size={16} />
                      </button>
                      <button className="r-btn-icon danger" onClick={() => onDelete(tx._id!)} title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
