import { useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ToastContainer from './components/ToastContainer.jsx';
import HomePage from './pages/HomePage.jsx';
import CategoryPage from './pages/CategoryPage.jsx';
import ProductDetailsPage from './pages/ProductDetailsPage.jsx';
import CartPage from './pages/CartPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import ExplorePage from './pages/ExplorePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import WishlistPage from './pages/WishlistPage.jsx';
import OrderSuccessPage from './pages/OrderSuccessPage.jsx';
import { products as fallbackProducts } from './data/products.js';

function readStorageArray(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function readStorageObject(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || 'null');
  } catch {
    return null;
  }
}

function getProductId(product) {
  return product?.id || product?._id;
}

function ProtectedRoute({ user, children }) {
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

export default function App() {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState(fallbackProducts);
  const [productsLoading, setProductsLoading] = useState(true);
  const [user, setUser] = useState(() => readStorageObject('user'));
  const [wishlist, setWishlist] = useState(() => readStorageArray('wishlist'));
  const [lastOrder, setLastOrder] = useState(() => readStorageObject('lastOrder'));
  const [productsError, setProductsError] = useState('');
  const [checkoutStatus, setCheckoutStatus] = useState({ loading: false, message: '', type: '' });
  const [toasts, setToasts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setProductsLoading(true);
    fetch('http://localhost:3001/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(Array.isArray(data) ? data : fallbackProducts);
        setProductsError('');
      })
      .catch(() => {
        setProducts(fallbackProducts);
        setProductsError('Products are temporarily unavailable. Please try again shortly.');
      })
      .finally(() => {
        setProductsLoading(false);
      });
  }, []);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const cartTotal = useMemo(
    () => cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
    [cartItems],
  );

  function handleLogin(loggedInUser) {
    localStorage.setItem('user', JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    showToast(`Welcome back, ${loggedInUser.name || 'friend'}.`, 'success');
  }

  function handleLogout() {
    localStorage.removeItem('user');
    setUser(null);
  }

  function requireLogin() {
    if (!localStorage.getItem('user')) {
      showToast('Please login first.', 'info');
      navigate('/login');
      return false;
    }

    return true;
  }

  function showToast(message, type = 'info') {
    const id = `${Date.now()}-${Math.random()}`;

    setToasts((currentToasts) => [...currentToasts, { id, message, type }]);
    setTimeout(() => {
      setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id));
    }, 3400);
  }

  function dismissToast(toastId) {
    setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== toastId));
  }

  function toggleWishlist(product) {
    if (!requireLogin()) {
      return;
    }

    const productId = getProductId(product);
    const exists = wishlist.some((item) => getProductId(item) === productId);

    setWishlist((currentWishlist) => {
      const currentExists = currentWishlist.some((item) => getProductId(item) === productId);
      const nextWishlist = currentExists
        ? currentWishlist.filter((item) => getProductId(item) !== productId)
        : [...currentWishlist, product];

      localStorage.setItem('wishlist', JSON.stringify(nextWishlist));
      return nextWishlist;
    });

    showToast(
      exists ? `${product.name} removed from wishlist.` : `${product.name} added to wishlist.`,
      exists ? 'info' : 'success',
    );
  }

  function addToCart(product, quantity = 1) {
    if (!requireLogin()) {
      return;
    }

    const quantityToAdd = Math.max(1, Number(quantity) || 1);
    const productId = getProductId(product);
    const existingItem = cartItems.find((item) => getProductId(item) === productId);

    setCartItems((currentItems) => {
      const currentExistingItem = currentItems.find((item) => getProductId(item) === productId);

      if (currentExistingItem) {
        return currentItems.map((item) =>
          getProductId(item) === productId ? { ...item, quantity: item.quantity + quantityToAdd } : item,
        );
      }

      return [...currentItems, { ...product, quantity: quantityToAdd }];
    });

    showToast(
      existingItem ? `${product.name} quantity updated in cart.` : `${product.name} added to cart.`,
      'success',
    );
  }

  function removeFromCart(productId) {
    const removedItem = cartItems.find((item) => getProductId(item) === productId);

    setCartItems((currentItems) => currentItems.filter((item) => getProductId(item) !== productId));

    if (removedItem) {
      showToast(`${removedItem.name} removed from cart.`, 'info');
    }
  }

  async function handleCheckout(paymentMethod) {
    if (!requireLogin()) {
      return;
    }

    if (cartItems.length === 0) {
      setCheckoutStatus({
        loading: false,
        message: 'Your cart is empty.',
        type: 'error',
      });
      showToast('Your cart is empty.', 'error');
      return;
    }

    try {
      setCheckoutStatus({ loading: true, message: '', type: '' });

      const paymentProducts = cartItems.map((item) => ({
        productId: getProductId(item),
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }));

      const response = await fetch('http://localhost:3001/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user._id || user.id,
          products: paymentProducts,
          totalAmount: cartTotal,
          paymentMethod,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        setCheckoutStatus({
          loading: false,
          message: data.message || 'Payment failed. Please try again.',
          type: 'error',
        });
        showToast(data.message || 'Payment failed. Please try again.', 'error');
        return;
      }

      setCartItems([]);
      setLastOrder(data.order);
      localStorage.setItem('lastOrder', JSON.stringify(data.order));
      setCheckoutStatus({
        loading: false,
        message: 'Payment successful. Your order has been placed.',
        type: 'success',
      });
      showToast('Payment successful. Your order has been placed.', 'success');
      navigate('/order-success');
    } catch {
      setCheckoutStatus({
        loading: false,
        message: 'Payment service is temporarily unavailable. Please try again.',
        type: 'error',
      });
      showToast('Payment service is temporarily unavailable. Please try again.', 'error');
    }
  }

  return (
    <div className="app-shell">
      <Navbar cartCount={cartCount} user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage onLogin={handleLogin} />} />
        <Route path="/signup" element={user ? <Navigate to="/" replace /> : <SignupPage onNotify={showToast} />} />
        <Route
          path="/"
          element={
            <HomePage
              products={products}
              productsLoading={productsLoading}
              productsError={productsError}
              wishlist={wishlist}
              onAddToCart={addToCart}
              onToggleWishlist={toggleWishlist}
            />
          }
        />
        <Route
          path="/explore"
          element={
            <ExplorePage
              products={products}
              productsLoading={productsLoading}
              wishlist={wishlist}
              onAddToCart={addToCart}
              onToggleWishlist={toggleWishlist}
            />
          }
        />
        <Route
          path="/category/:categorySlug"
          element={
            <CategoryPage
              products={products}
              productsLoading={productsLoading}
              wishlist={wishlist}
              onAddToCart={addToCart}
              onToggleWishlist={toggleWishlist}
            />
          }
        />
        <Route
          path="/product/:productId"
          element={
            <ProductDetailsPage
              products={products}
              wishlist={wishlist}
              onAddToCart={addToCart}
              onToggleWishlist={toggleWishlist}
            />
          }
        />
        <Route
          path="/cart"
          element={
            <CartPage
              cartItems={cartItems}
              cartTotal={cartTotal}
              onRemoveFromCart={removeFromCart}
              onCheckout={handleCheckout}
              checkoutStatus={checkoutStatus}
            />
          }
        />
        <Route
          path="/order-success"
          element={
            <ProtectedRoute user={user}>
              <OrderSuccessPage order={lastOrder} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wishlist"
          element={
            <WishlistPage
              wishlist={wishlist}
              onAddToCart={addToCart}
              onToggleWishlist={toggleWishlist}
            />
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute user={user}>
              <ProfilePage user={user} wishlist={wishlist} products={products} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
      </Routes>
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      <Footer user={user} />
    </div>
  );
}
