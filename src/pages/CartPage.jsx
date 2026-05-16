import { Link } from 'react-router-dom';
import { Banknote, CreditCard, ShoppingBag, Smartphone } from 'lucide-react';
import { useEffect, useState } from 'react';
import CartItem from '../components/CartItem.jsx';
import { ListSkeleton } from '../components/LoadingSkeleton.jsx';

const paymentMethods = [
  {
    value: 'Credit/Debit Card',
    title: 'Credit/Debit Card',
    description: 'Pay securely with your card details.',
    icon: CreditCard,
  },
  {
    value: 'UPI',
    title: 'UPI',
    description: 'Use any UPI app to complete your order.',
    icon: Smartphone,
  },
  {
    value: 'Cash on Delivery',
    title: 'Cash on Delivery',
    description: 'Pay when your furniture arrives.',
    icon: Banknote,
  },
];

export default function CartPage({ cartItems, cartTotal, onRemoveFromCart, onCheckout, checkoutStatus }) {
  const [pageLoading, setPageLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('Credit/Debit Card');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  });
  const [upiId, setUpiId] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setPageLoading(false), 280);

    return () => clearTimeout(timer);
  }, []);

  function updateCardDetails(field, value) {
    setCardDetails((currentDetails) => ({
      ...currentDetails,
      [field]: value,
    }));
  }

  return (
    <main className="cart-page">
      <div className="cart-header">
        <p className="eyebrow">Shopping cart</p>
        <h1>Your Cart</h1>
      </div>

      {pageLoading ? (
        <section className="cart-layout">
          <ListSkeleton count={3} />
          <aside className="cart-summary skeleton-summary">
            <div className="skeleton-line title" />
            <div className="skeleton-line" />
            <div className="skeleton-line" />
            <div className="skeleton-button" />
          </aside>
        </section>
      ) : cartItems.length === 0 ? (
        <section className="empty-cart empty-state">
          <ShoppingBag size={38} />
          <h2>Your cart is empty.</h2>
          <p>Add a few Novera Home pieces and they will appear here.</p>
          <Link className="primary-button" to="/">
            Continue shopping
          </Link>
        </section>
      ) : (
        <section className="cart-layout">
          <div className="cart-list">
            {cartItems.map((item) => (
              <CartItem key={item.id || item._id} item={item} onRemoveFromCart={onRemoveFromCart} />
            ))}
          </div>

          <aside className="cart-summary">
            {checkoutStatus?.loading && (
              <div className="checkout-loading-panel">
                <div className="loader-ring" />
                <strong>Processing checkout</strong>
                <span>Please keep this page open.</span>
              </div>
            )}
            <h2>Order Summary</h2>
            <div>
              <span>Subtotal</span>
              <strong>${cartTotal.toLocaleString()}</strong>
            </div>
            <div>
              <span>Estimated delivery</span>
              <strong>Free</strong>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <strong>${cartTotal.toLocaleString()}</strong>
            </div>

            <div className="payment-section">
              <div>
                <p className="payment-eyebrow">Payment</p>
                <h3>Choose a payment method</h3>
              </div>

              <div className="payment-options">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;

                  return (
                    <label
                      className={`payment-option ${paymentMethod === method.value ? 'active' : ''}`}
                      key={method.value}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.value}
                        checked={paymentMethod === method.value}
                        onChange={(event) => setPaymentMethod(event.target.value)}
                      />
                      <span className="payment-option-icon">
                        <Icon size={18} />
                      </span>
                      <span>
                        <strong>{method.title}</strong>
                        <small>{method.description}</small>
                      </span>
                    </label>
                  );
                })}
              </div>

              {paymentMethod === 'Credit/Debit Card' && (
                <div className="payment-fields">
                  <label>
                    Card Number
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="1234 5678 9012 3456"
                      value={cardDetails.cardNumber}
                      onChange={(event) => updateCardDetails('cardNumber', event.target.value)}
                    />
                  </label>
                  <label>
                    Card Holder Name
                    <input
                      type="text"
                      placeholder="Name on card"
                      value={cardDetails.cardHolder}
                      onChange={(event) => updateCardDetails('cardHolder', event.target.value)}
                    />
                  </label>
                  <div className="payment-field-row">
                    <label>
                      Expiry Date
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={cardDetails.expiryDate}
                        onChange={(event) => updateCardDetails('expiryDate', event.target.value)}
                      />
                    </label>
                    <label>
                      CVV
                      <input
                        type="password"
                        inputMode="numeric"
                        placeholder="123"
                        value={cardDetails.cvv}
                        onChange={(event) => updateCardDetails('cvv', event.target.value)}
                      />
                    </label>
                  </div>
                </div>
              )}

              {paymentMethod === 'UPI' && (
                <div className="payment-fields">
                  <label>
                    UPI ID
                    <input
                      type="text"
                      placeholder="yourname@upi"
                      value={upiId}
                      onChange={(event) => setUpiId(event.target.value)}
                    />
                  </label>
                </div>
              )}

              {paymentMethod === 'Cash on Delivery' && (
                <div className="delivery-message">
                  <Banknote size={18} />
                  <p>Please keep the exact amount ready. Our delivery partner will collect payment at your doorstep.</p>
                </div>
              )}
            </div>

            {checkoutStatus?.message && (
              <p className={`form-message ${checkoutStatus.type}`}>{checkoutStatus.message}</p>
            )}

            <button
              className="primary-button"
              type="button"
              onClick={() => onCheckout(paymentMethod)}
              disabled={checkoutStatus?.loading}
            >
              <CreditCard size={18} />
              {checkoutStatus?.loading
                ? 'Processing...'
                : paymentMethod === 'Cash on Delivery'
                  ? 'Place Order'
                  : 'Pay Now'}
            </button>
          </aside>
        </section>
      )}
    </main>
  );
}
