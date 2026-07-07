import React, { useState, useEffect } from 'react';
import './stock.css';

const Stock = () => {
  const [stocks] = useState([
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.' },
    { symbol: 'MSFT', name: 'Microsoft Corporation' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.' },
    { symbol: 'TSLA', name: 'Tesla Inc.' }
  ]);
  const [stockData, setStockData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Alpha Vantage API key
  const API_KEY = 'A2OW10D14RMRP8GQ';

  useEffect(() => {
    const fetchStockData = async () => {
      setIsLoading(true);
      try {
        const updatedStockData = {};
        
        for (const stock of stocks) {
          const response = await fetch(
            `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stock.symbol}&apikey=${API_KEY}`
          );
          
          if (!response.ok) {
            throw new Error(`Failed to fetch data for ${stock.symbol}`);
          }
          
          const data = await response.json();
          const quoteData = data['Global Quote'];
          
          if (quoteData) {
            updatedStockData[stock.symbol] = {
              price: quoteData['05. price'],
              change: quoteData['09. change'],
              changePercent: quoteData['10. change percent'],
              isPositive: parseFloat(quoteData['09. change']) >= 0
            };
          }
        }
        
        setStockData(updatedStockData);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchStockData();

    const intervalId = setInterval(fetchStockData, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [stocks]);

  if (error) {
    return (
      <div className="stock-page">
        <div className="error-message">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="stock-page">
      <div className="stock-dashboard">
        <div className="stock-header">
          <h1>Stock Market Tracker</h1>
          <p>Live prices from global markets</p>
        </div>
        {isLoading ? (
          <div className="loading">Loading stock data...</div>
        ) : (
          <div className="stock-grid">
            {stocks.map((stock) => {
              const data = stockData[stock.symbol];
              return data ? (
                <div className="stock-card" key={stock.symbol}>
                  <div className="stock-symbol">{stock.symbol}</div>
                  <div className="stock-name">{stock.name}</div>
                  <div className="stock-price">${parseFloat(data.price).toFixed(2)}</div>
                  <div className={`stock-change ${data.isPositive ? "positive" : "negative"}`}>
                    {data.change} ({data.changePercent})
                  </div>
                </div>
              ) : null;
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Stock;