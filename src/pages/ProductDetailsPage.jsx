import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Heart, Minus, Plus, ShoppingCart } from 'lucide-react';
import { getCategoryImage } from '../assets/images.js';
import ProductCard from '../components/ProductCard.jsx';
import { DetailsSkeleton } from '../components/LoadingSkeleton.jsx';
import { products as fallbackProducts } from '../data/products.js';

function getProductId(product) {
  return product?.id || product?._id;
}

function formatPrice(price) {
  return `$${Number(price || 0).toLocaleString()}`;
}

export default function ProductDetailsPage({ products, wishlist = [], onAddToCart, onToggleWishlist }) {
  const { productId } = useParams();
  const [productList, setProductList] = useState(products);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    let ignoreResult = false;

    setLoading(true);
    setErrorMessage('');
    setQuantity(1);

     fetch('https://novera-home-1.onrender.com/products')
      .then((response) => response.json())
      .then((data) => {
        if (ignoreResult) {
          return;
        }

        const nextProducts = Array.isArray(data) && data.length > 0 ? data : products;
        setProductList(nextProducts.length > 0 ? nextProducts : fallbackProducts);
        setLoading(false);
      })
      .catch(() => {
        if (ignoreResult) {
          return;
        }

        setProductList(products.length > 0 ? products : fallbackProducts);
        setErrorMessage('Live product details are temporarily unavailable. Showing saved catalog details.');
        setLoading(false);
      });

    return () => {
      ignoreResult = true;
    };
  }, [productId, products]);

  const product = useMemo(
    () => productList.find((item) => getProductId(item) === productId),
    [productId, productList],
  );

  const relatedProducts = useMemo(() => {
    if (!product) {
      return [];
    }

    return productList
      .filter((item) => item.categorySlug === product.categorySlug && getProductId(item) !== getProductId(product))
      .slice(0, 4);
  }, [product, productList]);

  const isWishlisted = product
    ? wishlist.some((item) => getProductId(item) === getProductId(product))
    : false;

  function decreaseQuantity() {
    setQuantity((currentQuantity) => Math.max(1, currentQuantity - 1));
  }

  function increaseQuantity() {
    setQuantity((currentQuantity) => Math.min(10, currentQuantity + 1));
  }

  function handleAddToCart() {
    onAddToCart(product, quantity);
  }

  if (loading) {
    return (
      <main className="product-details-page">
        <DetailsSkeleton />
      </main>
    );
  }

  if (!product) {
    return (
      <main className="product-details-page">
        <Link className="back-link" to="/explore">
          <ArrowLeft size={18} />
          Back to catalog
        </Link>
        <div className="product-status-panel empty-state">
          <p className="eyebrow">Not found</p>
          <h1>Product unavailable</h1>
          <p>This product could not be found in the current catalog.</p>
          <Link className="primary-button" to="/explore">
            Continue shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="product-details-page">
      <Link className="back-link" to={product.categorySlug ? `/category/${product.categorySlug}` : '/explore'}>
        <ArrowLeft size={18} />
        Back to {product.category || 'catalog'}
      </Link>

      <section className="product-details">
        <div className="product-details-gallery">
          <img
            src={product.image}
            alt={product.name}
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = getCategoryImage(product.categorySlug);
            }}
          />
        </div>

        <div className="product-details-copy">
          <p className="eyebrow">{product.category}</p>
          <h1>{product.name}</h1>
          <p className="details-price">{formatPrice(product.price)}</p>
          <p className="product-long-description">{product.description}</p>

          {errorMessage && <p className="details-note">{errorMessage}</p>}

          <div className="details-divider" />

          <div className="quantity-row">
            <span>Quantity</span>
            <div className="quantity-selector" aria-label="Choose quantity">
              <button type="button" onClick={decreaseQuantity} aria-label="Decrease quantity">
                <Minus size={16} />
              </button>
              <strong>{quantity}</strong>
              <button type="button" onClick={increaseQuantity} aria-label="Increase quantity">
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div className="details-actions">
            <button className="primary-button" type="button" onClick={handleAddToCart}>
              <ShoppingCart size={19} />
              Add to cart
            </button>
            <button
              className={isWishlisted ? 'secondary-details-button active' : 'secondary-details-button'}
              type="button"
              onClick={() => onToggleWishlist(product)}
              aria-pressed={isWishlisted}
            >
              <Heart size={19} fill={isWishlisted ? 'currentColor' : 'none'} />
              {isWishlisted ? 'Saved' : 'Add to wishlist'}
            </button>
          </div>

          <div className="details-services" aria-label="Shopping benefits">
            <span>White-glove delivery</span>
            <span>Secure checkout</span>
            <span>Curated materials</span>
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="related-products-section" aria-label="Related products">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Related products</p>
              <h2>More from {product.category}</h2>
            </div>
            <Link className="text-link" to={`/category/${product.categorySlug}`}>
              View all
            </Link>
          </div>

          <div className="product-grid related-products-grid">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard
                key={getProductId(relatedProduct)}
                product={relatedProduct}
                wishlist={wishlist}
                onAddToCart={onAddToCart}
                onToggleWishlist={onToggleWishlist}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
