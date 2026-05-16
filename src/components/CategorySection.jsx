import { Link } from 'react-router-dom';
import ProductCard from './ProductCard.jsx';
import { ProductGridSkeleton } from './LoadingSkeleton.jsx';

export default function CategorySection({
  title,
  description,
  products,
  wishlist,
  onAddToCart,
  onToggleWishlist,
  showViewAll = true,
  loading = false,
}) {
  return (
    <section className="category-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Novera edit</p>
          <h2>{title}</h2>
          {description && <p>{description}</p>}
        </div>
        {showViewAll && (
          <Link className="text-link" to={`/category/${products[0]?.categorySlug}`}>
            View all
          </Link>
        )}
      </div>

      {loading ? (
        <ProductGridSkeleton />
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id || product._id}
              product={product}
              wishlist={wishlist}
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
            />
          ))}
        </div>
      )}
    </section>
  );
}
