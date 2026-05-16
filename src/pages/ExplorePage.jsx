import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import { ProductGridSkeleton } from '../components/LoadingSkeleton.jsx';
import { categories, featuredProductIds, newArrivalIds } from '../data/products.js';

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-low', label: 'Low to High' },
  { value: 'price-high', label: 'High to Low' },
];

function getProductId(product) {
  return product?.id || product?._id;
}

function getRank(product, rankedIds) {
  const index = rankedIds.indexOf(getProductId(product));
  return index === -1 ? rankedIds.length + 1 : index;
}

export default function ExplorePage({ products, productsLoading, wishlist, onAddToCart, onToggleWishlist }) {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    setSearchTerm(searchParams.get('search') || '');
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return [...products]
      .filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(query);
        const matchesCategory = selectedCategory === 'all' || product.categorySlug === selectedCategory;

        return matchesSearch && matchesCategory;
      })
      .sort((firstProduct, secondProduct) => {
        if (sortBy === 'price-low') {
          return firstProduct.price - secondProduct.price;
        }

        if (sortBy === 'price-high') {
          return secondProduct.price - firstProduct.price;
        }

        if (sortBy === 'newest') {
          return getRank(firstProduct, newArrivalIds) - getRank(secondProduct, newArrivalIds);
        }

        return getRank(firstProduct, featuredProductIds) - getRank(secondProduct, featuredProductIds);
      });
  }, [products, searchTerm, selectedCategory, sortBy]);

  function clearFilters() {
    setSearchTerm('');
    setSelectedCategory('all');
    setSortBy('featured');
  }

  const activeCategory = categories.find((category) => category.slug === selectedCategory);
  const resultLabel = filteredProducts.length === 1 ? '1 product' : `${filteredProducts.length} products`;

  return (
    <main className="page-wrap catalog-page">
      <section className="catalog-hero">
        <div>
          <p className="eyebrow">Explore</p>
          <h1>Find the right piece.</h1>
          <p>
            Search furniture by name, refine the room, and sort the collection without leaving the
            page.
          </p>
        </div>
      </section>

      <section className="catalog-layout" aria-label="Product catalog">
        <aside className="catalog-filters" aria-label="Product filters">
          <div className="filter-panel-heading">
            <SlidersHorizontal size={19} />
            <h2>Filters</h2>
          </div>

          <label className="catalog-search">
            <span>Search products</span>
            <div>
              <Search size={18} />
              <input
                type="search"
                placeholder="Try sofa, lamp, mirror..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
          </label>

          <div className="filter-group">
            <span className="filter-label">Category</span>
            <div className="filter-options">
              <button
                className={selectedCategory === 'all' ? 'filter-chip active' : 'filter-chip'}
                type="button"
                onClick={() => setSelectedCategory('all')}
              >
                All rooms
              </button>
              {categories.map((category) => (
                <button
                  className={selectedCategory === category.slug ? 'filter-chip active' : 'filter-chip'}
                  type="button"
                  onClick={() => setSelectedCategory(category.slug)}
                  key={category.slug}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          <button className="clear-filter-button" type="button" onClick={clearFilters}>
            <X size={17} />
            Clear filters
          </button>
        </aside>

        <div className="catalog-results">
          <div className="catalog-toolbar">
            <div>
              <p className="eyebrow">Catalog</p>
              <h2>{activeCategory?.name || 'All Products'}</h2>
              <p>{resultLabel} found</p>
            </div>

            <label className="sort-control">
              <span>Sort by</span>
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                {sortOptions.map((option) => (
                  <option value={option.value} key={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {productsLoading ? (
            <ProductGridSkeleton />
          ) : filteredProducts.length > 0 ? (
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={getProductId(product)}
                  product={product}
                  wishlist={wishlist}
                  onAddToCart={onAddToCart}
                  onToggleWishlist={onToggleWishlist}
                />
              ))}
            </div>
          ) : (
            <div className="empty-catalog empty-state">
              <h2>No products found</h2>
              <p>Try another product name or remove a category filter.</p>
              <button className="primary-button" type="button" onClick={clearFilters}>
                Reset catalog
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
