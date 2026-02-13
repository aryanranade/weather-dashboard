import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { favoritesService } from '../services/services';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import WeatherCard from '../components/WeatherCard';
import ForecastCard from '../components/ForecastCard';
import FavoritesList from '../components/FavoritesList';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [currentWeather, setCurrentWeather] = useState(null);
  const [error, setError] = useState('');
  const [favoriteCities, setFavoriteCities] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  const [isNight, setIsNight] = useState(true); // Default to night

  useEffect(() => {
    if (user) {
      loadFavoriteCities();
    }
  }, [user]);

  // Determine if it's day or night based on current weather
  useEffect(() => {
    if (currentWeather && currentWeather.sunrise && currentWeather.sunset) {
      const now = new Date();
      const currentTime = Math.floor(now.getTime() / 1000);
      const sunrise = currentWeather.sunrise;
      const sunset = currentWeather.sunset;
      
      // Check if current time is between sunrise and sunset (day) or not (night)
      const night = currentTime < sunrise || currentTime > sunset;
      setIsNight(night);
    }
  }, [currentWeather]);

  const loadFavoriteCities = async () => {
    try {
      const cities = await favoritesService.getFavoriteCities(user.id);
      setFavoriteCities(cities);
    } catch (err) {
      console.error('Failed to load favourite cities:', err);
    }
  };

  const handleWeatherData = (weatherData) => {
    setCurrentWeather(weatherData);
    setError('');
    
    // Check if current city is in favourites
    const isCityFavorite = favoriteCities.includes(weatherData.cityName);
    setIsFavorite(isCityFavorite);
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
    setCurrentWeather(null);
  };

  const handleAddToFavorites = async (cityName) => {
    try {
      setFavoritesLoading(true);
      await favoritesService.addFavoriteCity(user.id, cityName);
      setFavoriteCities([...favoriteCities, cityName]);
      setIsFavorite(true);
    } catch (err) {
      setError('Failed to add city to favourites');
    } finally {
      setFavoritesLoading(false);
    }
  };

  const handleRemoveFromFavorites = async (cityName) => {
    try {
      setFavoritesLoading(true);
      await favoritesService.removeFavoriteCity(user.id, cityName);
      setFavoriteCities(favoriteCities.filter(city => city !== cityName));
      setIsFavorite(false);
    } catch (err) {
      setError('Failed to remove city from favourites');
    } finally {
      setFavoritesLoading(false);
    }
  };

  const handleWeatherSelect = (weatherData) => {
    setCurrentWeather(weatherData);
    setError('');
    
    // Check if selected city is in favourites
    const isCityFavorite = favoriteCities.includes(weatherData.cityName);
    setIsFavorite(isCityFavorite);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Time-based background */}
      {isNight ? (
        // Starry night background
        <div className="absolute inset-0">
          {/* Stars with variety */}
          {[...Array(150)].map((_, i) => {
            const seed = i * 137.508;
            const left = ((seed * 1000) % 10000) / 100;
            const top = ((seed * 2000) % 10000) / 100;
            const size = 0.5 + ((seed * 100) % 200) / 100;
            const opacity = 0.4 + ((seed * 100) % 60) / 100;
            const isYellow = (seed * 50) % 100 < 15; // ~15% yellow stars
            const hasGlow = (seed * 30) % 100 < 25; // ~25% stars have glow
            const starColor = isYellow ? '#FFE4B5' : '#FFFFFF';
            const glowSize = size * (2 + ((seed * 20) % 10));
            
            return (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                  backgroundColor: starColor,
                  opacity: opacity,
                  boxShadow: hasGlow ? `0 0 ${glowSize}px ${glowSize / 2}px ${starColor}40` : 'none',
                  filter: hasGlow ? 'blur(0.5px)' : 'none',
                }}
              />
            );
          })}
          {/* Dark blue gradient background */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-950 via-slate-900 to-blue-900"></div>
        </div>
      ) : (
        // Dark daytime theme
        <div className="absolute inset-0">
          {/* Dark cloudy overlay */}
          {[...Array(8)].map((_, i) => {
            const seed = i * 123.456;
            const left = ((seed * 1000) % 80);
            const top = ((seed * 800) % 70);
            const width = 100 + ((seed * 500) % 150);
            const height = 60 + ((seed * 300) % 100);
            const opacity = 0.15 + ((seed * 100) % 20) / 100;
            return (
              <div
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  width: `${width}px`,
                  height: `${height}px`,
                  opacity: opacity,
                  filter: 'blur(40px)',
                }}
              />
            );
          })}
          {/* Gradient for depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900"></div>
        </div>
      )}
      
      <div className="relative z-10">
        <Navbar onLogout={handleLogout} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Search Section */}
          <SearchBar 
            onWeatherData={handleWeatherData}
            onError={handleError}
          />

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-900/50 border border-red-700/50 text-red-200 px-4 py-3 rounded-lg"
            >
              {error}
            </motion.div>
          )}

          {/* Current Weather */}
          {currentWeather && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <WeatherCard
                weather={currentWeather}
                onAddToFavorites={handleAddToFavorites}
                onRemoveFromFavorites={handleRemoveFromFavorites}
                isFavorite={isFavorite}
                loading={favoritesLoading}
              />
            </motion.div>
          )}

          {/* Forecast */}
          {currentWeather?.forecast && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <ForecastCard forecast={currentWeather.forecast} />
            </motion.div>
          )}

          {/* Favourites */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <FavoritesList onWeatherSelect={handleWeatherSelect} />
          </motion.div>
        </motion.div>
      </div>
      </div>
    </div>
  );
};

export default Dashboard;
