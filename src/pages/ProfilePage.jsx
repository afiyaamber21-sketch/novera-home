import { useEffect, useMemo, useState } from 'react';
import { Heart, LogOut, Mail, PackageCheck, UserRound } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ListSkeleton } from '../components/LoadingSkeleton.jsx';

function readStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    return null;
  }
}

function getProductId(product) {
  return product?.id || product?._id || product?.productId;
}

function formatMoney(amount) {
  return `$${Number(amount || 0).toLocaleString()}`;
}

function formatDate(dateValue) {
  if (!dateValue) {
    return 'Date unavailable';
  }

  return new Date(dateValue).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function ProfilePage({ user, wishlist, products = [], onLogout }) {
  const navigate = useNavigate();
  const storedUser = readStoredUser();
  const activeUser = storedUser || user;
  const userName = activeUser?.name || 'Account';
  const [orders, setOrders] = useState([]);
  const [profileLoading, setProfileLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState('');

  const productsById = useMemo(() => {
    const productMap = new Map();

    products.forEach((product) => {
      productMap.set(getProductId(product), product);
    });

    return productMap;
  }, [products]);

  useEffect(() => {
    const timer = setTimeout(() => setProfileLoading(false), 260);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const userId = activeUser?._id || activeUser?.id;

    if (!userId) {
      setOrders([]);
      return;
    }

    async function fetchOrders() {
      try {
        setOrdersLoading(true);
        setOrdersError('');

        const response = await fetch(`https://novera-home-1.onrender.com/orders/${userId}`);
        const data = await response.json();

        setOrders(Array.isArray(data) ? data : []);
      } catch {
        setOrdersError('Unable to load your orders right now.');
        setOrders([]);
      } finally {
        setOrdersLoading(false);
      }
    }

    fetchOrders();
  }, [activeUser?._id, activeUser?.id]);

  function handleLogout() {
    onLogout();
    navigate('/login', { replace: true });
  }

  if (profileLoading) {
    return (
      <main className="profile-page">
        <section className="profile-header profile-header-loading">
          <div className="skeleton-block avatar-skeleton" />
          <div>
            <div className="skeleton-line short" />
            <div className="skeleton-line hero" />
            <div className="skeleton-line title" />
          </div>
        </section>
        <section className="profile-grid">
          <article className="profile-panel">
            <ListSkeleton count={2} />
          </article>
          <article className="profile-panel">
            <ListSkeleton count={2} />
          </article>
        </section>
      </main>
    );
  }

  return (
    <main className="profile-page">
      <section className="profile-header">
        <div className="profile-avatar" aria-label="Profile avatar">
          <UserRound size={54} />
        </div>
        <div>
          <p className="eyebrow">Profile</p>
          <h1>{userName}</h1>
          {activeUser?.email && (
            <p className="profile-email">
              <Mail size={17} />
              {activeUser.email}
            </p>
          )}
        </div>
        <button className="primary-button" type="button" onClick={handleLogout}>
          <LogOut size={18} />
          Logout
        </button>
      </section>

      <section className="profile-grid">
        <article className="profile-panel">
          <div className="panel-title">
            <Heart size={20} />
            <h2>Wishlist</h2>
          </div>
          <div className="order-placeholder">
            <strong>{wishlist.length} saved {wishlist.length === 1 ? 'item' : 'items'}</strong>
            <p>Your saved products are managed on the wishlist page.</p>
            <Link className="primary-button" to="/wishlist">
              View wishlist
            </Link>
          </div>
        </article>

        <article className="profile-panel">
          <div className="panel-title">
            <PackageCheck size={20} />
            <h2>Order History</h2>
          </div>
          {ordersLoading ? (
            <ListSkeleton count={2} />
          ) : ordersError ? (
            <p className="form-message error">{ordersError}</p>
          ) : orders.length === 0 ? (
            <div className="order-placeholder empty-state compact">
              <PackageCheck size={34} />
              <strong>You have no orders yet</strong>
              <p>Orders will appear here after checkout.</p>
              <Link className="primary-button" to="/explore">
                Browse products
              </Link>
            </div>
          ) : (
            <div className="order-history-list">
              {orders.map((order) => (
                <article className="order-card" key={order._id}>
                  <div className="order-card-header">
                    <div>
                      <span>Order Date</span>
                      <strong>{formatDate(order.createdAt)}</strong>
                    </div>
                    <div>
                      <span>Total</span>
                      <strong>{formatMoney(order.totalAmount)}</strong>
                    </div>
                  </div>

                  <div className="order-products">
                    {order.products?.map((item) => {
                      const product = productsById.get(getProductId(item));
                      const image = item.image || product?.image;

                      return (
                        <div className="order-product" key={`${order._id}-${getProductId(item)}`}>
                          {image ? (
                            <img src={image} alt={item.name} />
                          ) : (
                            <div className="order-product-image-fallback">No image</div>
                          )}
                          <div>
                            <strong>{item.name}</strong>
                            <span>Quantity: {item.quantity}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="order-meta">
                    <div>
                      <span>Payment Method</span>
                      <strong>{order.paymentMethod || 'Not available'}</strong>
                    </div>
                    <div>
                      <span>Payment Status</span>
                      <strong>{order.paymentStatus || 'Not available'}</strong>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </article>
      </section>
    </main>
  );
}
