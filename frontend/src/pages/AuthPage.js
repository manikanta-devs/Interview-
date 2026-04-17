import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function AuthPage({ mode = 'login', onLogin }) {
  const isRegister = mode === 'register';
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');

    if (!form.email || !form.password || (isRegister && !form.name)) {
      setError('Please fill all required fields.');
      return;
    }

    if (isRegister) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const exists = users.some((user) => user.email === form.email);
      if (exists) {
        setError('User already exists. Please login.');
        return;
      }
      users.push({ name: form.name, email: form.email, password: form.password });
      localStorage.setItem('users', JSON.stringify(users));
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const found = users.find(
      (user) => user.email === form.email && user.password === form.password
    );

    if (!found) {
      setError('Invalid credentials.');
      return;
    }

    localStorage.setItem('currentUser', JSON.stringify(found));
    onLogin(found);
    navigate('/dashboard');
  };

  return (
    <div className="page auth-page">
      <div className="card auth-card">
        <h1>{isRegister ? 'Register' : 'Login'}</h1>
        <form onSubmit={handleSubmit} className="form-grid">
          {isRegister && (
            <input
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
            />
          )}
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />
          {error && <p className="error-text">{error}</p>}
          <button type="submit">{isRegister ? 'Create Account' : 'Login'}</button>
        </form>
        {isRegister ? (
          <p>
            Already have an account? <Link to="/">Login</Link>
          </p>
        ) : (
          <p>
            New user? <Link to="/register">Register</Link>
          </p>
        )}
      </div>
    </div>
  );
}

export default AuthPage;
