'use client';

import { useState, useEffect } from 'react';
import { ITransaction, Category, RoomConfig, StayType, TransactionType, IInventoryItem } from '../lib/types';
import { 
  Zap, 
  Edit2, 
  X, 
  TrendingUp, 
  TrendingDown, 
  Moon, 
  Clock, 
  Wine, 
  CircleDot, // Snooker
  Save, 
  Plus,
  Package
} from 'lucide-react';

interface Props {
  onSubmit: (tx: Partial<ITransaction>) => Promise<boolean>;
  editingTransaction: ITransaction | null;
  onCancelEdit: () => void;
  roomDefaults: RoomConfig[];
  categories: Category[];
  inventory: IInventoryItem[];
  recordedBy: string;
}

const INITIAL_FORM = {
  date: new Date().toISOString().split('T')[0],
  type: 'INCOME' as TransactionType,
  category: 'Rooms' as Category,
  description: '',
  totalCharged: '',
  amountPaid: '',
  stayType: 'Night' as StayType,
  roomNumber: 1,
  isSnooker: false,
  inventoryItemId: '',
  quantity: 1,
  paymentMethod: 'Cash' as 'Cash' | 'Transfer',
};

export default function DataEntryForm({ 
  onSubmit, 
  editingTransaction, 
  onCancelEdit, 
  roomDefaults, 
  categories, 
  inventory,
  recordedBy 
}: Props) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingTransaction) {
      setForm({
        date: new Date(editingTransaction.date).toISOString().split('T')[0],
        type: editingTransaction.type,
        category: editingTransaction.category,
        description: editingTransaction.description,
        totalCharged: editingTransaction.totalCharged.toString(),
        amountPaid: editingTransaction.amountPaid.toString(),
        stayType: editingTransaction.stayType || 'Night',
        roomNumber: editingTransaction.roomNumber || 1,
        isSnooker: editingTransaction.isSnooker || false,
        inventoryItemId: editingTransaction.inventoryItemId || '',
        quantity: editingTransaction.quantity || 1,
        paymentMethod: editingTransaction.paymentMethod || 'Cash',
      });
    } else {
      setForm(INITIAL_FORM);
    }
  }, [editingTransaction]);

  const handleRoomChange = (roomNum: number, stayType: StayType) => {
    const room = roomDefaults.find((r) => r.number === roomNum);
    if (room && form.category === 'Rooms' && !editingTransaction) {
      const price = stayType === 'Night' ? room.defaultNightPrice : room.defaultShortPrice;
      setForm((prev) => ({ ...prev, roomNumber: roomNum, stayType, totalCharged: price.toString(), amountPaid: price.toString() }));
    } else {
      setForm((prev) => ({ ...prev, roomNumber: roomNum, stayType }));
    }
  };

  const handleInventoryChange = (itemId: string, qty: number = 1) => {
    if (!itemId) {
      setForm(prev => ({ ...prev, inventoryItemId: '', description: '', totalCharged: '', amountPaid: '' }));
      return;
    }
    const item = inventory.find(i => i._id === itemId);
    if (item) {
      const totalPrice = item.price * qty;
      setForm(prev => ({ 
        ...prev, 
        inventoryItemId: itemId, 
        quantity: qty,
        description: `${item.name} (x${qty})`,
        totalCharged: totalPrice.toString(),
        amountPaid: totalPrice.toString()
      }));
    }
  };

  const handleSubmit = async () => {
    if (!form.description.trim() || !form.totalCharged) return;
    setSubmitting(true);
    const tx: Partial<ITransaction> = {
      ...form,
      date: new Date(form.date).toISOString(),
      totalCharged: parseFloat(form.totalCharged as any) || 0,
      amountPaid: parseFloat(form.amountPaid as any) || 0,
      isSnooker: form.isSnooker,
      paymentMethod: form.paymentMethod as any,
      recordedBy: recordedBy,
    };
    if (form.category === 'Rooms') { tx.stayType = form.stayType; tx.roomNumber = form.roomNumber; }
    if (form.category === 'Bar' && form.inventoryItemId) {
      tx.inventoryItemId = form.inventoryItemId;
      tx.quantity = form.quantity;
    }
    
    const success = await onSubmit(tx);
    if (success && !editingTransaction) {
      setForm({ ...INITIAL_FORM, date: form.date });
    }
    setSubmitting(false);
  };

  const charged = parseFloat(form.totalCharged) || 0;
  const paid = parseFloat(form.amountPaid) || 0;
  const balance = Math.max(0, charged - paid);
  const autoStatus = balance <= 0 ? 'Paid' : paid > 0 ? 'Part Payment' : 'Not Paid';

  return (
    <div className="r-form">
      <div className="r-form-title" style={{ justifyContent: 'space-between', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {editingTransaction ? <Edit2 size={22} className="r-text-accent" /> : <Zap size={22} className="r-text-accent" />}
          {editingTransaction ? 'Edit Transaction' : 'Quick Entry'}
        </div>
        {editingTransaction && (
          <button className="r-btn r-btn-ghost r-btn-sm" onClick={onCancelEdit}>
            <X size={16} /> Cancel
          </button>
        )}
      </div>
      <div className="r-form-grid">
        <div className="r-field">
          <label className="r-label">Date</label>
          <input type="date" className="r-input" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
        </div>
        <div className="r-field">
          <label className="r-label">Type</label>
          <div className="r-toggle-group">
            <button className={`r-toggle-btn income ${form.type === 'INCOME' ? 'active' : ''}`} onClick={() => setForm({ ...form, type: 'INCOME' })}>
              <TrendingUp size={16} /> Income
            </button>
            <button className={`r-toggle-btn expense ${form.type === 'EXPENSE' ? 'active' : ''}`} onClick={() => setForm({ ...form, type: 'EXPENSE' })}>
              <TrendingDown size={16} /> Expense
            </button>
          </div>
        </div>
        <div className="r-field">
          <label className="r-label">Category</label>
          <select className="r-select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Category })}>
            {categories.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
          </select>
        </div>
        {form.category === 'Rooms' && (
          <>
            <div className="r-field">
              <label className="r-label">Room</label>
              <select className="r-select" value={form.roomNumber} onChange={(e) => handleRoomChange(parseInt(e.target.value), form.stayType)}>
                {roomDefaults.map((room) => (<option key={room.number} value={room.number}>Room {room.number} — ₦{room.defaultNightPrice.toLocaleString()}/night</option>))}
              </select>
            </div>
            <div className="r-field">
              <label className="r-label">Stay Type</label>
              <div className="r-toggle-group">
                <button className={`r-toggle-btn ${form.stayType === 'Night' ? 'active' : ''}`} onClick={() => handleRoomChange(form.roomNumber, 'Night')}>
                  <Moon size={16} /> Night
                </button>
                <button className={`r-toggle-btn ${form.stayType === 'Short' ? 'active' : ''}`} onClick={() => handleRoomChange(form.roomNumber, 'Short')}>
                  <Clock size={16} /> Short
                </button>
              </div>
            </div>
          </>
        )}
        {form.category === 'Bar' && (
          <>
            <div className="r-field">
              <label className="r-label">Bar Action</label>
              <div className="r-toggle-group">
                <button className={`r-toggle-btn ${!form.isSnooker ? 'active' : ''}`} onClick={() => setForm({ ...form, isSnooker: false })}>
                  <Wine size={16} /> Drinks
                </button>
                <button className={`r-toggle-btn ${form.isSnooker ? 'active' : ''}`} onClick={() => setForm({ ...form, isSnooker: true })}>
                  <CircleDot size={16} /> Snooker
                </button>
              </div>
            </div>
            
            {!form.isSnooker && (
              <>
                <div className="r-field">
                  <label className="r-label">{form.type === 'INCOME' ? 'Select Item to Sell' : 'Select Item to Restock'}</label>
                  <select 
                    className="r-select" 
                    value={form.inventoryItemId} 
                    onChange={(e) => handleInventoryChange(e.target.value, form.quantity)}
                  >
                    <option value="">Custom Entry / Not in list</option>
                    {inventory.map((item) => (
                      <option key={item._id} value={item._id} disabled={form.type === 'INCOME' && item.stock <= 0}>
                        {item.name} — ₦{item.price.toLocaleString()} ({item.stock} left)
                      </option>
                    ))}
                  </select>
                </div>
                {form.inventoryItemId && (
                  <div className="r-field">
                    <label className="r-label">Quantity ({form.type === 'INCOME' ? 'Sell' : 'Add to Stock'})</label>
                    <input 
                      type="number" 
                      className="r-input" 
                      min="1"
                      value={form.quantity} 
                      onChange={(e) => handleInventoryChange(form.inventoryItemId, parseInt(e.target.value) || 1)} 
                    />
                  </div>
                )}
              </>
            )}
          </>
        )}
        <div className="r-field full-width">
          <label className="r-label">Description</label>
          <input type="text" className="r-input" placeholder="e.g. Lodge Jiro (Night) Room 2, Bottle of Water..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value, isSnooker: e.target.value.toLowerCase().includes('snooker') ? true : form.isSnooker })} />
        </div>
        <div className="r-field">
          <label className="r-label">Payment Method</label>
          <select 
            className="r-select" 
            value={form.paymentMethod} 
            onChange={(e) => setForm({ ...form, paymentMethod: e.target.value as any })}
          >
            <option value="Cash">💵 Cash</option>
            <option value="Transfer">🏛️ Bank Transfer</option>
            <option value="POS">💳 Card / POS</option>
          </select>
        </div>
        <div className="r-field">
          <label className="r-label">Total Charged (₦)</label>
          <input type="number" className="r-input" placeholder="0" value={form.totalCharged} onChange={(e) => setForm({ ...form, totalCharged: e.target.value })} />
        </div>
        <div className="r-field">
          <label className="r-label">Amount Paid (₦)</label>
          <input type="number" className="r-input" placeholder="0" value={form.amountPaid} onChange={(e) => setForm({ ...form, amountPaid: e.target.value })} />
        </div>
        <div className="r-field">
          <label className="r-label">Balance Owed</label>
          <div className="r-input" style={{ background: 'transparent', border: '1px dashed var(--r-border)', color: balance > 0 ? 'var(--r-red)' : 'var(--r-green)', fontWeight: 600 }}>₦{balance.toLocaleString()}</div>
        </div>
        <div className="r-field">
          <label className="r-label">Status</label>
          <div className="r-input" style={{ background: 'transparent', border: '1px dashed var(--r-border)' }}>
            <span className={`r-badge ${autoStatus === 'Paid' ? 'r-badge-paid' : autoStatus === 'Part Payment' ? 'r-badge-part' : 'r-badge-not-paid'}`}>{autoStatus}</span>
          </div>
        </div>
      </div>
      <div className="r-form-actions">
        {editingTransaction && <button className="r-btn r-btn-ghost" onClick={onCancelEdit}>Cancel</button>}
        <button className="r-btn r-btn-primary" onClick={handleSubmit} disabled={submitting || !form.description.trim() || !form.totalCharged}>
          {submitting ? 'Saving...' : editingTransaction ? <><Save size={18} /> Update</> : <><Plus size={18} /> Add Transaction</>}
        </button>
      </div>
    </div>
  );
}
