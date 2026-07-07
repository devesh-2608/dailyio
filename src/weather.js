import React, { useState } from 'react';
import './weather.css';

const WeatherWidget = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_KEY = '9216f058ead5840f20e16d510bb1ce7b'; // OpenWeatherMap API key

  const fetchWeather = async () => {
    if (!city.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error('City not found or weather data unavailable');
      }
      
      const data = await response.json();
      setWeather(data);
    } catch (err) {
      setError(err.message);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchWeather();
  };

  const getWeatherIcon = (iconCode) => {
    return `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  const getWeatherClass = () => {
    if (!weather) return '';
    const mainWeather = weather.weather[0].main.toLowerCase();
    if (mainWeather === 'clear' && isNight()) {
      return 'clear-night';
    }
    const weatherClasses = {
      clear: 'clear',
      clouds: 'clouds',
      rain: 'rain',
      snow: 'snow',
      thunderstorm: 'thunderstorm',
      mist: 'mist',
      fog: 'fog'
    };
    return weatherClasses[mainWeather] || 'default-weather';
  };

  // Helper to determine if it's night
  const isNight = () => {
    if (!weather) return false;
    const icon = weather.weather[0].icon;
    return icon.includes('n');
  };

  // Render animated background based on weather
  const renderWeatherAnimation = () => {
    if (!weather) return null;
    const main = weather.weather[0].main.toLowerCase();
    if (main === 'rain' || main === 'drizzle') {
      return (
        <div className="weather-anim rain">
          {[...Array(30)].map((_, i) => <div key={i} className="raindrop" />)}
        </div>
      );
    }
    if (main === 'thunderstorm') {
      return (
        <div className="weather-anim thunderstorm">
          {[...Array(30)].map((_, i) => <div key={i} className="raindrop" />)}
          <div className="lightning" />
        </div>
      );
    }
    if (main === 'snow') {
      return (
        <div className="weather-anim snow">
          {[...Array(20)].map((_, i) => <div key={i} className="snowflake" />)}
        </div>
      );
    }
    if (main === 'clouds') {
      return (
        <div className="weather-anim clouds">
          <div className="cloud cloud1">
            <div className="cloud-part part1" />
            <div className="cloud-part part2" />
            <div className="cloud-part part3" />
            <div className="cloud-part part4" />
          </div>
          <div className="cloud cloud2">
            <div className="cloud-part part1" />
            <div className="cloud-part part2" />
            <div className="cloud-part part3" />
          </div>
        </div>
      );
    }
    if (main === 'clear') {
      if (isNight()) {
        return (
          <div className="weather-anim night">
            <div className="moon" />
            <div className="star star1" />
            <div className="star star2" />
            <div className="star star3" />
          </div>
        );
      } else {
        return (
          <div className="weather-anim sunny">
            <div className="sun" />
          </div>
        );
      }
    }
    return null;
  };

  return (
    <div className={`weather-widget-wrapper ${getWeatherClass()}`}>
      {renderWeatherAnimation()}
      <div className="weather-content-center">
        <h2 className="weather-widget-title">Weather Updates</h2>
        <form onSubmit={handleSubmit} className="weather-widget-form">
          <input
            type="text"
            className="weather-widget-input"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button type="submit" className="weather-widget-button">
            Get Weather
          </button>
        </form>
        {loading && (
          <div className="weather-widget-loading">
            <p>Loading weather data...</p>
          </div>
        )}
        {error && (
          <div className="weather-widget-error">
            <p>{error}</p>
          </div>
        )}
        {weather && (
          <div className="weather-widget-data">
            <div className="weather-widget-location">
              <h3>{weather.name}, {weather.sys.country}</h3>
            </div>
            <div className="weather-widget-main">
              <img 
                src={getWeatherIcon(weather.weather[0].icon)} 
                alt={weather.weather[0].description}
                className="weather-widget-icon"
              />
              <div className="weather-widget-temp">
                <h2>{Math.round(weather.main.temp)}°C</h2>
                <p>{weather.weather[0].description}</p>
              </div>
            </div>
            <div className="weather-widget-details">
              <div className="weather-widget-detail-item">
                <span>Feels like</span>
                <span>{Math.round(weather.main.feels_like)}°C</span>
              </div>
              <div className="weather-widget-detail-item">
                <span>Humidity</span>
                <span>{weather.main.humidity}%</span>
              </div>
              <div className="weather-widget-detail-item">
                <span>Wind</span>
                <span>{weather.wind.speed} m/s</span>
              </div>
              <div className="weather-widget-detail-item">
                <span>Pressure</span>
                <span>{weather.main.pressure} hPa</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherWidget;
