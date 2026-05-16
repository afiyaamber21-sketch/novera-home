import { Navigate, useParams } from 'react-router-dom';
import CategorySection from '../components/CategorySection.jsx';
import { categories } from '../data/products.js';

export default function CategoryPage({ products, productsLoading, wishlist, onAddToCart, onToggleWishlist }) {
  const { categorySlug } = useParams();
  const category = categories.find((item) => item.slug === categorySlug);

  if (!category) {
    return <Navigate to="/" replace />;
  }

  const categoryProducts = products.filter((product) => product.categorySlug === categorySlug);

  return (
    <main className="page-wrap">
      <CategorySection
        title={category.name}
        description={category.description}
        products={categoryProducts}
        wishlist={wishlist}
        onAddToCart={onAddToCart}
        onToggleWishlist={onToggleWishlist}
        showViewAll={false}
        loading={productsLoading}
      />
    </main>
  );
}
