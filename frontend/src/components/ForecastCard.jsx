import React from 'react';
import { motion } from 'framer-motion';

const ForecastCard = ({ forecast }) => {
  if (!forecast || forecast.length === 0) return null;

  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  const isClearSky = (description, iconCode) => {
    const desc = description?.toLowerCase() || '';
    // Check if description includes clear/sun, or icon code is 01d/01n (clear sky)
    return desc.includes('clear') || desc.includes('sun') || iconCode?.startsWith('01');
  };

  const getIconStyle = (description, iconCode) => {
    if (isClearSky(description, iconCode)) {
      // Apply filters to make the sun yellow
      // Converting black/white to a vibrant yellow color
      return {
        filter: 'invert(1) sepia(1) saturate(8) hue-rotate(0deg) brightness(1.1)',
      };
    }
    return {};
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800/40 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-700/50"
    >
      <h3 className="text-xl font-bold text-white mb-6">5-Day Forecast</h3>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {forecast.map((day, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="text-center p-4 bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-all"
          >
            <p className="text-sm font-semibold text-white mb-2">{day.date}</p>
            <img
              src={getWeatherIcon(day.icon)}
              alt={day.description}
              className="w-12 h-12 mx-auto mb-2"
              style={getIconStyle(day.description, day.icon)}
            />
            <p className="text-xs text-gray-400 capitalize mb-2">{day.description}</p>
            <div className="text-sm font-bold text-white">
              <span className="text-blue-400">{Math.round(day.maxTemp)}°</span>
              <span className="text-gray-500 mx-1">/</span>
              <span className="text-gray-400">{Math.round(day.minTemp)}°</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ForecastCard;
