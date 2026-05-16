import { Link } from 'react-router-dom';
import { HeartOff, ShoppingCart, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getCategoryImage } from '../assets/images.js';
import { ListSkeleton } from '../components/LoadingSkeleton.jsx';

function getProductId(product) {
  return product?.id || product?._id;
}

export default function WishlistPage({ wishlist, onAddToCart, onToggleWishlist }) {
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setPageLoading(false), 280);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="cart-page">
      <div className="cart-header">
        <p className="eyebrow">Saved products</p>
        <h1>Wishlist</h1>
      </div>

      {pageLoading ? (
        <ListSkeleton count={3} />
      ) : wishlist.length === 0 ? (
        <section className="empty-cart empty-state">
          <HeartOff size={34} />
          <h2>Your wishlist is empty.</h2>
          <p>Save products you love and they will appear here.</p>
          <Link className="primary-button" to="/">
            Continue shopping
          </Link>
        </section>
      ) : (
        <section className="wishlist-list">
          {wishlist.map((product) => {
            const productId = getProductId(product);

            return (
              <article className="wishlist-item" key={productId}>
                <Link to={`/product/${productId}`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = getCategoryImage(product.categorySlug);
                    }}
                  />
                </Link>
                <div className="wishlist-item-info">
                  <p>{product.category}</p>
                  <Link to={`/product/${productId}`}>
                    <h2>{product.name}</h2>
                  </Link>
                  <strong>${product.price.toLocaleString()}</strong>
                </div>
                <div className="wishlist-actions">
                  <button className="add-button" type="button" onClick={() => onAddToCart(product)}>
                    <ShoppingCart size={18} />
                    Add to cart
                  </button>
                  <button className="remove-button" type="button" onClick={() => onToggleWishlist(product)}>
                    <Trash2 size={18} />
                    Remove
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}
