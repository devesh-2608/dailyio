import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './signup.css';

const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_URL = isDevelopment 
  ? 'http://localhost:5000/api' 
  : 'https://daily-io-hgba.vercel.app/api';
  
const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    agreeTerms: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
    
    // Log the data being sent
    console.log('Sending data:', formData);
    
    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          agreeTerms: formData.agreeTerms
        })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Signup failed');
      }
  
      const data = await response.json();
      console.log('Success:', data);
      navigate('/dashboard');
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-content">
        <div className="signup-header">
          <h1>Daily<span>IO</span></h1>
          <p className="signup-subtitle">Create Account</p>
        </div>

        <div className="signup-card">
          <Link to="/" className="back-home-btn">← Back to Home</Link>
          {error && <div className="signup-error">{error}</div>}
          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="signup-form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="signup-input"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="signup-form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="signup-input"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="signup-form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="signup-input"
                placeholder="Create a password"
                required
              />
            </div>

            <div className="signup-form-options">
              <input
                type="checkbox"
                id="agreeTerms"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                required
              />
              <label htmlFor="agreeTerms" className="signup-terms">
                I agree to the <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>
              </label>
            </div>

            <button 
              type="submit" 
              className="signup-button"
              disabled={loading}
            >
              {loading ? 'SIGNING UP...' : 'SIGN UP'}
            </button>
            
            <div className="signup-divider">
              <span>OR</span>
            </div>
            
            <div className="signup-social-buttons">
              <button type="button" className="signup-social-button signup-google">
                Continue with Google
              </button>
              <button type="button" className="signup-social-button signup-facebook">
                Continue with Facebook
              </button>
            </div>
            
            <div className="signup-login-link">
              Already have an account? <Link to="/login">Login</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;