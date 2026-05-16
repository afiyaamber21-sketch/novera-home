import { Link } from 'react-router-dom';
import CategorySection from '../components/CategorySection.jsx';
import { getCategoryImage, heroImage } from '../assets/images.js';
import { categories, featuredProductIds, newArrivalIds, trendingProductIds } from '../data/products.js';

export default function HomePage({ products, productsLoading, productsError, wishlist, onAddToCart, onToggleWishlist }) {
  const featuredProducts = products.filter((product) => featuredProductIds.includes(product.id));
  const trendingProducts = products.filter((product) => trendingProductIds.includes(product.id));
  const newArrivals = products.filter((product) => newArrivalIds.includes(product.id));
  return (
    <main>
      <section className="hero">
        <img
          className="hero-background"
          src={heroImage}
          alt="Luxury living room with neutral modern home decor"
        />
        <div className="hero-copy">
          <p className="eyebrow">Luxury decor in a softer mood</p>
          <h1>Novera Home</h1>
          <p>
            Premium furniture, lighting, wall art, greenery, and desk accents curated for calm,
            modern homes.
          </p>
          <div className="hero-actions">
            <Link className="primary-button" to="/category/living-room">
              Shop living room
            </Link>
            <Link className="secondary-button" to="/category/lighting">
              Explore lighting
            </Link>
          </div>
        </div>
      </section>

      <section className="category-tiles">
        <div className="section-heading centered">
          <p className="eyebrow">Featured collections</p>
          <h2>Room edits with a polished point of view.</h2>
        </div>
        <div className="tile-grid">
          {categories.slice(0, 4).map((category) => (
            <Link className="category-tile" to={`/category/${category.slug}`} key={category.slug}>
              <img src={getCategoryImage(category.slug)} alt={`${category.name} collection`} loading="lazy" />
              <span>{category.name}</span>
              <p>{category.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <CategorySection
        title="Featured Products"
        description="A quick look at Novera Home favorites from each category."
        products={featuredProducts}
        wishlist={wishlist}
        onAddToCart={onAddToCart}
        onToggleWishlist={onToggleWishlist}
        showViewAll={false}
        loading={productsLoading}
      />

      {productsError && <p className="page-message error">{productsError}</p>}

      <CategorySection
        title="Trending Products"
        description="Most-loved pieces for warm woods, cream textures, sculptural lighting, and quiet luxury."
        products={trendingProducts}
        wishlist={wishlist}
        onAddToCart={onAddToCart}
        onToggleWishlist={onToggleWishlist}
        showViewAll={false}
        loading={productsLoading}
      />

      <CategorySection
        title="New Arrivals"
        description="Freshly added decor, furniture, and workspace pieces for the season."
        products={newArrivals}
        wishlist={wishlist}
        onAddToCart={onAddToCart}
        onToggleWishlist={onToggleWishlist}
        showViewAll={false}
        loading={productsLoading}
      />

      <section className="all-categories">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Shop every room</p>
            <h2>Seven curated categories.</h2>
          </div>
        </div>
        <div className="category-pill-grid">
          {categories.map((category) => (
            <Link className="category-pill" to={`/category/${category.slug}`} key={category.slug}>
              {category.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="reviews-section">
        <div className="section-heading centered">
          <p className="eyebrow">Customer reviews</p>
          <h2>Homes that feel considered.</h2>
        </div>
        <div className="reviews-grid">
          {[
            ['Avery Stone', 'The living room pieces look designer-level but still feel warm and usable.'],
            ['Mira Kapoor', 'The lighting and wall decor completely changed our dining room atmosphere.'],
            ['Jon Ellis', 'Clean shopping flow, beautiful product cards, and the office collection is excellent.'],
          ].map(([name, quote]) => (
            <article className="review-card" key={name}>
              <div className="stars">★★★★★</div>
              <p>{quote}</p>
              <strong>{name}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="newsletter-section">
        <div>
          <p className="eyebrow">Novera journal</p>
          <h2>New rooms, fresh arrivals, and styling notes.</h2>
        </div>
        <form className="newsletter-form">
          <input type="email" placeholder="Email address" aria-label="Email address" />
          <button className="primary-button" type="button">
            Subscribe
          </button>
        </form>
      </section>
    </main>
  );
}
