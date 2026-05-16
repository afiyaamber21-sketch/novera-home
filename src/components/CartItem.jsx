import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { getCategoryImage } from '../assets/images.js';

export default function CartItem({ item, onRemoveFromCart }) {
  const itemId = item.id || item._id;

  return (
    <article className="cart-item">
      <Link to={`/product/${itemId}`}>
        <img
          src={item.image}
          alt={item.name}
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = getCategoryImage(item.categorySlug);
          }}
        />
      </Link>

      <div className="cart-item-info">
        <p>{item.category}</p>
        <Link to={`/product/${itemId}`}>
          <h3>{item.name}</h3>
        </Link>
        <span>
          ${item.price.toLocaleString()} x {item.quantity}
        </span>
      </div>

      <div className="cart-item-actions">
        <strong>${(item.price * item.quantity).toLocaleString()}</strong>
        <button type="button" onClick={() => onRemoveFromCart(itemId)}>
          <Trash2 size={18} />
          Remove
        </button>
      </div>
    </article>
  );
}
