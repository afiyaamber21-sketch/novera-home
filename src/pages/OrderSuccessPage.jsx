import { Link, Navigate } from 'react-router-dom';
import { CheckCircle2, ShoppingBag } from 'lucide-react';

export default function OrderSuccessPage({ order }) {
  if (!order) {
    return <Navigate to="/cart" replace />;
  }

  return (
    <main className="order-success-page">
      <section className="order-success-panel">
        <div className="success-icon" aria-hidden="true">
          <CheckCircle2 size={42} />
        </div>

        <p className="eyebrow">Order confirmed</p>
        <h1>Payment Successful</h1>
        <p className="success-copy">Your Novera Home order has been placed successfully.</p>

        <div className="order-success-details">
          <div>
            <span>Order ID</span>
            <strong>{order._id}</strong>
          </div>
          <div>
            <span>Payment Status</span>
            <strong>{order.paymentStatus}</strong>
          </div>
          <div>
            <span>Total Amount</span>
            <strong>${Number(order.totalAmount || 0).toLocaleString()}</strong>
          </div>
        </div>

        <Link className="primary-button" to="/">
          <ShoppingBag size={18} />
          Continue shopping
        </Link>
      </section>
    </main>
  );
}
