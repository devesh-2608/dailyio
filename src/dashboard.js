import React from "react";
import { Link } from "react-router-dom";
import "./dashboard.css"; 

const dashboardStyle = {
    background: 'linear-gradient(-45deg, #FF6B6B, #4ECDC4, #45B7D1, #96C93D)',
    backgroundSize: '400% 400%',
    minHeight: '100vh',
    padding: '20px 20px',
    animation: 'dashboardGradientBG 15s ease infinite'
  };

const getUserName = () => {
    let user = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (user) {
        try {
            user = JSON.parse(user);
            return user.fullName || user.email || 'User';
        } catch {
            return 'User';
        }
    }
    return 'User';
};

const Dashboard = () => {
    const userName = getUserName();
    return (
        <div className="dashboard-page" style={dashboardStyle}>
            <div className="dashboard-container">
                <header className="dashboard-header">
                    <div className="welcome-banner welcome-main">
                        <span role="img" aria-label="wave">👋</span> Welcome, <span className="welcome-username">{userName}</span>
                    </div>
                    <h2>What you wanna do?</h2>
                </header>

                <div className="dashboard-grid">
                    <br></br>
                    <div className="dashboard-main-content">
                        <div className="dashboard-card">
                            <div className="dashboard-feature-grid">
                                <div className="dashboard-feature">
                                    <Link to="/games">
                                        <h3>Mini Games</h3>
                                        <p>Play & Relax</p>
                                    </Link>
                                </div>
                                <div className="dashboard-feature">
                                    <Link to="/weather">
                                        <h3>Weather</h3>
                                        <p>Current Temperatures</p>
                                    </Link>
                                </div>
                                <div className="dashboard-feature">
                                    <Link to="/news">
                                        <h3>News Updates</h3>
                                        <p>Latest Headlines</p>
                                    </Link>
                                </div>
                                <div className="dashboard-feature">
                                    <Link to="/stock">
                                        <h3>Stock Market</h3>
                                        <p>Market Trends</p>
                                    </Link>
                                </div>
                                <div className="dashboard-feature">
                                    <Link to="/unitconverter">
                                        <h3>Unit Converter</h3>
                                        <p>Quick Convert</p>
                                    </Link>
                                </div>
                                <div className="dashboard-feature">
                                    <Link to="/currencyconverter">
                                        <h3>Currency</h3>
                                        <p>Exchange Rates</p>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;