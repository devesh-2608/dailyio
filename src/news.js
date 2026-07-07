import React, { useState, useEffect } from 'react';
import './news.css';

// Define category mapping outside the component
const categoryToSection = {
  general: 'news',
  technology: 'technology',
  business: 'business',
  science: 'science',
  sports: 'sport'
};

// Guardian API key - replace with your own from https://open-platform.theguardian.com/
const GUARDIAN_API_KEY = 'fdc8a6e5-6cd2-47ad-ac77-703d3a61dd43'; // Use 'test' for development or your own API key

const News = () => {
  const [newsArticles, setNewsArticles] = useState([]);
  const [activeCategory, setActiveCategory] = useState('general');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const categories = ['general', 'technology', 'business', 'science', 'sports'];

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      try {
        const section = categoryToSection[activeCategory];
        const response = await fetch(
  `http://localhost:5000/api/news?section=${section}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }
        
        const data = await response.json();
        
        // Transform Guardian API response to match our existing structure
        const transformedArticles = data.response.results.map(article => ({
          title: article.webTitle,
          description: article.fields?.trailText || 'No description available',
          publishedAt: article.webPublicationDate,
          url: article.webUrl,
          source: { name: 'The Guardian' }
        }));
        
        setNewsArticles(transformedArticles);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };
    
    fetchNews();
  }, [activeCategory]); // No need to include categoryToSection since it's defined outside the component

  if (error) {
    return <div className="news-error-message">Error: {error}</div>;
  }

  return (
    <div className="news-dashboard-page">
      <div className="news-container">
        <div className="news-header">
          <h2>Global News Dashboard</h2>
          <p>Real-time news from around the world</p>
        </div>
        
        <div className="news-category-tabs">
          {categories.map((category) => (
            <div 
              key={category} 
              className={`news-category-tab ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </div>
          ))}
        </div>
        
        <div className="news-grid">
          {isLoading ? (
            <div className="news-loading">Loading news...</div>
          ) : (
            newsArticles.map((news, index) => (
              <div className="news-card" key={index}>
                <div className="news-title">{news.title}</div>
                <div className="news-excerpt">{news.description}</div>
                
                <div className="news-meta">
                  <span className="news-date">
                    {new Date(news.publishedAt).toLocaleDateString()}
                  </span>
                  <span className="news-category-label">{activeCategory.toUpperCase()}</span>
                </div>
                
                {news.url && (
                  <a 
                    href={news.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="news-read-more"
                  >
                    Read More
                  </a>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default News;