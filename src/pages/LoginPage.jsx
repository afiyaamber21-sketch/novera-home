import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';

export default function LoginPage({ onLogin }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  function handleChange(event) {
    setFormData((currentData) => ({
      ...currentData,
      [event.target.name]: event.target.value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch(
        'https://novera-home-1.onrender.com/login',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success || !data.user) {
        setError(data.message || 'Login failed. Please check your details and try again.');
        return;
      }

      onLogin(data.user);
      navigate(location.state?.from?.pathname || '/', { replace: true });
    } catch {
      setError('Unable to reach the server. Please try again shortly.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <p className="eyebrow">Welcome back</p>
        <h1>Login</h1>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
          </label>

          {error && <p className="form-message error">{error}</p>}

          <button className="primary-button" type="submit" disabled={isSubmitting}>
            <LogIn size={18} />
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="auth-switch">
          New to Novera Home? <Link to="/signup">Create an account</Link>
        </p>
      </section>
    </main>
  );
}