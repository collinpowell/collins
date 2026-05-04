'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  AlertTriangle, 
  Package, 
  TrendingUp, 
  Check,
  X
} from 'lucide-react';
import { IInventoryItem } from '../lib/types';

interface InventoryManagerProps {
  formatCurrency: (amount: number) => string;
}

export default function InventoryManager({ formatCurrency }: InventoryManagerProps) {
  const [items, setItems] = useState<IInventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    stock: 0,
    category: 'Beer',
    minStockLevel: 5
  });

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await fetch('/raymiton/api/inventory');
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId 
        ? `/raymiton/api/inventory/${editingId}` 
        : '/raymiton/api/inventory';
      
      const res = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsAdding(false);
        setEditingId(null);
        setFormData({ name: '', price: 0, stock: 0, category: 'Beer', minStockLevel: 5 });
        fetchInventory();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to save item');
      }
    } catch (error) {
      alert('An error occurred');
    }
  };

  const handleEdit = (item: IInventoryItem) => {
    setEditingId(item._id!);
    setFormData({
      name: item.name,
      price: item.price,
      stock: item.stock,
      category: item.category,
      minStockLevel: item.minStockLevel
    });
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      const res = await fetch(`/raymiton/api/inventory/${id}`, { method: 'DELETE' });
      if (res.ok) fetchInventory();
    } catch (error) {
      alert('Failed to delete');
    }
  };

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const lowStockItems = items.filter(item => item.stock <= item.minStockLevel);

  return (
    <div className="r-inventory">
      <div className="r-inventory-header">
        <div className="r-inventory-stats">
          <div className="r-mini-stat">
            <Package size={20} className="r-text-accent" />
            <div>
              <span className="r-stat-val">{items.length}</span>
              <span className="r-stat-label">Total Items</span>
            </div>
          </div>
          <div className="r-mini-stat">
            <AlertTriangle size={20} color={lowStockItems.length > 0 ? "var(--r-red)" : "var(--r-text-muted)"} />
            <div>
              <span className="r-stat-val">{lowStockItems.length}</span>
              <span className="r-stat-label">Low Stock</span>
            </div>
          </div>
        </div>

        <div className="r-inventory-actions">
          <div className="r-search-wrapper">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search drinks..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="r-btn r-btn-primary" onClick={() => {
            setIsAdding(true);
            setEditingId(null);
            setFormData({ name: '', price: 0, stock: 0, category: 'Beer', minStockLevel: 5 });
          }}>
            <Plus size={18} /> Add Item
          </button>
        </div>
      </div>

      {isAdding && (
        <div className="r-card r-inventory-form-card" style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ margin: 0 }}>{editingId ? 'Edit Item' : 'Add New Bar Item'}</h3>
            <button className="r-icon-btn" onClick={() => setIsAdding(false)}><X size={20} /></button>
          </div>
          <form onSubmit={handleSubmit} className="r-inventory-form">
            <div className="r-form-grid">
              <div className="r-form-group">
                <label>Item Name</label>
                <input 
                  type="text" 
                  required 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. Heineken 60cl"
                />
              </div>
              <div className="r-form-group">
                <label>Category</label>
                <select 
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                >
                  <option value="Beer">Beer</option>
                  <option value="Spirit">Spirit</option>
                  <option value="Wine">Wine</option>
                  <option value="Soft Drink">Soft Drink</option>
                  <option value="Water">Water</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="r-form-group">
                <label>Price (₦)</label>
                <input 
                  type="number" 
                  required 
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: parseInt(e.target.value)})}
                />
              </div>
              <div className="r-form-group">
                <label>Current Stock</label>
                <input 
                  type="number" 
                  required 
                  value={formData.stock}
                  onChange={e => setFormData({...formData, stock: parseInt(e.target.value)})}
                />
              </div>
              <div className="r-form-group">
                <label>Min. Stock Alert</label>
                <input 
                  type="number" 
                  value={formData.minStockLevel}
                  onChange={e => setFormData({...formData, minStockLevel: parseInt(e.target.value)})}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
              <button type="button" className="r-btn" onClick={() => setIsAdding(false)}>Cancel</button>
              <button type="submit" className="r-btn r-btn-primary">
                <Check size={18} /> {editingId ? 'Update Item' : 'Save Item'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="r-card">
        {loading ? (
          <div className="r-table-loading">Loading inventory...</div>
        ) : filteredItems.length === 0 ? (
          <div className="r-empty-state">No items found</div>
        ) : (
          <div className="r-table-wrapper">
            <table className="r-table">
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item._id}>
                    <td><strong>{item.name}</strong></td>
                    <td><span className="r-badge">{item.category}</span></td>
                    <td>{formatCurrency(item.price)}</td>
                    <td>
                      <span style={{ 
                        fontWeight: 'bold',
                        color: item.stock <= item.minStockLevel ? 'var(--r-red)' : 'inherit'
                      }}>
                        {item.stock}
                      </span>
                    </td>
                    <td>
                      {item.stock <= 0 ? (
                        <span className="r-status out">Out of Stock</span>
                      ) : item.stock <= item.minStockLevel ? (
                        <span className="r-status low">Low Stock</span>
                      ) : (
                        <span className="r-status paid">In Stock</span>
                      )}
                    </td>
                    <td className="r-actions">
                      <button className="r-icon-btn" title="Edit" onClick={() => handleEdit(item)}>
                        <Edit2 size={16} />
                      </button>
                      <button className="r-icon-btn r-text-red" title="Delete" onClick={() => handleDelete(item._id!)}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
