import React, { useState, useEffect } from "react";
import "./currencyconverter.css";

const CurrencyConverter = () => {
  const [currencyAmount, setCurrencyAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("INR");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [result, setResult] = useState("Result: ");
  const [exchangeRates, setExchangeRates] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // ExchangeRate-API key
  const API_KEY = '6e775e2f33d6982ad50746fc';
  const currencies = [
    'INR', 'USD', 'EUR', 'GBP', 'JPY', 
    'AUD', 'CAD', 'CHF', 'CNY', 'SAR'
  ];

  useEffect(() => {
    const fetchExchangeRates = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${fromCurrency}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch exchange rates');
        }
        
        const data = await response.json();
        setExchangeRates(data.conversion_rates);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchExchangeRates();
    
    const intervalId = setInterval(fetchExchangeRates, 30 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [fromCurrency, API_KEY]);

  const convertCurrency = () => {
    if (fromCurrency === toCurrency) {
      setResult(`Result: ${currencyAmount}`);
      return;
    }

    if (isLoading) {
      setResult("Fetching latest rates...");
      return;
    }

    if (error) {
      setResult("Error fetching exchange rates");
      return;
    }

    const rate = exchangeRates[toCurrency];
    if (!rate) {
      setResult("Conversion rate not available");
      return;
    }

    const convertedAmount = (currencyAmount * rate).toFixed(2);
    setResult(`Result: ${convertedAmount} ${toCurrency}`);
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div className="currency-converter-container">
      <div className="currency-converter-content">
        <div className="currency-converter-header">
          <h1>Currency <span>Converter</span></h1>
          <p className="currency-converter-subtitle">Exchange rates updated every 30 minutes</p>
        </div>

        <div className="currency-converter-card">
          <div className="currency-converter-form">
            <div className="currency-converter-form-group">
              <label>Amount:</label>
              <input
                className="currency-converter-input"
                type="number"
                value={currencyAmount}
                onChange={(e) => setCurrencyAmount(e.target.value)}
                placeholder="Enter amount"
                disabled={isLoading}
              />
            </div>

            <div className="currency-converter-selectors">
              <div className="currency-converter-select-group">
                <label>From:</label>
                <select 
                  className="currency-converter-select"
                  value={fromCurrency} 
                  onChange={(e) => setFromCurrency(e.target.value)}
                  disabled={isLoading}
                >
                  {currencies.map(currency => (
                    <option key={currency} value={currency}>{currency}</option>
                  ))}
                </select>
              </div>

              <button 
                type="button" 
                className="currency-converter-swap-btn" 
                onClick={swapCurrencies}
                disabled={isLoading}
              >
                ↔
              </button>

              <div className="currency-converter-select-group">
                <label>To:</label>
                <select 
                  className="currency-converter-select"
                  value={toCurrency} 
                  onChange={(e) => setToCurrency(e.target.value)}
                  disabled={isLoading}
                >
                  {currencies.map(currency => (
                    <option key={currency} value={currency}>{currency}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="currency-converter-button-group">
              <button 
                className="currency-converter-button" 
                onClick={convertCurrency}
                disabled={isLoading || !currencyAmount}
              >
                {isLoading ? 'Updating Rates...' : 'Convert'}
              </button>
            </div>

            {result && (
              <div className="currency-converter-result">
                {result}
              </div>
            )}
            
            {error && (
              <div className="currency-converter-error">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;