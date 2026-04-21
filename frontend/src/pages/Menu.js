import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getMenuItems } from '../services/api';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const CATEGORIES = ['All', 'Burgers', 'Pizza', 'Sushi', 'Salads', 'Desserts', 'Drinks', 'Sides'];

const EMOJI_MAP = {
  Burgers: '🍔', Pizza: '🍕', Sushi: '🍣', Salads: '🥗',
  Desserts: '🍰', Drinks: '🥤', Sides: '🍟',
};

export default function Menu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchParams] = useSearchParams();
  const { addToCart } = useCart();

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setActiveCategory(cat);
  }, [searchParams]);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const { data } = await getMenuItems(activeCategory === 'All' ? '' : activeCategory);
        setItems(data);
      } catch {
        toast.error('Failed to load menu');
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [activeCategory]);

  const handleAddToCart = (item) => {
    addToCart(item);
    toast.success(`${item.name} added to cart 🛒`);
  };

  return (
    <div className="menu-page">
      <div className="menu-header">
        <h1>Our Menu</h1>
        <p>Fresh ingredients, bold flavors — choose your feast</p>
      </div>

      <div className="category-tabs">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`category-tab ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat !== 'All' && EMOJI_MAP[cat]} {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton-card" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🍽️</div>
          <h3>No items found</h3>
          <p>Try a different category</p>
        </div>
      ) : (
        <div className="menu-grid">
          {items.map((item) => (
            <div key={item._id} className="menu-card">
              <div className="menu-card-image">
                {item.image ? (
                  <img src={item.image} alt={item.name} />
                ) : (
                  <div className="menu-card-placeholder">
                    {EMOJI_MAP[item.category] || '🍽️'}
                  </div>
                )}
                <span className="category-badge">{item.category}</span>
              </div>
              <div className="menu-card-body">
                <div className="menu-card-top">
                  <h3>{item.name}</h3>
                  <div className="rating">⭐ {item.rating}</div>
                </div>
                <p className="menu-card-desc">{item.description}</p>
                <div className="menu-card-footer">
                  <span className="price">₹{item.price.toFixed(2)}</span>
                  <button className="btn-add" onClick={() => handleAddToCart(item)}>
                    + Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
