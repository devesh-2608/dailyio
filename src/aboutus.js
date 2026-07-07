import React, { useState, useRef } from "react";
import ContributorModal from "./components/ContributorModal.js";
import "./aboutus.css";

const contributors = [
  {
    name: "Devesh Tripathi"
  }
];

const AboutUs = () => {
  const [hoveredContributor, setHoveredContributor] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const hideTimer = useRef(null);

  const handleCardEnter = (contributor) => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    setHoveredContributor(contributor);
    setModalVisible(true);
  };

  const handleCardLeave = () => {
    hideTimer.current = setTimeout(() => {
      setModalVisible(false);
      setHoveredContributor(null);
    }, 100); // short delay to allow moving to modal
  };

  const handleModalEnter = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    setModalVisible(true);
  };

  const handleModalLeave = () => {
    hideTimer.current = setTimeout(() => {
      setModalVisible(false);
      setHoveredContributor(null);
    }, 100);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setHoveredContributor(null);
  };

  return (
    <div className="aboutus-container">
      <div className="aboutus-content">
        <header className="aboutus-header">
          <h1>About <span>DailyIO</span></h1>
          <p className="aboutus-subtitle">Everyday Life, Simpler</p>
        </header>
        
        <section className="aboutus-card aboutus-intro-section">
          <p className="aboutus-text">
            Welcome! We're thrilled to tell you about DailyIO, a platform born
            from a simple yet powerful observation: in today's fast-paced world,
            we all need a reliable digital sanctuary that brings together
            everything we need for our daily lives.
          </p>
        </section>
        
        <section className="aboutus-card aboutus-mission-section">
          <h2 className="aboutus-section-title">Our Mission</h2>
          <div className="aboutus-divider"></div>
          <p className="aboutus-text">
            At DailyIO, we're committed to simplifying your daily digital
            experience. Our mission is to create a seamless, all-in-one platform
            that serves as your daily companion, helping you stay informed,
            organized, and entertained without the complexity of juggling
            multiple applications.
          </p>
        </section>

        <section className="aboutus-card aboutus-features-section">
          <h2 className="aboutus-section-title">What Sets Us Apart</h2>
          <div className="aboutus-divider"></div>
          <p className="aboutus-text">
            What makes DailyIO unique is our thoughtful integration of essential
            daily services. Instead of switching between countless apps and
            websites, we've created a cohesive ecosystem where everything you
            need is just a click away.
          </p>
        </section>
        
        <section className="aboutus-card aboutus-vision-section">
          <h2 className="aboutus-section-title">Our Vision</h2>
          <div className="aboutus-divider"></div>
          <p className="aboutus-text">
            Looking ahead, we see DailyIO becoming an indispensable part of
            people's daily routines. We're constantly evolving, taking user
            feedback seriously to refine and expand our offerings.
          </p>
        </section>
        
        <section className="aboutus-card aboutus-core-features-section">
          <h2 className="aboutus-section-title">Core Features</h2>
          <div className="aboutus-divider"></div>
          <ul className="aboutus-feature-list">
            <li className="aboutus-feature-item">Personalized dashboard that adapts to your needs</li>
            <li className="aboutus-feature-item">Local weather forecast alongside breaking news</li>
            <li className="aboutus-feature-item">Real-time stock market updates and currency conversion tools</li>
            <li className="aboutus-feature-item">Smart task management system</li>
            <li className="aboutus-feature-item">Selection of quick, engaging mini-games</li>
          </ul>
        </section>
        
        <section className="aboutus-card aboutus-team-section">
          <h2 className="aboutus-section-title">Meet the Contributors</h2>
          <div className="aboutus-divider"></div>
          <div className="aboutus-contributors-container">
            {contributors.map((contributor) => (
              <div
                className="aboutus-contributor-card"
                key={contributor.name}
                onMouseEnter={() => handleCardEnter(contributor)}
                onMouseLeave={handleCardLeave}
              >
                <h4 className="aboutus-contributor-name">{contributor.name}</h4>
              </div>
            ))}
          </div>
          <ContributorModal
            contributor={hoveredContributor && modalVisible ? hoveredContributor : null}
            onMouseEnter={handleModalEnter}
            onMouseLeave={handleModalLeave}
            onClose={handleModalClose}
          />
        </section>
      </div>
    </div>
  );
};

export default AboutUs;