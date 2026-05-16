export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="product-grid skeleton-grid" aria-label="Loading products">
      {Array.from({ length: count }).map((_, index) => (
        <article className="product-card skeleton-card" key={index}>
          <div className="skeleton-block skeleton-image" />
          <div className="product-card-body">
            <div className="skeleton-line short" />
            <div className="skeleton-line title" />
            <div className="skeleton-line price" />
            <div className="skeleton-button" />
          </div>
        </article>
      ))}
    </div>
  );
}

export function DetailsSkeleton() {
  return (
    <section className="product-details" aria-label="Loading product details">
      <div className="product-details-gallery">
        <div className="skeleton-block details-image" />
      </div>
      <div className="details-skeleton-copy">
        <div className="skeleton-line short" />
        <div className="skeleton-line hero" />
        <div className="skeleton-line price" />
        <div className="skeleton-line" />
        <div className="skeleton-line wide" />
        <div className="skeleton-actions">
          <div className="skeleton-button" />
          <div className="skeleton-button" />
        </div>
      </div>
    </section>
  );
}

export function ListSkeleton({ count = 3 }) {
  return (
    <div className="skeleton-list" aria-label="Loading list">
      {Array.from({ length: count }).map((_, index) => (
        <div className="skeleton-list-item" key={index}>
          <div className="skeleton-block list-image" />
          <div>
            <div className="skeleton-line short" />
            <div className="skeleton-line title" />
            <div className="skeleton-line price" />
          </div>
        </div>
      ))}
    </div>
  );
}
