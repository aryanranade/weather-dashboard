import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { weatherService } from '../services/services';

const SearchBar = ({ onWeatherData, onError }) => {
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!city.trim()) return;

    setLoading(true);
    try {
      const weatherData = await weatherService.getWeatherWithForecast(city.trim());
      onWeatherData(weatherData);
    } catch (error) {
      onError(error.response?.data || 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      onError('Geolocation is not supported by this browser');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const weatherData = await weatherService.getWeatherWithForecastByCoordinates(latitude, longitude);
          onWeatherData(weatherData);
        } catch (error) {
          onError(error.response?.data || 'Failed to fetch weather data');
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        onError('Unable to retrieve your location');
        setLoading(false);
      }
    );
  };

  // Fetch city suggestions as user types
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (city.length >= 2) {
        try {
          const data = await weatherService.getCitySuggestions(city);
          setSuggestions(data || []);
          setShowSuggestions(true);
        } catch (error) {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [city]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSuggestionClick = (suggestion) => {
    setCity(suggestion.name);
    setShowSuggestions(false);
    // Automatically search for the selected city
    weatherService.getWeatherWithForecast(suggestion.name)
      .then(weatherData => {
        onWeatherData(weatherData);
      })
      .catch(error => {
        onError(error.response?.data || 'Failed to fetch weather data');
      });
  };

  const getLocationDisplay = (suggestion) => {
    if (suggestion.state) {
      return `${suggestion.name}, ${suggestion.state}, ${suggestion.country}`;
    }
    return `${suggestion.name}, ${suggestion.country}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto"
    >
      <form onSubmit={handleSubmit} className="flex gap-4 mb-6">
        <div className="flex-1 relative" ref={suggestionRef}>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onFocus={() => city.length >= 2 && suggestions.length > 0 && setShowSuggestions(true)}
            placeholder="Enter city name..."
            className="w-full px-4 py-3 bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pr-12"
            disabled={loading}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute z-50 w-full mt-2 bg-gray-800/95 backdrop-blur-sm border border-gray-700/50 rounded-lg shadow-2xl overflow-hidden"
            >
              {suggestions.map((suggestion, index) => (
                <motion.div
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.2)' }}
                  className="px-4 py-3 cursor-pointer border-b border-gray-700/50 last:border-b-0 transition-colors duration-150"
                >
                  <p className="text-white font-medium">{suggestion.name}</p>
                  <p className="text-gray-400 text-sm">{getLocationDisplay(suggestion)}</p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
        
        <motion.button
          type="submit"
          disabled={loading || !city.trim()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-200 transform disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            'Search'
          )}
        </motion.button>
      </form>

      <div className="text-center">
        <motion.button
          onClick={getCurrentLocation}
          disabled={loading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gray-800/60 backdrop-blur-sm hover:bg-gray-800/80 text-white font-semibold py-3 px-6 rounded-lg border border-gray-700/50 shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Use Current Location
        </motion.button>
      </div>
    </motion.div>
  );
};

export default SearchBar;
