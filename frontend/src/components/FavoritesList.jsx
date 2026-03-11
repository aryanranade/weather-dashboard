import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { favoritesService, weatherService } from '../services/services';
import { useAuth } from '../context/AuthContext';

const FavoritesList = ({ onWeatherSelect }) => {
  const [favorites, setFavorites] = useState([]);
  const [favoritesWeather, setFavoritesWeather] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadFavorites();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const cities = await favoritesService.getFavoriteCities(user.id);
      setFavorites(cities);

      // Load weather for all favourite cities
      if (cities.length > 0) {
        const weatherData = await favoritesService.getFavoriteCitiesWeather(user.id);
        setFavoritesWeather(weatherData);
      }
    } catch (err) {
      setError('Failed to load favourite cities');
    } finally {
      setLoading(false);
    }
  };

  const handleCityClick = async (cityName) => {
    try {
      const weatherData = await weatherService.getWeatherWithForecast(cityName);
      onWeatherSelect(weatherData);
    } catch (err) {
      setError(`Failed to load weather for ${cityName}`);
    }
  };

  const removeFavorite = async (cityName) => {
    try {
      await favoritesService.removeFavoriteCity(user.id, cityName);
      setFavorites(favorites.filter(city => city !== cityName));
      setFavoritesWeather(favoritesWeather.filter(weather => weather.cityName !== cityName));
    } catch (err) {
      setError('Failed to remove city from favourites');
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gray-800/40 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-700/50"
      >
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
          <span className="ml-3 text-gray-300">Loading favourites...</span>
        </div>
      </motion.div>
    );
  }

  if (favorites.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gray-800/40 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-700/50 text-center py-8"
      >
        <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <h3 className="text-lg font-semibold text-white mb-2">No Favourite Cities</h3>
        <p className="text-gray-400">Add cities to your favourites to see them here</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gray-800/40 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-700/50"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white">Favourite Cities</h3>
        <button
          onClick={loadFavorites}
          className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
        >
          Refresh
        </button>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-900/50 border border-red-700/50 text-red-200 px-4 py-3 rounded-lg mb-4"
        >
          {error}
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {favoritesWeather.map((weather, index) => (
          <motion.div
            key={weather.cityName}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 cursor-pointer hover:border-gray-600/50 hover:bg-gray-800/80 transition-all duration-200"
            onClick={() => handleCityClick(weather.cityName)}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-semibold text-white">{weather.cityName}</h4>
                <p className="text-sm text-gray-400">{weather.country}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFavorite(weather.cityName);
                }}
                className="text-red-400 hover:text-red-300 p-1 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img
                  src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                  alt={weather.description}
                  className="w-10 h-10 mr-2"
                />
                <div>
                  <p className="text-sm font-medium text-gray-300 capitalize">{weather.description}</p>
                  <p className="text-xs text-gray-500">Humidity: {weather.humidity}%</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-white">{Math.round(weather.temperature)}°C</p>
                <p className="text-xs text-gray-400">Feels like {Math.round(weather.feelsLike)}°C</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default FavoritesList;
