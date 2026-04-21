import { useEffect, useState } from 'react';
import { getMenuItems, createMenuItem, deleteMenuItem, getAllOrders, updateOrderStatus } from '../services/api';
import toast from 'react-hot-toast';

const CATEGORIES = ['Burgers', 'Pizza', 'Sushi', 'Salads', 'Desserts', 'Drinks', 'Sides'];
const ORDER_STATUSES = ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];

const emptyForm = { name: '', description: '', price: '', category: 'Burgers', image: '', isAvailable: true };

export default function Admin() {
  const [tab, setTab] = useState('menu');
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tab === 'menu') {
      getMenuItems().then(({ data }) => setMenuItems(data)).catch(() => toast.error('Failed to load menu'));
    } else {
      getAllOrders().then(({ data }) => setOrders(data)).catch(() => toast.error('Failed to load orders'));
    }
  }, [tab]);

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.category) return toast.error('Fill all required fields');
    setLoading(true);
    try {
      const { data } = await createMenuItem({ ...form, price: parseFloat(form.price) });
      setMenuItems([data, ...menuItems]);
      setForm(emptyForm);
      toast.success('Item added! 🎉');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add item');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      await deleteMenuItem(id);
      setMenuItems(menuItems.filter((i) => i._id !== id));
      toast.success('Item deleted');
    } catch {
      toast.error('Failed to delete item');
    }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);
      setOrders(orders.map((o) => o._id === orderId ? { ...o, status } : o));
      toast.success('Status updated');
    } catch {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-tabs">
          <button className={tab === 'menu' ? 'active' : ''} onClick={() => setTab('menu')}>🍽️ Menu Items</button>
          <button className={tab === 'orders' ? 'active' : ''} onClick={() => setTab('orders')}>📦 Orders</button>
        </div>
      </div>

      {tab === 'menu' && (
        <div className="admin-content">
          <div className="admin-form-card">
            <h3>Add New Menu Item</h3>
            <form onSubmit={handleAddItem} className="admin-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Item Name *</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Classic Burger" required />
                </div>
                <div className="form-group">
                  <label>Price (₹) *</label>
                  <input type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="e.g. 299" required />
                </div>
              </div>
              <div className="form-group">
                <label>Description *</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the item..." rows={2} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Category *</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Image URL</label>
                  <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
                </div>
              </div>
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? 'Adding...' : '+ Add Item'}
              </button>
            </form>
          </div>

          <div className="admin-table-card">
            <h3>Menu Items ({menuItems.length})</h3>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr><th>Name</th><th>Category</th><th>Price</th><th>Rating</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {menuItems.map((item) => (
                    <tr key={item._id}>
                      <td><strong>{item.name}</strong><br /><small>{item.description.slice(0, 40)}...</small></td>
                      <td><span className="badge">{item.category}</span></td>
                      <td>₹{item.price}</td>
                      <td>⭐ {item.rating}</td>
                      <td><button className="btn-danger-sm" onClick={() => handleDelete(item._id)}>Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === 'orders' && (
        <div className="admin-table-card">
          <h3>All Orders ({orders.length})</h3>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th></tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>#{order._id.slice(-8).toUpperCase()}<br /><small>{new Date(order.createdAt).toLocaleDateString()}</small></td>
                    <td>{order.user?.name}<br /><small>{order.user?.email}</small></td>
                    <td>{order.items.map((i) => `${i.name} ×${i.quantity}`).join(', ')}</td>
                    <td>₹{order.totalAmount}</td>
                    <td>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="status-select"
                      >
                        {ORDER_STATUSES.map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
