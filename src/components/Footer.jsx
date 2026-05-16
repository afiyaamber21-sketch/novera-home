import { Link } from 'react-router-dom';
import { categories } from '../data/products.js';

export default function Footer({ user }) {
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <Link className="brand" to="/">
          Novera Home
        </Link>
        <p>Pastel-green calm, natural materials, and modern decor for every room.</p>
      </div>

      <div className="footer-links">
        <div>
          <h3>Shop</h3>
          {categories.slice(0, 4).map((category) => (
            <Link key={category.slug} to={`/category/${category.slug}`}>
              {category.name}
            </Link>
          ))}
        </div>
        <div>
          <h3>Explore</h3>
          {categories.slice(4).map((category) => (
            <Link key={category.slug} to={`/category/${category.slug}`}>
              {category.name}
            </Link>
          ))}
          {user ? <Link to="/wishlist">Wishlist</Link> : <Link to="/login">Login</Link>}
        </div>
      </div>
    </footer>
  );
}
