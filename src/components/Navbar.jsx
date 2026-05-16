import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Heart, LogOut, Menu, Search, ShoppingBag, UserRound, X } from 'lucide-react';
import { useState } from 'react';
import noveraLogo from '../assets/logo/novera-logo.svg';

const links = [
  { label: 'Home', to: '/' },
  { label: 'Explore', to: '/explore' },
];

export default function Navbar({ cartCount, user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  function closeMenu() {
    setIsOpen(false);
  }

  function handleSearch(event) {
    event.preventDefault();
    const query = searchTerm.trim();

    if (!query) {
      return;
    }

    navigate(`/explore?search=${encodeURIComponent(query)}`);
    closeMenu();
  }

  function handleLogout() {
    onLogout();
    closeMenu();
    navigate('/login', { replace: true });
  }

  const userName = user?.name || user?.email;

  return (
    <header className="navbar">
      <Link className="brand" to="/" onClick={closeMenu}>
        <img className="brand-mark" src={noveraLogo} alt="Novera Home logo" />
        <span>Novera Home</span>
      </Link>

      <form className="nav-search" onSubmit={handleSearch}>
        <Search size={17} />
        <input
          type="search"
          placeholder="Search decor, lighting, sofas..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          aria-label="Search products"
        />
      </form>

      <button
        className="mobile-toggle"
        type="button"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      <nav className={isOpen ? 'nav-links open' : 'nav-links'} aria-label="Main navigation">
        {links.map((link) => (
          <NavLink
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            key={link.to}
            to={link.to}
            onClick={closeMenu}
          >
            {link.label}
          </NavLink>
        ))}

        <NavLink
          className={({ isActive }) => (isActive ? 'nav-link cart-link active' : 'nav-link cart-link')}
          to="/cart"
          onClick={closeMenu}
          aria-label="Cart"
        >
          <ShoppingBag size={19} />
          <span>Cart</span>
          <span className="cart-count">{cartCount}</span>
        </NavLink>

        <NavLink
          className={({ isActive }) => (isActive ? 'nav-link icon-link active' : 'nav-link icon-link')}
          to="/wishlist"
          onClick={closeMenu}
          aria-label="Wishlist"
        >
          <Heart size={19} />
          <span>Wishlist</span>
        </NavLink>

        {user ? (
          <>
            <NavLink
              className={({ isActive }) => (isActive ? 'nav-link icon-link active' : 'nav-link icon-link')}
              to="/profile"
              onClick={closeMenu}
              aria-label="Profile"
            >
              <UserRound size={19} />
              <span>{userName}</span>
            </NavLink>

            <button className="nav-link logout-button" type="button" onClick={handleLogout}>
              <LogOut size={18} />
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              to="/login"
              onClick={closeMenu}
            >
              Login
            </NavLink>
            <NavLink
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              to="/signup"
              onClick={closeMenu}
            >
              Signup
            </NavLink>
          </>
        )}
      </nav>
    </header>
  );
}
