import { Link, useNavigate } from 'react-router-dom';
import { Eye, ShoppingCart, X } from 'lucide-react';
import { useState } from 'react';
import { getCategoryImage } from '../assets/images.js';

function getProductId(product) {
  return product?.id || product?._id;
}

export default function ProductCard({ product, wishlist = [], onAddToCart, onToggleWishlist }) {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const navigate = useNavigate();
  const productId = getProductId(product);
  const isWishlisted = wishlist.some((item) => getProductId(item) === productId);

  function handleViewDetails() {
    setIsQuickViewOpen(false);
    navigate(`/product/${productId}`);
  }

  return (
    <>
      <article className="product-card">
        <div className="product-media">
          <Link className="product-image-link" to={`/product/${productId}`}>
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = getCategoryImage(product.categorySlug);
              }}
            />
          </Link>
          <button
            className={isWishlisted ? 'wishlist-button active' : 'wishlist-button'}
            type="button"
            onClick={() => onToggleWishlist(product)}
            aria-pressed={isWishlisted}
            aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          >
            <span aria-hidden="true">{isWishlisted ? '❤️' : '🤍'}</span>
            Wishlist
          </button>
          <button className="quick-view-button" type="button" onClick={() => setIsQuickViewOpen(true)}>
            <Eye size={17} />
            Quick view
          </button>
        </div>

        <div className="product-card-body">
          <p className="product-category">{product.category}</p>
          <Link to={`/product/${productId}`}>
            <h3>{product.name}</h3>
          </Link>
          <p className="product-price">${product.price.toLocaleString()}</p>
          <button className="add-button" type="button" onClick={() => onAddToCart(product)}>
            <ShoppingCart size={18} />
            Add to cart
          </button>
        </div>
      </article>

      {isQuickViewOpen && (
        <div
          className="quick-view-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={`${product.name} preview`}
          onClick={() => setIsQuickViewOpen(false)}
        >
          <div className="quick-view-modal" onClick={(event) => event.stopPropagation()}>
            <button
              className="quick-view-close"
              type="button"
              onClick={() => setIsQuickViewOpen(false)}
              aria-label="Close product preview"
            >
              <X size={18} />
            </button>
            <img
              src={product.image}
              alt={product.name}
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = getCategoryImage(product.categorySlug);
              }}
            />
            <div className="quick-view-copy">
              <p className="product-category">{product.category}</p>
              <h2>{product.name}</h2>
              <strong>${product.price.toLocaleString()}</strong>
              <p>{product.description}</p>
              <div className="quick-view-actions">
                <button className="primary-button" type="button" onClick={() => onAddToCart(product)}>
                  <ShoppingCart size={18} />
                  Add to cart
                </button>
                <button className="secondary-details-button" type="button" onClick={handleViewDetails}>
                  View details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
