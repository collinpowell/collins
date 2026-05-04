'use client';

import { ITransaction, RoomConfig } from '../lib/types';
import { BedDouble, BarChart2, AlertTriangle, Home, Check } from 'lucide-react';

interface Props {
  transactions: ITransaction[];
  roomDefaults: RoomConfig[];
  formatCurrency: (n: number) => string;
  onMarkPaid: (id: string, totalCharged: number) => void;
}

export default function RoomManager({ transactions, roomDefaults, formatCurrency, onMarkPaid }: Props) {
  const roomTransactions = transactions.filter((t) => t.category === 'Rooms' && t.type === 'INCOME');

  // Get room stats
  const getRoomData = (roomNum: number) => {
    const roomTx = roomTransactions.filter((t) => t.roomNumber === roomNum);
    const totalRevenue = roomTx.reduce((s, t) => s + t.amountPaid, 0);
    const totalBookings = roomTx.length;
    const unpaid = roomTx.filter((t) => t.balanceOwed > 0);
    const totalOwed = unpaid.reduce((s, t) => s + t.balanceOwed, 0);
    // Most recent booking
    const latest = roomTx.length > 0 ? roomTx[0] : null;

    return { roomTx, totalRevenue, totalBookings, unpaid, totalOwed, latest };
  };

  // Overall room stats
  const totalRoomRevenue = roomTransactions.reduce((s, t) => s + t.amountPaid, 0);
  const totalRoomOwed = roomTransactions.filter(t => t.balanceOwed > 0).reduce((s, t) => s + t.balanceOwed, 0);

  return (
    <div>
      {/* Summary */}
      <div className="r-metrics" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: 24 }}>
        <div className="r-metric-card">
          <div className="r-metric-header">
            <div className="r-metric-icon" style={{ background: 'var(--r-blue-bg)', color: 'var(--r-blue)' }}><BedDouble size={24} /></div>
          </div>
          <div className="r-metric-label">Total Room Revenue</div>
          <div className="r-metric-value r-currency r-positive">{formatCurrency(totalRoomRevenue)}</div>
        </div>
        <div className="r-metric-card">
          <div className="r-metric-header">
            <div className="r-metric-icon" style={{ background: 'var(--r-green-bg)', color: 'var(--r-green)' }}><BarChart2 size={24} /></div>
          </div>
          <div className="r-metric-label">Total Bookings</div>
          <div className="r-metric-value" style={{ color: 'var(--r-blue)' }}>{roomTransactions.length}</div>
        </div>
        <div className="r-metric-card">
          <div className="r-metric-header">
            <div className="r-metric-icon" style={{ background: totalRoomOwed > 0 ? 'var(--r-red-bg)' : 'var(--r-green-bg)', color: totalRoomOwed > 0 ? 'var(--r-red)' : 'var(--r-green)' }}><AlertTriangle size={24} /></div>
          </div>
          <div className="r-metric-label">Room Debts</div>
          <div className="r-metric-value r-currency" style={{ color: totalRoomOwed > 0 ? 'var(--r-red)' : 'var(--r-green)' }}>{formatCurrency(totalRoomOwed)}</div>
        </div>
      </div>

      {/* Room Cards */}
      <div className="r-section-title"><Home size={22} className="r-text-accent" /> Room Overview</div>
      <div className="r-rooms-grid">
        {roomDefaults.map((room) => {
          const data = getRoomData(room.number);
          const hasDebt = data.totalOwed > 0;
          const statusClass = hasDebt ? 'debt' : data.latest ? 'occupied' : 'vacant';

          return (
            <div key={room.number} className={`r-room-card ${statusClass}`}>
              <div className="r-room-header">
                <div>
                  <div className="r-room-num">Room {room.number}</div>
                  <div className="r-room-price">Default: ₦{room.defaultNightPrice.toLocaleString()}/night · ₦{room.defaultShortPrice.toLocaleString()}/short</div>
                </div>
                <span className={`r-room-status r-badge ${hasDebt ? 'r-badge-not-paid' : 'r-badge-paid'}`}>
                  {hasDebt ? `₦${data.totalOwed.toLocaleString()} owed` : `${data.totalBookings} bookings`}
                </span>
              </div>

              <div className="r-room-detail">
                <span className="r-room-detail-label">Total Revenue</span>
                <span className="r-room-detail-val r-positive">{formatCurrency(data.totalRevenue)}</span>
              </div>
              <div className="r-room-detail">
                <span className="r-room-detail-label">Total Bookings</span>
                <span className="r-room-detail-val">{data.totalBookings}</span>
              </div>
              {data.latest && (
                <div className="r-room-detail">
                  <span className="r-room-detail-label">Latest</span>
                  <span className="r-room-detail-val" style={{ fontSize: 12 }}>{data.latest.description}</span>
                </div>
              )}

              {/* Unpaid entries for this room */}
              {data.unpaid.length > 0 && (
                <div style={{ marginTop: 12, borderTop: '1px solid var(--r-border)', paddingTop: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--r-red)', textTransform: 'uppercase', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4 }}><AlertTriangle size={12} /> Unpaid</div>
                  {data.unpaid.map((t) => (
                    <div key={t._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', fontSize: 12, gap: 8 }}>
                      <span style={{ flex: 1, color: 'var(--r-text-muted)' }}>{t.description}</span>
                      <span style={{ fontWeight: 600, color: 'var(--r-red)' }}>{formatCurrency(t.balanceOwed)}</span>
                      <button className="r-btn r-btn-success r-btn-sm" onClick={() => onMarkPaid(t._id!, t.totalCharged)} style={{ fontSize: 10, padding: '3px 8px', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Check size={12} /> Paid
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
