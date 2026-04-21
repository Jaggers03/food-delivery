import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { placeOrder } from '../services/api';
import toast from 'react-hot-toast';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, totalAmount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error('Please login to place an order');
      return navigate('/login');
    }
    if (!address.trim()) return toast.error('Please enter a delivery address');
    if (cartItems.length === 0) return toast.error('Your cart is empty');

    setLoading(true);
    try {
      const items = cartItems.map((i) => ({ menuItem: i._id, quantity: i.quantity }));
      await placeOrder({ items, deliveryAddress: address, paymentMethod });
      clearCart();
      toast.success('Order placed successfully! 🎉');
      navigate('/orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="empty-state">
          <div className="empty-icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Add some delicious items to get started!</p>
          <button className="btn-primary" onClick={() => navigate('/menu')}>Browse Menu</button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>

      <div className="cart-layout">
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item._id} className="cart-item">
              <div className="cart-item-info">
                <h4>{item.name}</h4>
                <p className="cart-item-price">₹{item.price.toFixed(2)} each</p>
              </div>
              <div className="cart-item-controls">
                <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>−</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
              </div>
              <div className="cart-item-total">
                ₹{(item.price * item.quantity).toFixed(2)}
              </div>
              <button className="btn-remove" onClick={() => removeFromCart(item._id)}>✕</button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>

          <div className="summary-row">
            <span>Subtotal</span><span>₹{totalAmount.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Delivery Fee</span><span>₹40.00</span>
          </div>
          <div className="summary-row total">
            <span>Total</span><span>₹{(totalAmount + 40).toFixed(2)}</span>
          </div>

          <div className="form-group">
            <label>Delivery Address</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your full delivery address..."
              rows={3}
            />
          </div>

          <div className="form-group">
            <label>Payment Method</label>
            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              <option>Cash on Delivery</option>
              <option>Card</option>
            </select>
          </div>

          <button className="btn-submit" onClick={handlePlaceOrder} disabled={loading}>
            {loading ? 'Placing Order...' : `Place Order · ₹${(totalAmount + 40).toFixed(2)}`}
          </button>

          <button className="btn-ghost-sm" onClick={clearCart}>Clear Cart</button>
        </div>
      </div>
    </div>
  );
}
