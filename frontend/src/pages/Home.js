import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="home">
      <div className="hero">
        <div className="hero-content">
          <div className="hero-badge">🔥 Fast Delivery · Fresh Food</div>
          <h1 className="hero-title">
            Food That Finds <br />
            <span className="hero-highlight">You First</span>
          </h1>
          <p className="hero-subtitle">
            Handcrafted meals from top local kitchens, delivered to your door in 30 minutes or less.
          </p>
          <div className="hero-actions">
            <Link to="/menu" className="btn-primary">Browse Menu →</Link>
            {!user && <Link to="/register" className="btn-ghost">Create Account</Link>}
          </div>
        </div>
        <div className="hero-visual">
          <div className="food-orbit">
            <div className="orbit-item" style={{ '--angle': '0deg' }}>🍔</div>
            <div className="orbit-item" style={{ '--angle': '72deg' }}>🍕</div>
            <div className="orbit-item" style={{ '--angle': '144deg' }}>🍣</div>
            <div className="orbit-item" style={{ '--angle': '216deg' }}>🥗</div>
            <div className="orbit-item" style={{ '--angle': '288deg' }}>🍜</div>
          </div>
        </div>
      </div>

      <div className="features">
        {[
          { icon: '⚡', title: '30 Min Delivery', desc: 'Hot food at your door, guaranteed fast.' },
          { icon: '👨‍🍳', title: 'Top Chefs', desc: 'Curated from the best local kitchens.' },
          { icon: '🛡️', title: 'Safe & Fresh', desc: 'Quality checked with every order.' },
        ].map((f) => (
          <div key={f.title} className="feature-card">
            <div className="feature-icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="categories-preview">
        <h2>What are you craving?</h2>
        <div className="category-chips">
          {['Burgers', 'Pizza', 'Sushi', 'Salads', 'Desserts', 'Drinks'].map((cat) => (
            <Link key={cat} to={`/menu?category=${cat}`} className="category-chip">
              {cat}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
