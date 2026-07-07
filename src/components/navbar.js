import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./navbar.css";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, [location.pathname]); // Re-check when navigation changes

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    setUser(null);
    setIsMenuOpen(false);
    navigate('/');
  };

  const hideNavbarPaths = ["/", "/login", "/signup"];
  if (hideNavbarPaths.includes(location.pathname)) {
    return null;
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        
        <div className="navbar-logo">
          <Link to="../">
            <h1>Daily<span>IO</span></h1>
          </Link>
        </div>

         <div className="navbar-menu-icon" onClick={toggleMenu}>
          <div className={isMenuOpen ? "hamburger active" : "hamburger"}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <div className={isMenuOpen ? "navbar-links active" : "navbar-links"}>
          <ul>
            <li>
              <Link to=".." onClick={(e) => {
                e.preventDefault();
                navigate(-1);
              }}>Back</Link>
            </li>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/todo">To-do List</Link>
            </li>
            <li>
              <Link to="/aboutus">About Us</Link>
            </li>
          </ul>
        </div>

        {/* Auth Buttons & User Info */}
        <div className={isMenuOpen ? "navbar-auth active" : "navbar-auth"}>
          {user ? (
            <>
              <span className="navbar-welcome-message">
                User: {user.fullName ? user.fullName.split(' ')[0] : 'User'}
              </span>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </>
          ) : (
            <>
              <span className="navbar-welcome-message">Welcome, Guest</span>
              <Link to="/login" className="login-btn">Login</Link>
              <Link to="/signup" className="signup-btn">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;