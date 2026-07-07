import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './login.css';

const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_URL = isDevelopment 
  ? 'http://localhost:5000/api' 
  : 'https://daily-io-hgba.vercel.app/api';
  
const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState('');
  const [notification, setNotification] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state?.message) {
      setNotification(location.state.message);
      // Optional: Clear the state so the message doesn't reappear on refresh
      window.history.replaceState({}, document.title)
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Invalid email or password');
      }
      
      console.log('Login successful:', data);
      
      // Store token in localStorage or sessionStorage based on rememberMe
      if (data.token) {
        if (formData.rememberMe) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user)); // Store user data
        } else {
          sessionStorage.setItem('token', data.token);
          sessionStorage.setItem('user', JSON.stringify(data.user)); // Store user data
        }
      }
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-header">
          <h1>Daily<span>IO</span></h1>
          <p className="login-subtitle">Welcome Back!</p>
        </div>

        <div className="login-card">
          <Link to="/" className="back-home-btn">← Back to Home</Link>
          {notification && <div className="login-notification">{notification}</div>}
          {error && <div className="login-error">{error}</div>}
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="login-input"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="login-form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="login-input"
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="login-form-options">
              <div className="login-remember-me">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <label htmlFor="rememberMe">Remember me</label>
              </div>
              <a href="/forgot-password" className="login-forgot-password">Forgot Password?</a>
            </div>

            <button 
              type="submit" 
              className="login-button"
              disabled={loading}
            >
              {loading ? 'LOGGING IN...' : 'LOGIN'}
            </button>
            
            <div className="login-divider">
              <span>OR</span>
            </div>
            
            <div className="login-social-buttons">
              <button type="button" className="login-social-button login-google">
                Continue with Google
              </button>
              <button type="button" className="login-social-button login-facebook">
                Continue with Facebook
              </button>
            </div>
            
            <div className="login-signup-link">
              Don't have an account? <Link to="/signup">Sign Up</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;